import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

// Cache for user data to avoid repeated fetches
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const userService = {
  // Get user data by UID
  async getUserData(uid) {
    if (!uid) return null;

    // Check cache first
    const cached = userCache.get(uid);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = { uid, ...userDoc.data() };

        // Cache the result
        userCache.set(uid, {
          data: userData,
          timestamp: Date.now(),
        });

        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },

  // Get multiple users data by UIDs
  async getUsersData(uids) {
    if (!uids || uids.length === 0) return {};

    const uniqueUids = [...new Set(uids)];
    const users = {};
    const uncachedUids = [];

    // Check cache for each UID
    for (const uid of uniqueUids) {
      const cached = userCache.get(uid);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        users[uid] = cached.data;
      } else {
        uncachedUids.push(uid);
      }
    }

    // Fetch uncached users
    if (uncachedUids.length > 0) {
      try {
        // Firestore 'in' queries are limited to 10 items, so we batch them
        const batches = [];
        for (let i = 0; i < uncachedUids.length; i += 10) {
          batches.push(uncachedUids.slice(i, i + 10));
        }

        for (const batch of batches) {
          const q = query(
            collection(db, "users"),
            where("__name__", "in", batch)
          );

          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            const userData = { uid: doc.id, ...doc.data() };
            users[doc.id] = userData;

            // Cache the result
            userCache.set(doc.id, {
              data: userData,
              timestamp: Date.now(),
            });
          });
        }
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    }

    return users;
  },

  // Clear cache for a specific user (useful when user updates their profile)
  clearUserCache(uid) {
    userCache.delete(uid);
  },

  // Clear all cache
  clearAllCache() {
    userCache.clear();
  },

  // Search user profiles by name, bio, and role
  async searchProfiles(searchQuery, limitCount = 20) {
    try {
      // Get all users (we'll filter on client side since Firestore doesn't support full-text search)
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      const allUsers = [];

      snapshot.forEach((doc) => {
        allUsers.push({ uid: doc.id, ...doc.data() });
      });

      // Filter users based on search query
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      const filteredUsers = allUsers.filter(user => {
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const bio = (user.bio || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        const searchText = `${firstName} ${lastName} ${bio} ${role}`;
        
        return searchTerms.some(term => searchText.includes(term));
      });

      // Sort by relevance (users with more matching terms first)
      const scoredUsers = filteredUsers.map(user => {
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const bio = (user.bio || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        const searchText = `${firstName} ${lastName} ${bio} ${role}`;
        
        const score = searchTerms.reduce((acc, term) => {
          const matches = (searchText.match(new RegExp(term, 'g')) || []).length;
          // Give higher weight to name matches
          const nameMatches = (`${firstName} ${lastName}`.match(new RegExp(term, 'g')) || []).length;
          return acc + matches + (nameMatches * 2);
        }, 0);
        
        return { ...user, searchScore: score };
      });

      scoredUsers.sort((a, b) => b.searchScore - a.searchScore);

      return {
        success: true,
        profiles: scoredUsers.slice(0, limitCount),
      };
    } catch (error) {
      console.error("Error searching profiles:", error);
      return { success: false, error: error.message };
    }
  },
};

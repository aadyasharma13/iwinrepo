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
};

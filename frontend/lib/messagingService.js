import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";

export const messagingService = {
  // Create a group conversation
  async createGroup(creatorId, groupName, groupDescription, memberIds = []) {
    try {
      // Include creator in members list
      const allMembers = [creatorId, ...memberIds.filter(id => id !== creatorId)];
      
      if (allMembers.length > 50) {
        return { success: false, error: "Group cannot have more than 50 members" };
      }

      const groupData = {
        type: "group",
        name: groupName,
        description: groupDescription || "",
        participants: allMembers,
        adminIds: [creatorId],
        createdBy: creatorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: Object.fromEntries(allMembers.map(id => [id, 0])),
        isSearchable: true,
        memberCount: allMembers.length,
      };

      const docRef = await addDoc(collection(db, "conversations"), groupData);

      return {
        success: true,
        conversation: { id: docRef.id, ...groupData },
      };
    } catch (error) {
      console.error("Error creating group:", error);
      return { success: false, error: error.message };
    }
  },

  // Add member to group
  async addGroupMember(groupId, adminId, newMemberId) {
    try {
      const groupRef = doc(db, "conversations", groupId);
      const groupDoc = await getDoc(groupRef);
      
      if (!groupDoc.exists()) {
        return { success: false, error: "Group not found" };
      }

      const groupData = groupDoc.data();
      
      // Check if user is admin
      if (!groupData.adminIds?.includes(adminId)) {
        return { success: false, error: "Only admins can add members" };
      }

      // Check if member already exists
      if (groupData.participants.includes(newMemberId)) {
        return { success: false, error: "User is already a member" };
      }

      // Check member limit
      if (groupData.participants.length >= 50) {
        return { success: false, error: "Group has reached maximum capacity (50 members)" };
      }

      await updateDoc(groupRef, {
        participants: arrayUnion(newMemberId),
        [`unreadCount.${newMemberId}`]: 0,
        memberCount: groupData.participants.length + 1,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error adding group member:", error);
      return { success: false, error: error.message };
    }
  },

  // Remove member from group
  async removeGroupMember(groupId, adminId, memberToRemove) {
    try {
      const groupRef = doc(db, "conversations", groupId);
      const groupDoc = await getDoc(groupRef);
      
      if (!groupDoc.exists()) {
        return { success: false, error: "Group not found" };
      }

      const groupData = groupDoc.data();
      
      // Check if user is admin or removing themselves
      if (!groupData.adminIds?.includes(adminId) && adminId !== memberToRemove) {
        return { success: false, error: "Only admins can remove members" };
      }

      // Can't remove the group creator unless they're leaving themselves
      if (memberToRemove === groupData.createdBy && adminId !== memberToRemove) {
        return { success: false, error: "Cannot remove group creator" };
      }

      const updatedParticipants = groupData.participants.filter(id => id !== memberToRemove);
      const updatedAdminIds = groupData.adminIds.filter(id => id !== memberToRemove);
      const updatedUnreadCount = { ...groupData.unreadCount };
      delete updatedUnreadCount[memberToRemove];

      await updateDoc(groupRef, {
        participants: updatedParticipants,
        adminIds: updatedAdminIds,
        unreadCount: updatedUnreadCount,
        memberCount: updatedParticipants.length,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error removing group member:", error);
      return { success: false, error: error.message };
    }
  },

  // Update group info
  async updateGroupInfo(groupId, adminId, updates) {
    try {
      const groupRef = doc(db, "conversations", groupId);
      const groupDoc = await getDoc(groupRef);
      
      if (!groupDoc.exists()) {
        return { success: false, error: "Group not found" };
      }

      const groupData = groupDoc.data();
      
      // Check if user is admin
      if (!groupData.adminIds?.includes(adminId)) {
        return { success: false, error: "Only admins can update group info" };
      }

      const allowedUpdates = {};
      if (updates.name) allowedUpdates.name = updates.name;
      if (updates.description !== undefined) allowedUpdates.description = updates.description;
      if (updates.isSearchable !== undefined) allowedUpdates.isSearchable = updates.isSearchable;
      
      allowedUpdates.updatedAt = serverTimestamp();

      await updateDoc(groupRef, allowedUpdates);

      return { success: true };
    } catch (error) {
      console.error("Error updating group info:", error);
      return { success: false, error: error.message };
    }
  },

  // Search for groups
  async searchGroups(searchQuery, limit = 20) {
    try {
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("type", "==", "group"),
        where("isSearchable", "==", true)
      );

      const snapshot = await getDocs(q);
      const groups = [];

      snapshot.forEach((doc) => {
        const groupData = { id: doc.id, ...doc.data() };
        const name = (groupData.name || '').toLowerCase();
        const description = (groupData.description || '').toLowerCase();
        const searchTerm = searchQuery.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
          groups.push(groupData);
        }
      });

      // Sort by member count (popular groups first)
      groups.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));

      return {
        success: true,
        groups: groups.slice(0, limit),
      };
    } catch (error) {
      console.error("Error searching groups:", error);
      return { success: false, error: error.message };
    }
  },

  // Create or get existing conversation between two users
  async getOrCreateConversation(currentUserId, otherUserId) {
    try {
      // Check if conversation already exists
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("participants", "array-contains", currentUserId)
      );

      const snapshot = await getDocs(q);
      let existingConversation = null;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(otherUserId)) {
          existingConversation = { id: doc.id, ...data };
        }
      });

      if (existingConversation) {
        return { success: true, conversation: existingConversation };
      }

      // Create new conversation
      const newConversation = {
        type: "direct",
        participants: [currentUserId, otherUserId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: {
          [currentUserId]: 0,
          [otherUserId]: 0,
        },
      };

      const docRef = await addDoc(conversationsRef, newConversation);

      return {
        success: true,
        conversation: { id: docRef.id, ...newConversation },
      };
    } catch (error) {
      console.error("Error getting/creating conversation:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all conversations for a user
  async getUserConversations(userId) {
    try {
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("participants", "array-contains", userId)
      );

      const snapshot = await getDocs(q);
      const conversations = [];

      snapshot.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() });
      });

      // Sort on client side to avoid index requirement
      conversations.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0);
        const bTime = b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0);
        return bTime - aTime; // Descending order (newest first)
      });

      return { success: true, conversations };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { success: false, error: error.message };
    }
  },

  // Send a message
  async sendMessage(conversationId, senderId, content, messageType = "text") {
    try {
      // Add message to messages subcollection
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      const messageData = {
        senderId,
        content,
        messageType,
        createdAt: serverTimestamp(),
        readBy: [senderId], // Sender has read the message
      };

      const messageDoc = await addDoc(messagesRef, messageData);

      // Update conversation with last message info
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();
        const otherParticipant = conversationData.participants.find(p => p !== senderId);
        
        await updateDoc(conversationRef, {
          lastMessage: content,
          lastMessageTime: serverTimestamp(),
          updatedAt: serverTimestamp(),
          [`unreadCount.${otherParticipant}`]: (conversationData.unreadCount?.[otherParticipant] || 0) + 1,
        });
      }

      return { success: true, messageId: messageDoc.id };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error: error.message };
    }
  },

  // Get messages for a conversation
  async getMessages(conversationId, limitCount = 50, lastMessageDoc = null) {
    try {
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      let q = query(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      if (lastMessageDoc) {
        q = query(q, startAfter(lastMessageDoc));
      }

      const snapshot = await getDocs(q);
      const messages = [];

      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        messages: messages.reverse(), // Reverse to show oldest first
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { success: false, error: error.message };
    }
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId, userId) {
    try {
      // Update conversation unread count
      const conversationRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${userId}`]: 0,
      });

      // Update individual messages (optional - for more detailed read receipts)
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      const q = query(
        messagesRef,
        where("readBy", "not-in", [[userId]]),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const updatePromises = [];

      snapshot.forEach((doc) => {
        const messageRef = doc.ref;
        updatePromises.push(
          updateDoc(messageRef, {
            readBy: arrayUnion(userId),
          })
        );
      });

      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return { success: false, error: error.message };
    }
  },

  // Listen to real-time messages
  subscribeToMessages(conversationId, callback) {
    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  },

  // Listen to real-time conversations
  subscribeToConversations(userId, callback) {
    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = [];
      snapshot.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort on client side to avoid index requirement
      conversations.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0);
        const bTime = b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0);
        return bTime - aTime; // Descending order (newest first)
      });
      
      callback(conversations);
    });
  },

  // Delete a message
  async deleteMessage(conversationId, messageId) {
    try {
      const messageRef = doc(db, "conversations", conversationId, "messages", messageId);
      await deleteDoc(messageRef);

      return { success: true };
    } catch (error) {
      console.error("Error deleting message:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete entire conversation
  async deleteConversation(conversationId) {
    try {
      // Delete all messages first
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);
      
      const deletePromises = messagesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Delete the conversation
      const conversationRef = doc(db, "conversations", conversationId);
      await deleteDoc(conversationRef);

      return { success: true };
    } catch (error) {
      console.error("Error deleting conversation:", error);
      return { success: false, error: error.message };
    }
  },

  // Get total unread count for user
  async getTotalUnreadCount(userId) {
    try {
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("participants", "array-contains", userId)
      );

      const snapshot = await getDocs(q);
      let totalUnread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalUnread += data.unreadCount?.[userId] || 0;
      });

      return { success: true, totalUnread };
    } catch (error) {
      console.error("Error getting total unread count:", error);
      return { success: false, error: error.message };
    }
  },
};

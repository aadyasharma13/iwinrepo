import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

class JournalService {
  // Create a new journal entry
  async createJournal(userId, journalData) {
    try {
      const journalRef = collection(db, 'journals');
      
      // Prepare the journal data
      const journal = {
        userId,
        title: journalData.title,
        content: journalData.content,
        type: journalData.type,
        isPublic: journalData.isPublic,
        tags: journalData.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        author: journalData.author || 'Anonymous'
      };

      // Handle media uploads if present
      if (journalData.audioBlob) {
        const audioUrl = await this.uploadMedia(journalData.audioBlob, 'audio', userId);
        journal.audioUrl = audioUrl;
      }

      if (journalData.videoBlob) {
        const videoUrl = await this.uploadMedia(journalData.videoBlob, 'video', userId);
        journal.videoUrl = videoUrl;
      }

      const docRef = await addDoc(journalRef, journal);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating journal:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload media files to Firebase Storage
  async uploadMedia(blob, type, userId) {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}_${type}_${timestamp}`;
      const storageRef = ref(storage, `journals/${type}/${fileName}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  // Get all journals for a specific user
  async getUserJournals(userId) {
    try {
      const journalsRef = collection(db, 'journals');
      const q = query(
        journalsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const journals = [];
      
      querySnapshot.forEach((doc) => {
        journals.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      
      // Sort by createdAt in JavaScript since we can't use orderBy with where
      journals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, journals };
    } catch (error) {
      console.error('Error getting user journals:', error);
      return { success: false, error: error.message, journals: [] };
    }
  }

  // Get public journals (for community viewing)
  async getPublicJournals(limit = 20) {
    try {
      const journalsRef = collection(db, 'journals');
      const q = query(
        journalsRef,
        where('isPublic', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const journals = [];
      
      querySnapshot.forEach((doc) => {
        journals.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      
      // Sort by createdAt in JavaScript and limit results
      journals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, journals: journals.slice(0, limit) };
    } catch (error) {
      console.error('Error getting public journals:', error);
      return { success: false, error: error.message, journals: [] };
    }
  }

  // Update a journal entry
  async updateJournal(journalId, updates) {
    try {
      const journalRef = doc(db, 'journals', journalId);
      await updateDoc(journalRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating journal:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a journal entry
  async deleteJournal(journalId) {
    try {
      const journalRef = doc(db, 'journals', journalId);
      await deleteDoc(journalRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting journal:', error);
      return { success: false, error: error.message };
    }
  }

  // Like a journal entry
  async likeJournal(journalId) {
    try {
      const journalRef = doc(db, 'journals', journalId);
      await updateDoc(journalRef, {
        likes: serverTimestamp() // This will increment the likes count
      });
      return { success: true };
    } catch (error) {
      console.error('Error liking journal:', error);
      return { success: false, error: error.message };
    }
  }

  // Get journals by tags
  async getJournalsByTag(tag) {
    try {
      const journalsRef = collection(db, 'journals');
      const q = query(
        journalsRef,
        where('tags', 'array-contains', tag),
        where('isPublic', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const journals = [];
      
      querySnapshot.forEach((doc) => {
        journals.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      
      // Sort by createdAt in JavaScript
      journals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, journals };
    } catch (error) {
      console.error('Error getting journals by tag:', error);
      return { success: false, error: error.message, journals: [] };
    }
  }
}

export const journalService = new JournalService();

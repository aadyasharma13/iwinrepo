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
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export const postsService = {
  // Create a new post
  async createPost(postData) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content: postData.content,
        authorId: postData.authorId,
        tags: postData.tags || [],
        images: postData.images || [],
        imagePaths: postData.imagePaths || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating post:", error);
      return { success: false, error: error.message };
    }
  },

  // Get posts with pagination
  async getPosts(lastPostDoc = null, limitCount = 10, filterBy = null) {
    try {
      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      // Note: For role filtering, we'll need to fetch all posts and filter on client side
      // since we're not storing role in posts anymore
      if (lastPostDoc) {
        q = query(q, startAfter(lastPostDoc));
      }

      const snapshot = await getDocs(q);
      const posts = [];

      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        posts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user's posts
  async getUserPosts(userId) {
    try {
      const q = query(
        collection(db, "posts"),
        where("authorId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const posts = [];

      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, posts };
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return { success: false, error: error.message };
    }
  },

  // Update post
  async updatePost(postId, updateData) {
    try {
      await updateDoc(doc(db, "posts", postId), {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating post:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      // Get post data first to access image paths
      const postDoc = await getDoc(doc(db, "posts", postId));
      const postData = postDoc.exists() ? postDoc.data() : null;

      // Delete all comments for this post first
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);

      const deletePromises = commentsSnapshot.docs.map((commentDoc) =>
        deleteDoc(doc(db, "comments", commentDoc.id))
      );
      await Promise.all(deletePromises);

      // Delete the post document
      await deleteDoc(doc(db, "posts", postId));

      // Return post data so the caller can handle image cleanup
      return { 
        success: true, 
        imagePaths: postData?.imagePaths || [] 
      };
    } catch (error) {
      console.error("Error deleting post:", error);
      return { success: false, error: error.message };
    }
  },

  // Like/Unlike post
  async toggleLike(postId, userId) {
    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        return { success: false, error: "Post not found" };
      }

      const postData = postDoc.data();
      const likes = postData.likes || [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        // Unlike
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
          likesCount: increment(-1),
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
          likesCount: increment(1),
        });
      }

      return { success: true, isLiked: !isLiked };
    } catch (error) {
      console.error("Error toggling like:", error);
      return { success: false, error: error.message };
    }
  },

  // Add comment
  async addComment(postId, commentData) {
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        content: commentData.content,
        authorId: commentData.authorId,
        postId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Increment comments count on post
      await updateDoc(doc(db, "posts", postId), {
        commentsCount: increment(1),
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding comment:", error);
      return { success: false, error: error.message };
    }
  },

  // Get comments for post
  async getComments(postId) {
    try {
      const q = query(
        collection(db, "comments"),
        where("postId", "==", postId),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);
      const comments = [];

      snapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, comments };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return { success: false, error: error.message };
    }
  },

  // Update comment
  async updateComment(commentId, updateData) {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating comment:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete comment
  async deleteComment(commentId, postId) {
    try {
      await deleteDoc(doc(db, "comments", commentId));

      // Decrement comments count on post
      await updateDoc(doc(db, "posts", postId), {
        commentsCount: increment(-1),
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      return { success: false, error: error.message };
    }
  },

  // Search posts by content and tags
  async searchPosts(searchQuery, limitCount = 20) {
    try {
      // Get all posts (we'll filter on client side since Firestore doesn't support full-text search)
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(100) // Get more posts to search through
      );

      const snapshot = await getDocs(q);
      const allPosts = [];

      snapshot.forEach((doc) => {
        allPosts.push({ id: doc.id, ...doc.data() });
      });

      // Filter posts based on search query
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      const filteredPosts = allPosts.filter(post => {
        const content = (post.content || '').toLowerCase();
        const tags = (post.tags || []).join(' ').toLowerCase();
        const searchText = `${content} ${tags}`;
        
        return searchTerms.some(term => searchText.includes(term));
      });

      // Sort by relevance (posts with more matching terms first)
      const scoredPosts = filteredPosts.map(post => {
        const content = (post.content || '').toLowerCase();
        const tags = (post.tags || []).join(' ').toLowerCase();
        const searchText = `${content} ${tags}`;
        
        const score = searchTerms.reduce((acc, term) => {
          const matches = (searchText.match(new RegExp(term, 'g')) || []).length;
          return acc + matches;
        }, 0);
        
        return { ...post, searchScore: score };
      });

      scoredPosts.sort((a, b) => b.searchScore - a.searchScore);

      return {
        success: true,
        posts: scoredPosts.slice(0, limitCount),
      };
    } catch (error) {
      console.error("Error searching posts:", error);
      return { success: false, error: error.message };
    }
  },

  // Search comments by content
  async searchComments(searchQuery, limitCount = 20) {
    try {
      // Get all comments (we'll filter on client side)
      const q = query(
        collection(db, "comments"),
        orderBy("createdAt", "desc"),
        limit(200) // Get more comments to search through
      );

      const snapshot = await getDocs(q);
      const allComments = [];

      snapshot.forEach((doc) => {
        allComments.push({ id: doc.id, ...doc.data() });
      });

      // Filter comments based on search query
      const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
      const filteredComments = allComments.filter(comment => {
        const content = (comment.content || '').toLowerCase();
        
        return searchTerms.some(term => content.includes(term));
      });

      // Sort by relevance
      const scoredComments = filteredComments.map(comment => {
        const content = (comment.content || '').toLowerCase();
        
        const score = searchTerms.reduce((acc, term) => {
          const matches = (content.match(new RegExp(term, 'g')) || []).length;
          return acc + matches;
        }, 0);
        
        return { ...comment, searchScore: score };
      });

      scoredComments.sort((a, b) => b.searchScore - a.searchScore);

      return {
        success: true,
        comments: scoredComments.slice(0, limitCount),
      };
    } catch (error) {
      console.error("Error searching comments:", error);
      return { success: false, error: error.message };
    }
  },
};

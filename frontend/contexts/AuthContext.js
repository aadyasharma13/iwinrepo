'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification as firebaseSendEmailVerification,
  reload
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot // Add this import for real-time updates
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous Firestore listener
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          
          // First, get the current user data
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Set up real-time listener for user document changes
            unsubscribeFirestore = onSnapshot(userDocRef, async (docSnapshot) => {
              if (docSnapshot.exists()) {
                const realtimeUserData = docSnapshot.data();
                
                // Always use Firebase Auth as source of truth for emailVerified
                const currentUser = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  emailVerified: firebaseUser.emailVerified,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  ...realtimeUserData
                };

                // If email verification status changed in Firebase, update Firestore
                if (realtimeUserData.emailVerified !== firebaseUser.emailVerified) {
                  try {
                    await updateDoc(userDocRef, {
                      emailVerified: firebaseUser.emailVerified,
                      emailVerifiedAt: firebaseUser.emailVerified ? new Date().toISOString() : null
                    });
                    currentUser.emailVerified = firebaseUser.emailVerified;
                    currentUser.emailVerifiedAt = firebaseUser.emailVerified ? new Date().toISOString() : null;
                  } catch (updateError) {
                    console.error('Error updating email verification status:', updateError);
                  }
                }
                
                console.log('Real-time user data update:', currentUser);
                setUser(currentUser);
              } else {
                console.log('User document deleted');
                setUser(null);
              }
            }, (error) => {
              console.error('Error in Firestore listener:', error);
              // Fallback to one-time fetch if listener fails
              getDoc(userDocRef).then(fallbackDoc => {
                if (fallbackDoc.exists()) {
                  const fallbackData = fallbackDoc.data();
                  setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    ...fallbackData
                  });
                }
              }).catch(fallbackError => {
                console.error('Fallback fetch also failed:', fallbackError);
                setUser(null);
              });
            });

          } else {
            // New user - create minimal user document
            console.log('Creating user document for new user:', firebaseUser.email);
            
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              profileCompleted: false,
              displayName: firebaseUser.displayName || null,
              photoURL: firebaseUser.photoURL || null,
              role: null,
              profileVisibility: 'public',
              bio: '',
              location: '',
              roleSpecificData: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              authProvider: 'email',
              isActive: true
            };

            await setDoc(userDocRef, newUserData);
            
            // Set up listener for the newly created document
            unsubscribeFirestore = onSnapshot(userDocRef, (docSnapshot) => {
              if (docSnapshot.exists()) {
                const realtimeUserData = docSnapshot.data();
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  emailVerified: firebaseUser.emailVerified,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  ...realtimeUserData
                });
              }
            }, (error) => {
              console.error('Error in new user Firestore listener:', error);
              setUser(newUserData); // Fallback to initial data
            });
          }
        } catch (error) {
          console.error('Error setting up user data:', error);
          setUser(null);
        }
      } else {
        // User signed out
        console.log('User signed out');
        setUser(null);
      }
      
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up AuthContext listeners');
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadURL, path: path };
    } catch (error) {
      console.error('File upload error:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteFile = async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error('File delete error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification immediately
      await firebaseSendEmailVerification(result.user);
      
      // Note: User document will be created automatically by onAuthStateChanged
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const sendEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await firebaseSendEmailVerification(auth.currentUser);
        return { success: true };
      } catch (error) {
        console.error('Send verification error:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const checkEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        console.log('Checking email verification status...');
        await reload(auth.currentUser);
        const isVerified = auth.currentUser.emailVerified;
        console.log('Email verification status:', isVerified);
        
        // If verification status changed, the real-time listener will automatically
        // update the user state when we update Firestore
        if (isVerified && user && !user.emailVerified) {
          console.log('Email verification status changed, updating Firestore...');
          
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDocRef, {
            emailVerified: true,
            emailVerifiedAt: new Date().toISOString()
          });
          // No need to manually update state - the listener will handle it
        }
        
        return { success: true, verified: isVerified };
      } catch (error) {
        console.error('Check verification error:', error);
        return { success: false, error: error.message, verified: false };
      }
    }
    return { success: false, error: 'No user logged in', verified: false };
  };

  const updateUserProfile = async (updateData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }

      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Update Firestore - the real-time listener will automatically update local state
      await updateDoc(doc(db, 'users', auth.currentUser.uid), dataToUpdate);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Manual refresh function (optional - mostly for debugging or fallback)
  const refreshUserData = async () => {
    if (auth.currentUser) {
      try {
        console.log('Manually refreshing user data...');
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            emailVerified: auth.currentUser.emailVerified,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            ...userData
          });
          return { success: true };
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    sendEmailVerification,
    checkEmailVerification,
    updateUserProfile,
    uploadFile,
    deleteFile,
    refreshUserData // Add this for manual refresh if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
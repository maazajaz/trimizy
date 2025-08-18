import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebaseConfig';

// Define a type for a saved address
export type SavedAddress = {
  id: string; // Unique ID for the address
  fullAddress: string;
  additionalDetails?: string;
  receiverName?: string;
  receiverPhone?: string;
  addressType?: 'Home' | 'Work' | 'Other';
  latitude: number; // Important for map display later
  longitude: number; // Important for map display later
};

type AuthContextType = {
  user: Partial<User> | null;
  skippedLogin: boolean; // Flag to indicate if login was skipped
  logout: () => Promise<void>;
  isDev: boolean;
  setUser: (user: Partial<User> | null) => void;
  confirm: any;
  setConfirm: (confirm: any) => void;
  // Address management
  savedAddresses: SavedAddress[]; // Array to store saved addresses
  addAddress: (address: SavedAddress) => void; // Function to add an address
  // New: Selected Location management
  selectedLocation: SavedAddress | null; // Currently active selected address
  setSelectedLocation: (location: SavedAddress | null) => void; // Function to set the active address
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  skippedLogin: false, // Default skippedLogin to false
  logout: async () => {},
  isDev: false,
  setUser: () => {},
  confirm: null,
  setConfirm: () => {},
  // Context defaults
  savedAddresses: [],
  addAddress: () => {},
  // New context defaults
  selectedLocation: null, // Default to null
  setSelectedLocation: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [confirm, setConfirm] = useState<any>(null); // Stores confirmation result
  const [skippedLogin, setSkippedLogin] = useState(false); // State for skipped login
  const isDev = __DEV__;

  // State for saved addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  // New: State for the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<SavedAddress | null>(null);

  // Function to add an address
  const addAddress = (newAddress: SavedAddress) => {
    setSavedAddresses(prevAddresses => {
      const existingIndex = prevAddresses.findIndex(addr => addr.id === newAddress.id);
      if (existingIndex > -1) {
        const updatedAddresses = [...prevAddresses];
        updatedAddresses[existingIndex] = newAddress;
        return updatedAddresses;
      } else {
        return [...prevAddresses, newAddress];
      }
    });
    // If it's the first address saved, automatically select it
    if (savedAddresses.length === 0) {
      setSelectedLocation(newAddress);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      setUser(firebaseUser);
      setSkippedLogin(!firebaseUser); // Set skippedLogin to true if no user is authenticated
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSkippedLogin(true); // Reset skippedLogin on logout
      setSavedAddresses([]); // Clear addresses on logout
      setSelectedLocation(null); // Clear selected location on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        skippedLogin,
        logout,
        isDev,
        setUser,
        confirm,
        setConfirm,
        savedAddresses,
        addAddress,
        selectedLocation, // Provide selectedLocation
        setSelectedLocation, // Provide setSelectedLocation function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

type ExtendedUser = Partial<User> & { displayName?: string };
export { ExtendedUser };


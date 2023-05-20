import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manageUser = onAuthStateChanged(auth, (user) => {
      setLoading(true);

      if (auth.currentUser) {
        setCurrUser(user);
        setLoading(false);
      } else {
        setCurrUser({});
        setLoading(false);
      }
    });

    return () => manageUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

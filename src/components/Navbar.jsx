import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Han Chat</span>
      <div className="user">
        <img src={currUser.photoURL} alt={currUser.displayName} />
        <span>{currUser.displayName}</span>
        <button type="button" onClick={() => signOut(auth)}>
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

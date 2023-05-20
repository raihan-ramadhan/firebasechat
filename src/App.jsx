import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import "./style.scss";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const { currUser, loading } = useContext(AuthContext);
  if (loading) return <Placeholder />;
  return Object.entries(currUser).length > 0 ? (
    children
  ) : (
    <Navigate to={"/login"} />
  );
}

function Placeholder() {
  return (
    <div className="placeholder">
      <div className="loader" />
    </div>
  );
}

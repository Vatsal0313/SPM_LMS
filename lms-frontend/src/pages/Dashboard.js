import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User data received:", data); // Debugging
        if (data.user) {
          setUser(data.user);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        navigate("/");
      });
  }, [navigate]);

  // ✅ Logout function
  const handleLogout = async () => {
    try {
      await logout(); // Call API to clear cookie
      localStorage.removeItem("token"); // Remove token from storage
      setUser(null); // Clear user state
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? <h1>Welcome, {user.name}!</h1> : <p>Loading...</p>}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

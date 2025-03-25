import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found! User might not be logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/Profile/get-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ Fetched User Profile:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err.response?.data || err);

        // 🔹 Handle Expired or Invalid Token
        if (err.response?.status === 401) {
          console.warn("⚠️ Token expired. Logging out...");
          localStorage.removeItem("token"); // Remove invalid token
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

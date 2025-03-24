import axios from "axios"
import { Children } from "react";
import  {createContext, useState, useEffect} from "react"

export const UserContext = createContext();

export const UserProvider =  ({children}) => {
    
    const [user,setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/Profile/get-profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
          } catch (err) {
            console.error("Error fetching profile:", err);
          }
        };
    
        fetchProfile();
      }, []);

      return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
      )
}
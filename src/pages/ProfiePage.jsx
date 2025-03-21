import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSettings, FiCheck } from "react-icons/fi";
import { Avatar } from "@mui/material";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile photo change
  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav title={"Profile"} />
        <main className="p-6 space-y-4">
          {/* Profile Header */}
          <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  src={user.profilePhoto || "https://via.placeholder.com/150"}
                  sx={{ width: 96, height: 96, border: "4px solid #d1d5db" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-photo"
                  onChange={handleProfilePhotoChange}
                />
                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow-lg"
                >
                  <FiEdit className="text-gray-600" />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white ml-3">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 ml-3">{user.occupation || "Not specified"}</p>
              </div>
              <button onClick={() => navigate("/settings")} className="ml-auto p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <FiSettings className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProfileCard
              title="Personal Information"
              user={user}
              fields={["name", "DOB", "bio"]}
              onChange={(updatedData) => setUser((prev) => ({ ...prev, ...updatedData }))}
              endpoint="update-profile"
            />

            <ProfileCard
              title="Contact Information"
              user={user}
              fields={["email", "address", "phone"]}
              onChange={(updatedData) => setUser((prev) => ({ ...prev, ...updatedData }))}
              endpoint="update-contact"
            />

            <ProfileCard
              title="Professional Information"
              user={user}
              fields={["organization", "occupation", "skills"]}
              onChange={(updatedData) => setUser((prev) => ({ ...prev, ...updatedData }))}
              endpoint="update-professional"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// **Editable Profile Card Component**
const ProfileCard = ({ title, user, fields, onChange, endpoint }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Initialize formData with existing user data
    const initialData = {};
    fields.forEach((field) => {
      initialData[field] = user[field] || "";
    });
    return initialData;
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/Profile/${endpoint}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onChange(response.data); // Update only the changed fields
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex justify-between items-center">
        {title}
        {isEditing ? (
          <FiCheck className="text-green-500 cursor-pointer" onClick={handleSave} />
        ) : (
          <FiEdit className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setIsEditing(true)} />
        )}
      </h3>
      <div className="mt-3 space-y-2">
        {fields.map((field) => (
          <ProfileField
            key={field}
            label={field.replace(/([A-Z])/g, " $1").trim()}
            value={formData[field]}
            isEditing={isEditing}
            onChange={(value) => handleInputChange(field, value)}
          />
        ))}
      </div>
    </div>
  );
};


// **Editable Profile Field Component**
const ProfileField = ({ label, value, isEditing, onChange }) => {

  let formattedValue = value || "";

  if (label.toLowerCase() === "d o b" && value) {
    try {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        formattedValue = format(dateObj, "yyyy-MM-dd"); 
      } else {
        console.error("Invalid DOB format:", value);
      }
    } catch (error) {
      console.error("Error parsing DOB:", value, error);
    }
  }


  const [inputValue, setInputValue] = useState(formattedValue);

  useEffect(() => {
    setInputValue(formattedValue);
  }, [formattedValue]);

 

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="border-b border-gray-200 pb-2">
      <p className="text-xs text-gray-500 font-bold capitalize mb-1">{label}</p>
      <div className="text-gray-800 dark:text-white text-sm">
        {isEditing ? (
          label.toLowerCase() === "d o b" ? (
            <input
              type="date"
              value={inputValue}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : label.toLowerCase() === "address" ? (
            <textarea
              value={inputValue}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )
        ) : (
          <p>
            {label.toLowerCase() === "d o b" && isValid(parseISO(value))
              ? format(parseISO(value), "dd-MM-yyyy") // Correct format for display
              : Array.isArray(value)
                ? value.join(", ")
                : value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
};


export default ProfilePage;

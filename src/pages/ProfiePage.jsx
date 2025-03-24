import { useState, useEffect, useContext } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSettings, FiCheck, FiX } from "react-icons/fi";
import { Avatar } from "@mui/material";
import axios from "axios";
import { format, parseISO, isValid } from "date-fns";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/Profile/get-profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refresh]);

  const handleProfilePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show the uploaded image immediately
    const imageUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, photo: imageUrl }));

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8080/api/Profile/update-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      URL.revokeObjectURL(imageUrl);

      setUser((prev) => ({
        ...prev,
        photo: `http://localhost:8080${response.data.profilePhoto}`, // Ensure correct server path
      }));

      setRefresh((prev) => !prev); // Trigger re-fetch if needed
    } catch (error) {
      console.error(
        "Error uploading profile photo:",
        error.response?.data || error.message
      );
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
          <div className="relative w-full bg-black shadow-lg rounded-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  src={
                    user.photo
                      ? user.photo.startsWith("blob")
                        ? user.photo
                        : `http://localhost:8080${user.photo}`
                      : "https://via.placeholder.com/150"
                  }
                  sx={{ width: 96, height: 96, border: "4px solid #fff" }}
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
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <p className="text-md">
                  {user.occupation || "Not specified"} at {user.organization}
                </p>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="ml-auto p-2  bg-white text-blue-500 rounded-full shadow-md"
              >
                <FiSettings />
              </button>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProfileCard
              title="Personal Information"
              user={user}
              fields={["name", "DOB", "bio"]}
              onChange={(updatedData) =>
                setUser((prev) => ({ ...prev, ...updatedData }))
              }
              endpoint="update-profile"
              setRefresh={setRefresh}
            />

            <ProfileCard
              title="Contact Information"
              user={user}
              fields={["email", "address", "phone"]}
              onChange={(updatedData) =>
                setUser((prev) => ({ ...prev, ...updatedData }))
              }
              endpoint="update-contact"
              setRefresh={setRefresh}
            />

            <ProfileCard
              title="Professional Information"
              user={user}
              fields={["organization", "occupation", "skills"]}
              onChange={(updatedData) =>
                setUser((prev) => ({ ...prev, ...updatedData }))
              }
              endpoint="update-professional"
              setRefresh={setRefresh}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// **Editable Profile Card Component**
const ProfileCard = ({
  title,
  user,
  fields,
  onChange,
  endpoint,
  setRefresh,
}) => {
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

      onChange(response.data);
      setIsEditing(false);
      // setUser(response.data)
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex justify-between items-center">
        {title}
        {isEditing ? (
          <>
            <FiCheck
              className="text-green-500 hover:text-green-600 cursor-pointer"
              onClick={handleSave}
            />
            <FiX
              className="text-red-500 hover:text-red-600 cursor-pointer"
              onClick={() => setIsEditing(false)}
            />
          </>
        ) : (
          <FiEdit
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
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
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-bold uppercase mb-1">{label}</p>
      <div className="relative text-gray-800 dark:text-white text-sm">
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

import { useState } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSettings, FiCheck } from "react-icons/fi";
import { Avatar } from "@mui/material";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    profilePhoto: "https://via.placeholder.com/150",
    fullName: "John Doe",
    dateOfBirth: "01/01/1990",
    bio: "Software Developer",
    email: "johndoe@example.com",
    address: "123 Main St, City, Country",
    phone: "+1234567890",
    organization: "Tech Corp",
    occupation: "Developer",
    skills: ["React", "Node.js", "JavaScript"],
  });

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

  const handleFieldChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

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
                  src={user.profilePhoto}
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white ml-3">{user.fullName}</h2>
                <p className="text-gray-600 dark:text-gray-400 ml-3">{user.occupation} at {user.organization}</p>
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
              fields={["fullName", "dateOfBirth", "bio"]}
              onChange={handleFieldChange}
            />

            <ProfileCard
              title="Contact Information"
              user={user}
              fields={["email", "address", "phone"]}
              onChange={handleFieldChange}
            />

            <ProfileCard
              title="Professional Information"
              user={user}
              fields={["organization", "occupation", "skills"]}
              onChange={handleFieldChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// **Editable Profile Card Component**
const ProfileCard = ({ title, user, fields, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    fields.forEach((field) => {
      onChange(field, formData[field] || user[field]);
    });
    setIsEditing(false);
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
            value={user[field]}
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
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="border-b border-gray-200 pb-2">
      <p className="text-xs text-gray-500 font-bold capitalize mb-1">{label}</p>
      <div className="text-gray-800 dark:text-white text-sm">
      {isEditing ? (
          label.toLowerCase() === "address" ? (
            // Render a textarea for Address
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => onChange(inputValue)}
              className="border rounded px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            // Render an input for other fields
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => onChange(inputValue)}
              className="border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          )
        ) : (
          <p>{Array.isArray(value) ? value.join(", ") : value}</p>
        )}
      </div>
    </div>
  );
};


export default ProfilePage;

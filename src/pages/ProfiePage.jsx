import { useState } from "react";
import Sidebar from "../components/SideBar";
import TopNav from "../components/TopNav";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiSettings, FiCheck, FiX, FiCalendar } from "react-icons/fi";
import { Avatar } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    profilePhoto: "https://avatar.iran.liara.run/public/1",
    fullName: "Aayush Patel",
    dateOfBirth: "12/10/2003",
    bio: "Software Developer",
    email: "ap3017015@gmail.com",
    address: "64, In Darwaja, Near Ramji Temple, Gamdi, Anand, Gujarat, India",
    phone: "+91 7048512103",
    organization: "Tech Elecon Pvt. Ltd.",
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
      [field]:
        field === "skills" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <TopNav title={"Profile"} />
        <main className="p-6 space-y-4">
          <div className="relative w-full bg-black shadow-lg rounded-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar
                  src={user.profilePhoto}
                  sx={{
                    width: 96,
                    height: 96,
                    border: "4px solid #fff",
                  }}
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
                  className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer shadow-md"
                >
                  <FiEdit className="text-gray-600" />
                </label>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user.fullName}</h2>
                <p className="text-md">
                  {user.occupation} at {user.organization}
                </p>
              </div>
              <button
                onClick={() => navigate("/settings")}
                className="ml-auto p-2 bg-white text-blue-500 rounded-full shadow-md"
              >
                <FiSettings />
              </button>
            </div>
          </div>

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between border-b pb-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          {title}
        </h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              className="text-green-500 hover:text-green-600"
              onClick={handleSave}
            >
              <FiCheck />
            </button>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => setIsEditing(false)}
            >
              <FiX />
            </button>
          </div>
        ) : (
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => setIsEditing(true)}
          >
            <FiEdit />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {fields.map((field) => (
          <ProfileField
            key={field}
            label={field.replace(/([A-Z])/g, " $1").trim()}
            value={field === "skills" ? user[field].join(", ") : user[field]}
            isEditing={isEditing}
            onChange={(value) => handleInputChange(field, value)}
          />
        ))}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, isEditing, onChange }) => {
  const isDateField = label.toLowerCase() === "date of birth";
  const [inputValue, setInputValue] = useState(
    isDateField
      ? typeof value === "string"
        ? new Date(value.split("/").reverse().join("-")) // Convert "12/10/2003" format to Date
        : new Date(value)
      : value
  );

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
      <div className="relative text-gray-800 dark:text-white text-sm">
        {isEditing ? (
          isDateField ? (
            <div className="relative">
              <input
                type="text"
                value={inputValue.toLocaleDateString("en-GB")}
                readOnly
                className="border rounded-lg px-3 py-2 pr-10 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              />
              <FiCalendar
                className="absolute right-3 top-3 text-blue-500 cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              />

              {showDatePicker && (
                <div className="absolute top-12 left-0 z-50 bg-white p-2 shadow-md rounded-lg border">
                  <DatePicker
                    selected={inputValue}
                    onChange={(date) => {
                      const formattedDate = date.toLocaleDateString("en-GB");
                      setInputValue(date);
                      onChange(formattedDate);
                      setShowDatePicker(false);
                    }}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={60}
                  />
                </div>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => onChange(inputValue)}
              className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            {isDateField ? inputValue.toLocaleDateString("en-GB") : inputValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

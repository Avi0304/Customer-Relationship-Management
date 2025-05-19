# CRM System (MERN Stack)

This project is a full-featured Customer Relationship Management (CRM) system developed during my internship. It is built using the MERN stack (MongoDB, Express.js, React.js, and Node.js) and utilizes Git for version control.

---

## 🚧 Project Structure

The CRM system consists of three parts:

1. **Landing Website**
2. **Admin Dashboard**
3. **User Dashboard**

---

## 🌐 1. Landing Website

The landing site includes:

- Hero section
- Features
- Solutions
- Testimonials
- Contact Form (emails sent to configured address)
- Footer
- Login/Signup options

### 🔐 Authentication

- **Signup Options:** Admin or User
- Based on the selected role:
  - Admin ➝ redirects to `/admin`
  - User ➝ redirects to `/user`
- Features:
  - Forgot Password (via email OTP)
  - Remember Me option

---

## 🧑‍💼 2. Admin Dashboard

### 🏠 Dashboard Overview

- Total Revenue
- Active Customers
- Sales
- Active Deals
- Recent Activity Feed
- Tasks List
- Customer Segmentation
- Google Calendar Integration (holidays + reminders)
- Sales Overview Graphs

### 📋 Leads

- Create, Read, Update, Delete (CRUD)
- Filter by status
- Search functionality
- Export to Excel

### 👥 Customers

- Full CRUD
- Searchable
- Integrated with Sales data

### ✅ Task Management

- CRUD
- Mark as completed/incomplete
- Filter by task status

### 💼 Sales

- CRUD
- Search & Filter options

### 📅 Appointments

- CRUD
- Search & Filter
- Google Meet link generation
- Email meeting link to customers

### 📣 Marketing Campaigns

- Create campaigns via **Email** or **SMS**
- Create & manage Audience groups
- Create promoted email posts
- Filter & view all campaigns

### 🛠️ Customer Support

- CRUD support tickets
- Filter by newest/oldest
- Detailed ticket view:
  - Ticket ID
  - Priority & Status
  - Related Resources (label + URL)
  - Live Chat with user

### 🔔 Notifications

- Real-time notifications (Socket.IO)

### 🌙 Dark Mode Support

### ⚙️ Profile & Settings

- **Profile Tab:** Edit personal details
- **Security Tab:** Change password via email OTP, Enable/Disable 2FA
- **Notifications Tab:** Email & Push toggles
- **Data Management Tab:** Export/Backup/Restore, Retention Policy, Delete Account

---

## 👤 3. User Dashboard

### 🎫 Tickets

- Create and view tickets
- Categorized by:
  - Open
  - In Progress
  - Closed
- Detailed view includes:
  - Withdraw ticket option
  - Admin-added Resources
  - Support Hours
  - Chat with Admin (Support Agent)

### 💬 Feedback

- Submit feedback (shown as testimonials on the landing site)

### ⚙️ Profile & Settings

- Same as Admin (scoped to user data)

---

## 🛠 Tech Stack

- **Frontend:** React.js, TailwindCSS / Material-UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Email OTP, 2FA
- **Real-time Communication:** Socket.IO
- **Third-party Services:** Nodemailer (Email), Twilio (SMS), Google APIs (Calendar & Meet)
- **Version Control:** Git

---

## ⚙️ Getting Started

### 📁 1. Clone the Repository

```bash
git clone https://github.com/your-username/crm-system.git
cd crm-system
```

### 📦 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ..
npm install
```

### 🔧 3. Environment Setup

1. **Backend**:
   - Create a `.env` file in the `server` directory.
   - Add the following variables:
     ```env
     PORT=your_backend_port
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your_email
     EMAIL_PASS=your_email_password
     ADMIN_EMAIL=your_Admin_email
     ADMIN_REGISTRATION_KEY=Your_admin_key
     TWILIO_SID=your_twilio_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     ```

### 🔑 4. Google API Configuration

- To enable Google Calendar & Meet integration in the application:

1. **Create the .env file in the directory:**

```bash
.env
```

2. **Add your Google API credentials:**

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
```

3. **Usage in Code**

- Update the following files:

  - AppointmentSchedule.jsx
  - useGoogleCalendar.js

- To access the credentials, use:

```bash
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
```

### 🚀 5. Run the Application

1. **Backend**:

   ```bash
   cd backend
   npm run server
   ```

2. **Frontend**:

   ```bash
   cd ..
   npm run client
   ```

3. **Run Both the Backend and Frontend concurrently**
   ```bash
   npm run dev
   ```
4. **Open Application**
   Open `http://localhost:5173` in your browser to view the application.

## 📬 Contact

For any inquiries, reach out via the contact form on the landing website or email [avip56325@gmail.com](mailto:avip56325@gmail.com).

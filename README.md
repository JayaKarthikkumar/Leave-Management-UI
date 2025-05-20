# Leave Management System

A web-based Leave Management System built using JavaScript for the frontend and MySQL for the backend. It allows employees to request leaves and managers to approve or reject them.

## 🌐 Live Demo

🔗 [Leave Management System](https://leave-management-system-jk.vercel.app/login)

- **Manager Login:**  
  - Username: manager   
  - Password: `1234`

- **Employee Login:**  
  - Username: employee   
  - Password: `4321`

## 📌 Features

### Employee
- Login with credentials
- Submit leave requests
- View leave request status

### Manager
- Login with credentials
- View all employee leave requests
- Approve or reject leave requests

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Hosting:** Vercel (Frontend), Render/Other (Backend)

## 🗂️ Folder Structure

project-root/
leave-management-system/
├── client/ # Frontend files (HTML, CSS, JS)
│ ├── login.html # Login page for both roles
│ ├── employee.html # Employee dashboard
│ ├── manager.html # Manager dashboard
│ ├── styles/
│ │ └── styles.css # Shared styling
│ └── js/ # Frontend JavaScript files
│ ├── login.js # Handles login logic
│ ├── employee.js # Employee-specific logic
│ └── manager.js # Manager-specific logic
│
├── server/ # Backend files (Node.js + Express)
│ ├── index.js # Main server file
│ ├── db.js # MySQL DB connection setup
│ ├── routes/
│ │ └── leaveRoutes.js # API routes for leave management
│ └── controllers/
│ └── leaveController.js # Logic for handling requests
│
├── .env # Environment variables (not committed)
├── package.json # Node.js dependencies and scripts
└── README.md # Project documentation


## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/JayaKarthikkumar/Leave-Management-UI.git

2.Install backend dependencies:
cd server
npm install

3.Setup the Backend
Create a .env file in the server/ directory:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=leave_management
PORT=5000
4.4. Start the Backend
npm start

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

leave-management-system/
├── client/                      # Frontend files (HTML, CSS, JS)
│   ├── login.html               # Login page for both employee and manager
│   ├── employee.html            # Dashboard for employees
│   ├── manager.html             # Dashboard for managers
│   ├── styles/
│   │   └── styles.css           # CSS styling for all pages
│   └── js/
│       ├── login.js             # Handles login functionality
│       ├── employee.js          # Logic for employee actions (submit/view requests)
│       └── manager.js           # Logic for manager actions (approve/reject requests)
│
├── server/                      # Backend files
│   ├── index.js                 # Main Express server file
│   ├── db.js                    # MySQL database connection
│   ├── routes/
│   │   └── leaveRoutes.js       # API route definitions
│   └── controllers/
│       └── leaveController.js   # Request handling logic for leave features
│
├── .env                         # Environment variables for database connection
├── package.json                 # NPM dependencies and scripts
└── README.md                    # Project documentation



## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/JayaKarthikkumar/Leave-Management-UI.git

2. 🖥️ Set Up the Backend
bash
Copy
Edit
cd server
npm install
3. 🔐 Configure Environment Variables
Create a .env file in the server/ directory and add the following:

ini
Copy
Edit
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=leave_management
PORT=5000
4. 🧱 Set Up the Database
Log into your MySQL and run the following SQL:

sql

CREATE DATABASE leave_management;

USE leave_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50),
  role ENUM('employee', 'manager')
);

CREATE TABLE leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  from_date DATE,
  to_date DATE,
  reason TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, password, role) VALUES
('employee1', '4321', 'employee'),
('manager1', '1234', 'manager');
5. ▶️ Start the Backend Server

npm start
Server will start at http://localhost:5000.

6. 🌐 Run the Frontend
Navigate to the client/ directory:

cd ../client
Then open login.html in your browser, or deploy the folder to Vercel.

🧭 Future Improvements
🔐 Add JWT-based authentication

📩 Add email notifications for approvals/rejections

📊 Add analytics dashboard for leave stats

📱 Make the UI mobile-responsive

🧾 Add user registration flow

🤝 Contributing
Pull requests are welcome! Feel free to fork the repo and submit improvements.

📄 License
This project is licensed under the MIT License.

🙋‍♂️ Author
Jayakarthikkumar R D
GitHub: @JayaKarthikkumar

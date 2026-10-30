# 🚀 TaskFlow | Full Stack To-Do Application

<p align="center">
  A modern, responsive and interactive To-Do application built with Node.js, Express.js, MongoDB and Vanilla JavaScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

---

## 📌 About The Project

**TaskFlow** is a full-stack To-Do management application developed as part of the Ostad Full Stack Web Development with JavaScript (MERN) & AI course, Module-14 Assignment.

It allows users to create, view, update, complete and delete tasks through a clean and interactive web interface.

The application uses a RESTful API powered by Express.js and MongoDB for persistent data storage.

## ✨ Features

- **Create Tasks:** Add new tasks with a title and description.
- **View Tasks:** Display all saved tasks dynamically.
- **Update Tasks:** Edit existing task information.
- **Complete Tasks:** Mark tasks as completed or active.
- **Delete Tasks:** Remove unwanted tasks.
- **Task Filtering:** Filter tasks by All, Active and Completed.
- **Search Functionality:** Quickly find tasks.
- **Dashboard Statistics:** View total, active, completed and pending tasks.
- **Responsive Design:** Enjoy a consistent experience across different screen sizes.
- **Persistent Storage:** Store tasks in MongoDB Atlas.

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome
- Google Fonts

### Development Tools
- Nodemon
- Postman
- Visual Studio Code
- Git & GitHub

## 📂 Project Structure

```text
Module-14 Assignment/
│
├── config/
│   └── db.js
│
├── models/
│   └── Todo.js
│
├── routes/
│   └── todoRoutes.js
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Soumik-Riyan-Madhu/Ostad-Module-14-Assignment.git
```

### 2. Navigate to the Project Directory

```bash
cd Ostad-Module-14-Assignment
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your own MongoDB Atlas connection string.

**Important:** Never share your MongoDB credentials or upload your `.env` file to GitHub.

### 5. Run the Application

For development:

```bash
npm run dev
```

For production-style execution:

```bash
npm start
```

### 6. Open in Browser

Visit:

```text
http://localhost:5000
```

## 🔗 API Documentation

Base URL:

```text
http://localhost:5000
```

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/todos` | Create a new task |
| GET | `/todos` | Retrieve all tasks |
| GET | `/todos/:id` | Retrieve a single task |
| PUT | `/todos/:id` | Update an existing task |
| DELETE | `/todos/:id` | Delete a task |

### Example: Create a Todo

**POST** `/todos`

Request Body:

```json
{
  "title": "Learn JavaScript",
  "description": "Practice JavaScript fundamentals",
  "completed": false
}
```

### Example: Update a Todo

**PUT** `/todos/:id`

```json
{
  "title": "Master JavaScript",
  "description": "Complete advanced JavaScript topics",
  "completed": true
}
```

## 🗄️ Database Schema

The application uses a MongoDB collection named `todos`.

Each Todo document contains:

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique document identifier |
| `title` | String | Task title (required) |
| `description` | String | Task description |
| `completed` | Boolean | Task completion status |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## 🎯 Learning Outcomes

Through this project, I practiced:

- Building RESTful APIs with Express.js.
- Connecting Node.js applications to MongoDB.
- Creating Mongoose schemas and models.
- Implementing complete CRUD operations.
- Managing environment variables securely.
- Connecting frontend interfaces with backend APIs.
- Handling asynchronous JavaScript operations using `async/await`.
- Using Git and GitHub for version control.

## 👨‍💻 Developer

**Soumik Riyan Madhu**

Aspiring Software Developer | Frontend Developer | Programming Enthusiast

- GitHub: [@Soumik-Riyan-Madhu](https://github.com/Soumik-Riyan-Madhu)

---

<p align="center">
  <b>Built with ❤️ and JavaScript</b>
  <br>
  <i>Learn. Build. Improve. Repeat.</i>
</p>

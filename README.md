# 📚 Library Management System

A comprehensive full-stack library management application built with **Node.js**, **Express**, **MongoDB**, and **Next.js**. This system allows librarians to efficiently manage books, members, and transactions with features like automated rent calculation, debt tracking, and bulk book imports from external APIs.

## 🌐 Live Demo

- **Frontend**: [https://library-management-7a2y.vercel.app/](https://library-management-7a2y.vercel.app/)


## ✨ Features

### 📖 Books Management
- Add books manually with complete details (title, authors, ISBN, stock, rent per day)
- Edit existing book information
- Search books by title or author
- View all books with pagination (10 books per page)
- Track book stock and availability
- Import books in bulk from Frappe Library API

### 👥 Members Management
- Register new library members
- Manage member information (name, email, phone)
- Track outstanding debt for each member (₹500 limit)
- Search members by name or email
- Delete member records

### 🔄 Transactions
- Issue books to members with stock validation
- Return books with automatic rent calculation
- Track all transactions (issued and returned)
- Prevent duplicate issues (one copy per member)
- Custom return date selection
- Rent calculation based on days borrowed

### 📥 Import from Frappe API
- Bulk import books from Frappe Library API
- Filter by title, authors, ISBN, or publisher
- Import up to 100 books at once
- Automatic duplicate detection (skip existing books)
- Default stock and rent values for imported books

### 💰 Debt Management
- Automatic debt calculation on book returns
- ₹500 maximum debt limit enforcement
- Prevent book issues if debt limit reached
- Clear debt tracking per member

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for Frappe API integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Next.js 15** - React framework (App Router)
- **React 19** - UI library
- **React Hook Form** - Form validation
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - API communication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local or MongoDB Atlas account
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/para25/Library_Management.git
cd Library_Management
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
# Add the following variables:
MONGO_URI=mongodb://localhost:27017/library_management
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management

PORT=5000

# Start the backend server
npm start
# or for development with auto-restart:
nodemon server.js
```

**Backend will run on:** `http://localhost:5000`

### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will run on:** `http://localhost:3000`

### 4️⃣ Access the Application

Open your browser and visit: **http://localhost:3000**

## 📁 Project Structure

```
Library_Management/
├── backend/
│   ├── controllers/
│   │   ├── bookController.js       # Book CRUD operations
│   │   ├── memberController.js     # Member management
│   │   ├── transactionController.js # Issue/Return logic
│   │   └── importController.js     # Frappe API integration
│   ├── models/
│   │   ├── bookModel.js            # Book schema
│   │   ├── memberModel.js          # Member schema
│   │   └── transactionModel.js     # Transaction schema
│   ├── routes/
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── importRoutes.js
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── server.js                   # Express server setup
│   ├── package.json
│   └── .env                        # Environment variables (create this)
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.js             # Dashboard/Home
    │   │   ├── layout.js           # Root layout with Navbar
    │   │   ├── books/
    │   │   │   ├── page.jsx        # Books list & search
    │   │   │   └── add/
    │   │   │       └── page.jsx    # Add/Edit book form
    │   │   ├── members/
    │   │   │   ├── page.jsx        # Members list & search
    │   │   │   └── add/
    │   │   │       └── page.jsx    # Add member form
    │   │   ├── transactions/
    │   │   │   ├── page.jsx        # Transactions list
    │   │   │   ├── issue/
    │   │   │   │   └── page.jsx    # Issue book form
    │   │   │   └── return/
    │   │   │       └── page.jsx    # Return book form
    │   │   └── import/
    │   │       └── page.jsx        # Import from Frappe
    │   ├── components/
    │   │   ├── Navbar.jsx          # Navigation bar
    │   │   ├── BookCard.jsx        # Book display card
    │   │   └── Pagination.jsx      # Pagination component
    │   └── utils/
    │       └── api.js              # Axios instance
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Books
- `GET /api/books` - Get all books (paginated)
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Members
- `GET /api/members` - Get all members (paginated)
- `GET /api/members/search?q={query}` - Search members
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/member/:memberId` - Get member's transactions
- `POST /api/transactions/issue` - Issue a book
- `PUT /api/transactions/return/:transactionId` - Return a book

### Import
- `POST /api/import` - Import books from Frappe API

## 📝 Usage Guide

### Adding a Book Manually
1. Navigate to **Books** page
2. Click **"Add Book"** button
3. Fill in required fields: Title, Authors, Stock, Rent per Day
4. Click **"Add Book"**

### Importing Books from Frappe
1. Click **"Import Books"** from dashboard
2. (Optional) Add filters: Title, Authors, ISBN, Publisher
3. Enter **Number of Books** to import (1-100)
4. Click **"Import Books"**
5. Duplicate books are automatically skipped

### Registering a Member
1. Navigate to **Members** page
2. Click **"Add Member"**
3. Fill in Name, Email, Phone
4. Click **"Add Member"**

### Issuing a Book
1. Go to **Transactions** → **"Issue Book"**
2. Select a **Book** (only shows books with stock > 0)
3. Select a **Member** (only if debt < ₹500)
4. Click **"Issue Book"**
5. Stock decreases automatically

### Returning a Book
1. Go to **Transactions** → **"Return Book"**
2. Select the issued transaction
3. (Optional) Select custom return date
4. Click **"Return Book"**
5. Rent is calculated: `(days borrowed × rent per day)`
6. Member's debt is updated
7. Stock increases automatically

## 🔒 Business Rules

1. **Stock Management:**
   - Stock decreases when a book is issued
   - Stock increases when a book is returned
   - Cannot issue a book if stock is 0

2. **Member Debt:**
   - Maximum debt limit: ₹500
   - Cannot issue new books if debt ≥ ₹500
   - Debt increases on book return (rent fee)

3. **Book Issues:**
   - A member cannot have multiple copies of the same book
   - Different members can borrow the same book (if stock available)

4. **Rent Calculation:**
   - `Rent = (Return Date - Issue Date) × Rent Per Day`
   - Minimum 1 day charged even if returned same day

## 🐛 Troubleshooting

### Backend not connecting to MongoDB?
- Ensure MongoDB is running: `mongod` (if local)
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas IP whitelist (if using Atlas)

### Frontend API calls failing?
- Ensure backend is running on port 5000
- Check `frontend/src/utils/api.js` has correct base URL
- Verify CORS is enabled in `backend/server.js`

### Books not importing from Frappe?
- Check internet connection
- Verify Frappe API is accessible: `https://frappe.io/api/method/frappe-library`
- Check backend console for error messages

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Prasad**
- GitHub: [@para25](https://github.com/para25)

## 🙏 Acknowledgments

- [Frappe Library API](https://frappe.io/api/method/frappe-library) for book data
- Next.js team for the amazing framework
- MongoDB for the database solution

---

**Thank You ❤️!**

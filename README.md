# Vehicle Rental System – Backend API

A complete **Role-Based Vehicle Rental Management System** built with **Node.js**, **Express.js**, and **PostgreSQL**.
This system includes authentication, user management, vehicles, customers and bookings.

## 🌐 Live API Base URL

```
https://
```

---

# 📌 Features

### 🔐 Authentication & Authorization

* JWT-based login system
* Role-based access control (Admin, Customer)

### 👤 User & Customer Management

* Admin can manage users
* Customers can update their own profiles
* Secure password hashing using bcrypt

### 🚙 Vehicle Management

* Admin can create, update, delete vehicles
* Customers can view available vehicles
* Vehicle availability updates automatically based on bookings

### 📅 Booking System

* Customers can create bookings
* Admin can view all bookings
* Auto-price calculation based on rent days
* Prevents double-booking or booking unavailable vehicles
* Booking update rules:

  * Customer can cancel their own booking
  * Admin can mark bookings as "returned"

---

# 🛠️ Technology Stack

### **Backend**

* Node.js
* Express.js
* TypeScript

### **Database**

* PostgreSQL
* `pg` (node-postgres)

### **Security**

* JWT Authentication
* Bcrypt password hashing
* Role-based access control

---

# ⚙️ Setup Instructions

## 1️⃣ Clone the repository

```sh
git clone https://github.com/your-username/vehicle-rental-backend.git
cd vehicle-rental-backend
```

## 2️⃣ Install dependencies

```sh
npm install
```

## 3️⃣ Configure environment variables

Create `.env` file:

## 4️⃣ Run database migrations (if applicable)

Create tables manually or using migration tools.

## 5️⃣ Start the development server

```sh
npm run dev
```

## 6️⃣ Start production build

```sh
npm run build
npm start
```




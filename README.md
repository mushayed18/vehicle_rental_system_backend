# Vehicle Rental System – Backend API

A complete **Role-Based Vehicle Rental Management System** built with **Node.js**, **Express.js**, and **PostgreSQL**.
This system includes authentication, user management, vehicles, customers and bookings.

## 🌐 Live API Base URL

```
https://vehicle-rental-system-backend-orcin.vercel.app/api/v1
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

Follow these steps to run the Vehicle Rental System Backend on your local machine.

---

## 1️⃣ Clone the repository

```sh
git clone https://github.com/mushayed18/vehicle_rental_system_backend.git
cd vehicle_rental_system_backend
```

---

## 2️⃣ Install dependencies

```sh
npm install
```

---

## 3️⃣ Create and configure the `.env` file

Inside the project root, create a `.env` file with the following environment variables:

```
CONNECTION_STRING=your_postgresql_connection_url
JWT_SECRET=your_secret_key
PORT=8000
```

---

## 4️⃣ Start the database (PostgreSQL)

Make sure PostgreSQL is running.

You must manually create the database:

```sql
CREATE DATABASE vehicle_rental;
```

Tables are automatically created on server start (because this code runs SQL CREATE TABLE IF NOT EXISTS).

---

## 5️⃣ Start the development server

dev script uses **tsx** to run TypeScript directly:

```sh
npm run dev
```

This starts:

```
src/server.ts
```

and auto-restarts on changes.

---

# HRMS Lite

A lightweight Human Resource Management System for managing employee records and tracking daily attendance.

## Project Overview

HRMS Lite is a clean, stable, and functional application that focuses on essential HR operations with a simple, usable, and professional interface. It allows an admin to manage employee records (Add, View, Delete) and track daily attendance.

## Tech Stack

- **Frontend:** React, wouter (routing), Tailwind CSS, Shadcn UI, TanStack Query
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Drizzle ORM
- **Language:** TypeScript (Full-stack)

## Features

- **Employee Management:** Add, view, and delete employee records with details like Employee ID, Full Name, Email, and Department.
- **Attendance Tracking:** Mark and view daily attendance (Present/Absent) for each employee.
- **Bonus Implementations:**
  - Displays total present/absent days and attendance rate per employee on their profile.
  - Basic dashboard summary layout.

## Steps to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up the Database:**
   Provision a PostgreSQL database and set the `DATABASE_URL` environment variable.
   Then, push the schema to your database:
   ```bash
   npm run db:push
   ```

3. **Start the Application:**
   Run the development server (which concurrently runs the Vite frontend server and Express backend server):
   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open your browser and navigate to the local server port provided by Vite/Express (usually port 5000).

## Assumptions and Limitations

- Assumes a single admin user system (no authentication implemented, as per requirements).
- Attendance is recorded on a per-day basis (YYYY-MM-DD). If an employee has an attendance record for a specific day, it cannot be duplicated.
- Built without complex leave management or payroll functionalities.

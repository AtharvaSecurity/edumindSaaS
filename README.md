# 🎓 EduMind SaaS — Complete School Management ERP

<div align="center">

![EduMind](https://img.shields.io/badge/EduMind-SaaS-8b5cf6?style=for-the-badge&logo=school&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen?style=flat)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![Express](https://img.shields.io/badge/Express-4.x-green?style=flat&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.x-purple?style=flat&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

**The all-in-one school management platform. Attendance, fees, exams, library — beautifully simple.**

🚧 **ACTIVE DEVELOPMENT** — New features added daily.

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Pricing Plans](#-pricing-plans)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based login with access & refresh tokens
- Role-Based Access Control (Super Admin, School Admin, Principal, Teacher, Accountant, Student, Parent)
- "Remember Me" functionality
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting on auth endpoints
- Session management & secure logout

### 👥 Student Management
- Add, edit, view, and deactivate students
- Auto-generated unique admission IDs
- Parent information linking
- Document upload support
- Bulk import via Excel
- Advanced search & filtering
- Roll number assignment
- Class & section assignment

### ✅ Attendance Management
- One-click mark Present / Absent / Late
- Bulk attendance for entire class
- Daily, monthly, and custom date reports
- Attendance percentage calculation
- Leave application & approval workflow
- Auto-mark absent for approved leaves
- Teacher-wise attendance tracking

### 💰 Fee Management
- Configurable fee structures (Monthly, Quarterly, Yearly, One-time)
- Student-wise fee assignment
- Payment recording (Cash, Cheque, UPI, Netbanking, Card)
- **Razorpay integration** for online payments
- Auto-generated payment receipts
- Defaulter lists & pending amount tracking
- Collection percentage dashboard
- Late fee calculation

### 📝 Exam Management
- Create exams (Unit Test, Mid Term, Half Yearly, Annual, Pre-Board, Board)
- Subject-wise marks entry
- Auto grade calculation (A+ to F)
- Pass/Fail determination
- Individual student report cards
- Class-wise result analysis
- Percentage & rank calculation

### 📅 Events & Planner
- School event calendar
- Event types (General, Sports, Cultural, Exam, Holiday)
- Date-wise event listing
- Upcoming events dashboard widget

### 📚 Library Management
- Book catalog with title, author, ISBN
- Category classification
- Issue & return tracking
- Due date management
- Automatic fine calculation for late returns (₹5/day)
- Available/Total quantity tracking

### 🚌 Transport Management
- Bus route creation
- Vehicle & driver assignment
- Route stops with pickup/drop timings
- Student-to-route assignment
- Transport fee tracking

### 📢 Notice Board
- School-wide announcements
- Priority levels
- Dashboard display of recent notices

### 🌓 Theme System
- Beautiful Light & Dark mode
- Persistent theme preference
- Smooth transitions
- CSS variable-based theming

---

## 📸 Screenshots

<div align="center">

### Login Page
*Clean, minimal login with remember me*

### Dashboard
*Overview of all school activities*

### Student Management
*Add & manage student records*

### Attendance
*One-click attendance marking*

### Fee Management
*Razorpay payment integration*

</div>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | Next.js 14 | React framework with SSR |
| **Frontend Language** | TypeScript | Type safety |
| **State Management** | Zustand | Lightweight state |
| **Backend Framework** | Express.js 4 | REST API server |
| **Backend Language** | TypeScript | Type safety |
| **Database** | PostgreSQL 16 | Relational database |
| **ORM** | Prisma 5 | Database migrations & queries |
| **Authentication** | JWT + bcrypt | Secure auth |
| **Validation** | Zod | Schema validation |
| **Payments** | Razorpay | Indian payment gateway |
| **Styling** | CSS Variables | Theme system |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ 
- **PostgreSQL** 16+
- **npm** or **pnpm**

### Step 1: Clone & Install

```bash
git clone https://github.com/AtharvaSecurity/edumindSaaS.git
cd edumindSaaS
npm install

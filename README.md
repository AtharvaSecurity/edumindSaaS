# EduMind SaaS — Complete School Management ERP

## Overview
EduMind SaaS is an all-in-one School Management ERP platform designed for schools, institutes, and educational organizations. It provides modules for student management, attendance, fees, examinations, library operations, payroll, transport management, notices, and analytics in a modern SaaS architecture.

## Features

### Authentication & Security
- JWT Authentication
- Role-Based Access Control (RBAC)
- Multiple User Roles:
  - Super Admin
  - School Admin
  - Principal
  - Teacher
  - Accountant
  - Student
  - Parent

### Student Management
- Student Registration
- Parent Linking
- Admission ID Generation
- Bulk Import
- Search & Filters
- Student Status Management

### Attendance
- Present / Absent / Late Tracking
- Daily Reports
- Monthly Reports
- Leave Management

### Fee Management
- Fee Structures
- Payment Tracking
- Receipt Generation
- Razorpay Integration
- Defaulter Reports

### Examination System
- Exam Creation
- Marks Entry
- Auto Grade Calculation
- Report Cards
- Result Management

### Additional Modules
- Events Calendar
- Library Management
- Transport Management
- Payroll System
- Notice Board
- Dashboard Analytics
- Theme Support (Dark/Light)

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Zustand

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL 16
- Prisma ORM

### Additional Technologies
- JWT Authentication
- bcrypt
- Zod Validation
- Razorpay Payments

## Project Structure

```text
edumindSaaS/
├── apps/
│   ├── server/
│   └── web/
└── packages/
    └── types/
```

## Quick Start

### Installation

```bash
git clone https://github.com/AtharvaSecurity/edumindSaaS.git
cd edumindSaaS
npm install
```

### Database Setup

```bash
cd apps/server
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
```

### Start Development

Backend:

```bash
cd apps/server
npm run dev
```

Frontend:

```bash
cd apps/web
npm run dev
```

## API Modules
- Authentication
- Students
- Attendance
- Fees
- Exams
- Library
- Transport
- Notices

## Database Models

### Core
- tenants
- users
- admins
- teachers
- students
- parents
- classes
- sections
- subjects
- academic_years

### Feature Models
- attendances
- leaves
- fee_structures
- student_fees
- payments
- exams
- results
- books
- book_issues
- transports
- route_stops
- timetables
- events
- notices
- staff_salaries
- notifications
- audit_logs

## Deployment
- VPS Support
- PM2 Process Management
- Nginx Reverse Proxy
- SSL Support
- Docker (Planned)

## Pricing Plans

| Plan | Price |
|------|--------|
| Free | ₹0 |
| Basic | ₹999 |
| Pro | ₹2,499 |
| Enterprise | Custom |

## Roadmap

### Completed
- Authentication
- Student Management
- Attendance
- Fee Management
- Exams
- Library
- Transport
- Payroll

### In Progress
- WhatsApp Integration
- Parent Portal
- PDF Report Cards
- Analytics

### Planned
- AI Student Insights
- Mobile App
- Google Classroom Integration
- Multi-language Support

## Author

**Atharva Mani Tripathi**

- GitHub: https://github.com/AtharvaSecurity
- Age: 17
- Devloper+Web app secuirty tester
- Fedora Linux User

---

Made with ❤️ in India.

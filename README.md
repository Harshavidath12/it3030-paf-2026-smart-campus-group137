# Smart Campus Operations Hub (IT3030 - PAF)

Welcome to the **Smart Campus Operations Hub**, an integrated full-stack management system designed to streamline campus resource utilization and security.

---

## 🚀 Project Overview
This application is a university assignment for the **Programming Applications and Frameworks (IT3030)** course. It provides a centralized platform for both students and staff to manage, book, and verify access to university resources (Lab rooms, equipment, libraries) using a responsive React frontend and a robust Spring Boot backend.

### 👥 Team Contribution (Member 2)
**Role:** Backend Booking Workflow, Conflict Detection Algorithm, and QR-based Innovation.  
**Focus:** Ensuring resource availability and secure, self-service check-in mechanisms.

---

## 🔥 Key Features (Implemented)

### 1. Advanced Booking Management
*   **Complete Workflow:** Handles state transitions from `PENDING` ➡️ `APPROVED/REJECTED` ➡️ `CANCELLED` ➡️ `CHECKED_IN`.
*   **Conflict Detection:** A sophisticated JPQL-based algorithm that prevents overlapping time slots for the same resource on the same date.
*   **CRUD Operations:** Fully functional endpoints for creating, retrieving, updating, and cancelling bookings.

### 2. QR Code Innovation Feature
*   **Secure Tokens:** Approved bookings generate a unique, one-time UUID token stored in the database.
*   **Visual Generation:** Backend uses the **ZXing Library** to convert tokens into Base64 PNG images for real-time frontend rendering.
*   **Self-Service Check-in:** A dedicated Kiosk Scanner interface (`html5-qrcode`) that allows users to verify their attendance on-site using their personal device camera.
*   **Validation Rules:** Check-in is only allowed on the **exact day** of the booking and within a **15-minute window** before the start time.

### 3. Premium UI/UX (Aesthetics)
*   **Theming:** A custom Slate Navy/Vibrant Indigo theme using **Material-UI**.
*   **Visual Feedback:** Professional status chips, glassmorphism card effects, and real-time toast notifications (react-toastify).
*   **Responsive:** Fully mobile-friendly layout for students booking on the go.

---

## 🛠️ Technology Stack
*   **Backend:** Spring Boot 3.4.0 (Java 21), Spring Data JPA, Spring Security, Hibernate.
*   **Frontend:** React 18, Vite, Material-UI, Axios, React Router.
*   **Database:** PostgreSQL.
*   **Innovation Tooling:** Google ZXing (QR Gen), html5-qrcode (Scanner).

---

## ⚙️ Setup & Installation

### 1. Database (PostgreSQL)
*   Create a database named `smartcampus`.
*   Run the schema script: `database/schema-postgres.sql` to initialize the `bookings` table.

### 2. Backend (Spring Boot)
*   Navigate to `/backend`.
*   Verify your database credentials in `src/main/resources/application.properties`.
*   Run the server:
    ```bash
    .\mvnw.cmd spring-boot:run
    ```
*   The backend runs on: [http://localhost:8084](http://localhost:8084)

### 3. Frontend (React)
*   Navigate to `/frontend`.
*   Install dependencies: `npm install`.
*   Run the development server:
    ```bash
    npm run dev
    ```
*   The frontend runs on: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure (Individual - Member 2)
```text
backend/
├── model/Booking.java (JPA Entity)
├── repository/BookingRepository.java (Conflict Logic)
├── service/impl/BookingServiceImpl.java (Validation Business Rules)
├── controller/BookingController.java (8 REST Endpoints)

frontend/
├── src/components/bookings/
│   ├── BookingForm.jsx (Creation & Validation)
│   ├── BookingList.jsx (User Tracking)
│   ├── QRCodeScanner.jsx (Kiosk Check-in Interface)
│   └── QRCodeDisplay.jsx (QR Image Rendering)
```

---

## 👨‍💻 Developed By
**Member 2**  
*Course: Programming Applications and Frameworks (IT3030)*  
*Year: 2026*
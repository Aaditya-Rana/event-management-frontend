# 🌐 Event Management Frontend

This is the **frontend application** for the Event Management Platform, built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It enables users to browse, filter, and book events while providing admins with management capabilities via a secure dashboard.

---

## 🧰 Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** – Type-safe React components
- **Tailwind CSS** – Utility-first CSS framework
- **Redux Toolkit** – Global state management
- **axios** – API interaction
- **React Toastify** – Notifications and alerts
- **Date-fns** – Date formatting utilities

---

## 📲 Key Features

### 👤 **Authentication**

- Secure Login/Register flow
- JWT-based session handling
- Redux-managed auth state
- Conditional rendering for logged-in vs guest users

### 📅 **Events Listing**

- View all events in grid or card layout
- **Filters include**:
  - 🔍 Debounced search input
  - 📂 Category
  - 🌐 Online/Offline toggle
  - 📆 Date range (start and end)
  - 📌 Status: `UPCOMING`, `ONGOING`, `COMPLETED`
- Paginated event results

### 🖼️ **Event Detail Page**

- Displays:
  - Banner image
  - Full description
  - Time & date
  - Status (computed on backend)
  - Mode: Online/Offline
- Registered users can:
  - Book 1 or 2 seats
  - Get real-time booking confirmation
  - See "please login" prompt if not authenticated

### 💳 **My Bookings**

- Logged-in users can:
  - View personal bookings in table format
  - See status (Confirmed, Cancelled, etc.)
  - Cancel bookings if the event is not yet started
  - Paginate through booking history

---

## 🔐 Admin Dashboard

### 📋 Overview

The Admin Dashboard provides administrative capabilities for event organizers and platform moderators. It is accessible only to authenticated users with the `ADMIN` role.

### ✨ Features

- 📄 **All Bookings Table**
  - Displays:
    - User name
    - User email
    - Event title
    - Booking date
    - Number of seats
    - Status (with color-coded badges)
  - Table supports:
    - Scrollable responsive layout
    - Alternating row background
    - Clean UI with Tailwind

- 🔍 **Pagination**
  - Server-side pagination using backend metadata
  - Admin can browse through pages of bookings

- 📊 **Bookings by Event (Planned/Optional)**
  - View bookings filtered by specific event
  - Useful for event-specific attendance or stats

> 🛠 More admin features like event creation, user management, and analytics can be added in the future.

---

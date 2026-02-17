# Lost & Found Item Recovery Platform - Frontend

> **Developed by: Taniya Kamboj**

![Status](https://img.shields.io/badge/Status-Production-brightgreen)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 📖 Description

A full-stack system for organizations, transit authorities, or public venues to catalog lost items, allow owners to file claims, and manage the verification and return process with location-based matching.

This repository contains the **Frontend** application, built with React, TypeScript, and Tailwind CSS.

- **Frontend Repository:** [https://github.com/taniyakamboj15/LostAndFound-frontend.git](https://github.com/taniyakamboj15/LostAndFound-frontend.git)
- **Backend Repository:** [https://github.com/taniyakamboj15/LostAndFound-backend.git](https://github.com/taniyakamboj15/LostAndFound-backend.git)

## 🎯 Use Cases

- **Airports and Transit Authorities**: Managing passenger lost belongings.
- **Universities and Large Campuses**: Centralizing lost-and-found operations.
- **Hotels and Event Venues**: Handling guest forgotten items.

## ✨ Features

- **User Authentication**: Secure login/register for Admin, Staff, and Claimant roles.
- **Found Item Registration**: Staff can log items with category, description, photos, and location/date found.
- **Lost Item Reports**: Owners can submit reports with identifying details to aid recovery.
- **Automated Matching Engine**: Suggests potential matches based on category, description keywords, and date/location proximity.
- **Claim Verification Workflow**: End-to-end process: Claim Filed → Identity Proof Requested → Verified → Returned.
- **Photo-Based Comparison**: Claimants can visually confirm ownership by asserting matches against found item photos.
- **Item Storage Tracking**: Manage shelf/bin locations and track retention period countdowns.
- **Handoff Scheduling**: Claimants can book time slots for item pickup; Staff verifies via QR/Reference code.
- **Unclaimed Item Disposition**: Workflow to donate, auction, or dispose of items after the retention period expires.
- **Dashboard Analytics**: Insights on items reported, matched rates, average recovery time, and category breakdowns.
- **Notification System**: Alerts for potential matches, claim status updates, and retention expiry warnings.
- **Public Search Portal**: Allows claimants to graze found items without requiring a login.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS, Framer Motion
- **Forms**: React Hook Form with Yup validation
- **HTTP Client**: Axios

## 📁 Project Structure

```bash
src/
├── components/     # Reusable UI components
├── constants/      # Centralized constants
├── features/       # Feature-specific logic
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── pages/          # Application routes
├── services/       # API integration
├── store/          # Redux state management
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

## 🚀 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/taniyakamboj15/LostAndFound-frontend.git
    cd LostAndFound-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## 🤝 Contribution

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License .

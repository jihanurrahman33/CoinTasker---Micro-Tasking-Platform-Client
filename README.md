# CoinTasker - Micro-Tasking Platform

CoinTasker is a robust micro-tasking platform where users can earn coins by completing simple tasks posted by buyers. It supports three distinct roles: **Worker**, **Buyer**, and **Admin**, each with a tailored dashboard and functionality. The platform features secure authentication, real-time data fetching, payment integration, and a modern, responsive UI.

## 🔗 Live Demo

- **Client**: [https://cointasker-ed5ad.web.app/](https://cointasker-ed5ad.web.app/)
- **Server**: [https://coin-tasker-server-rho.vercel.app/](https://coin-tasker-server-rho.vercel.app/)

## ✨ Key Features

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure email/password login and Google social login.
- **Role-Based Access Control (RBAC)**: Distinct routes and dashboards for Workers, Buyers, and Admins.
- **JWT Protection**: Secure API endpoints using JSON Web Tokens.

### 👷 Worker Features
- **Task List**: Browse and filter available tasks with detailed views.
- **My Submissions**: Track status of submitted work (Pending/Approved/Rejected).
- **Withdrawals**: Convert earned coins to real money via secure withdrawal requests (Stripe, PayPal, etc.).
- **Dashboard**: Real-time stats on earnings, total submissions, and approved tasks.

### 💼 Buyer Features
- **Add Task**: Post new tasks with details like title, requires workers, and pay amount. Includes image upload via ImageBB.
- **My Tasks**: Manage posted tasks, update details, or delete unwanted tasks.
- **Review Submissions**: Approve or reject worker submissions. Approving automatically transfers coins to the worker.
- **Purchase Coins**: Buy coin packages securely using **Stripe**.
- **Payment History**: View a log of all coin purchases.

### 🛡️ Admin Features
- **Manage Users**: View all users, manage roles (promote to Admin), and delete users.
- **Manage Tasks**: Oversee all system tasks with the ability to delete content.
- **Withdrawal Requests**: Review and approve worker withdrawal requests.
- **Admin Stats**: comprehensive platform overview (Total Users, Total Coins, Payments).

## 🛠️ Technology Stack

### Frontend
- **React.js**: Core component library.
- **Vite**: Blazing fast build tool.
- **Tailwind CSS & DaisyUI**: Utility-first styling with pre-built components for a modern look.
- **Framer Motion**: Smooth animations and transitions.
- **TanStack Query (React Query)**: Efficient server state management and data fetching.
- **Axios**: HTTP client for API requests (Standard & Secure instances).
- **React Hook Form**: Performant form handling and validation.

### Backend & Integrations
- **Node.js & Express**: Backend API framework.
- **MongoDB**: NoSQL database for flexible data storage.
- **Firebase Auth**: User identity management.
- **Stripe**: Secure payment processing.
- **ImageBB**: Image hosting service.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Start-Up-Professors/CoinTasker.git
   cd CoinTasker
   ```

2. **Install Client Dependencies**
   ```bash
   cd "CoinTasker Client"
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the client root and add your keys:
   ```env
   VITE_apiKey=YOUR_FIREBASE_API_KEY
   VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
   VITE_projectId=YOUR_PROJECT_ID
   VITE_storageBucket=YOUR_STORAGE_BUCKET
   VITE_messagingSenderId=YOUR_MESSAGING_SENDER_ID
   VITE_appId=YOUR_APP_ID
   VITE_IMAGE_HOSTING_KEY=YOUR_IMAGEBB_KEY
   VITE_stripe_publishable_key=YOUR_STRIPE_KEY
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📜 Admin Credentials (For Testing)

> **Note:** You can register a new user and ask the current admin to promote them, or use these demo credentials if provided by the repository owner.

- **Email**: `admin@cointasker.com`
- **Password**: `admin123` (Example only - please create your own)

## 📄 License
This project is licensed under the MIT License.

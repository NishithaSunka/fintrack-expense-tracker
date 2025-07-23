# FinTrack: The Smart Expense & Group Bill Management Platform

<div align="center">
 
  <!-- TODO: Replace this with a real screenshot of your application's dashboard -->
  <img src="Dashboard.png" alt="FinTrack Dashboard Screenshot" width="800"/>

</div>

<br/>



**Live Application Link:** [https://fintrack-expense-tracker-your-id.onrender.com](https://fintrack-expense-tracker-your-id.onrender.com) 


## Description

FinTrack is a full-stack MERN application designed to provide a seamless and intuitive solution for personal finance management and collaborative expense splitting. It empowers users to track their income and expenses, set monthly budgets, and effortlessly manage shared bills within groups.

Built on a modern technology stack including Node.js, Express, React, and MongoDB, FinTrack ensures a robust and scalable foundation. Its standout feature is the **AI-powered bill scanning**, which uses a client-side OCR engine (Tesseract.js) to automatically read and extract the total amount from an uploaded receipt image, simplifying expense entry for groups.

## Features

- **Secure Authentication:** Robust and secure registration and login system for users.
- **Intuitive Dashboard:** A central hub to view recent transactions with a powerful and instant filtering system by type (income/expense), time period (week/month/year), and a text-based search for titles or categories.
- **Dynamic Charts:** The dashboard features a conditional chart that visually represents the last 7 income or expense transactions, providing quick insights.
- **Full CRUD for Transactions:** Users can easily **C**reate, **R**ead, **U**pdate, and **D**elete their personal income and expense records.
- **Visual Account Summary:** A dedicated page with dynamic charts that provides a clear summary of total income vs. expenses, filterable by time period.
- **Monthly Budgeting:** Users can set a monthly budget and visually track their spending progress with a dynamic progress bar that changes color as they approach their limit.
- **Collaborative Groups:**
  - Create groups and invite members via their email addresses.
  - Track shared expenses within the group.
  - A real-time settlement calculator shows "who owes whom" to simplify splitting bills.
- **Smart Bill Scanning (OCR):**
  - Users can upload an image of a receipt or bill.
  - The application uses **Tesseract.js** to perform Optical Character Recognition directly in the browser.
  - The AI automatically detects the total amount and pre-fills the expense form, which the user can then confirm and save.

## Tools and Technologies

### Backend
- **Node.js & Express.js:** For building the robust REST API and server-side logic.
- **MongoDB & Mongoose:** As the primary database for storing user, transaction, budget, and group data.
- **JSON Web Tokens (JWT) & Bcrypt.js:** For secure, stateless user authentication and password hashing.
- **Dotenv:** For managing environment variables.

### Frontend
- **React.js & Vite:** For building a fast, modern, and responsive user interface.
- **React Router:** For client-side routing and navigation.
- **Tailwind CSS:** For rapid, utility-first styling and a clean, modern design.
- **Tesseract.js:** A powerful client-side OCR library to power the smart bill scanning feature.
- **Chart.js & react-chartjs-2:** For creating beautiful and interactive charts.
- **Axios:** For making promise-based HTTP requests to the backend API.
- **React Icons:** For a clean and consistent icon set across the application.

### Deployment
- **Render:** The all-in-one platform used for deploying the Node.js web service and the React static site.
- **MongoDB Atlas:** The cloud-hosted, fully-managed MongoDB database.
- **Git & GitHub:** For version control and enabling the Continuous Deployment pipeline with Render.

## Installation and Setup Guide

To run this project locally, follow these steps:

1.  **Prerequisites:**
    - Ensure you have [Node.js](https://nodejs.org/) and a local or cloud-based [MongoDB](https://www.mongodb.com/try/download/community) instance.
    - Clone the repository: `git clone https://github.com/NishithaSunka/fintrack-expense-tracker.git`

2.  **Backend Setup:**
    - Navigate to the server directory: `cd fintrack-expense-tracker/server`
    - Install dependencies: `npm install`
    - Create a `.env` file in the `server` directory and add the following variables:
      ```env
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=a_long_random_secret_string
      ```
    - Start the backend server: `npm start`

3.  **Frontend Setup:**
    - Open a new terminal and navigate to the client directory: `cd fintrack-expense-tracker/client`
    - Install dependencies: `npm install`
    - Start the frontend development server: `npm run dev`

4.  **Access the Application:**
    - Open your browser and go to `http://localhost:5173`.

## Further Development

This project provides a solid foundation that can be extended with many exciting features:
- **Category-Based Budgets:** Allow users to set specific budgets for different spending categories (e.g., Food, Transport).
- **Recurring Transactions:** Add the ability for users to mark transactions like rent or subscriptions as recurring.
- **Advanced Group Splitting:** Implement options for unequal expense splitting (by amount or percentage) and a "Settle Up" feature.
- **Data Export:** Allow users to export their financial data to a CSV file for a given date range.

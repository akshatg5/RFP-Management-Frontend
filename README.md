# RFP Management System - Frontend

A modern React-based frontend for managing procurement requests and vendor proposals.

## Prerequisites

- Node.js (v18 or higher)
- Backend API running (see Backend README)

## Local Setup

1. Clone the repository and navigate to the frontend directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API URL in config/api.ts to your backend server - deployed or local.

4. Start the development server:
   ```
   npm run dev
   ```

The application will open at `http://localhost:5173`.

## Features

- Create RFPs using natural language with AI assistance
- Manage vendor contacts
- Send RFPs to multiple vendors via email
- Receive and parse vendor proposals automatically
- Compare proposals with AI-powered recommendations
- Fallback parsing when AI quota is exceeded

## Tech Stack

- React with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons

## Deployment

The application is configured for deployment on Vercel.

### Backend Repository : 
https://github.com/akshatg5/RFP-Management-Backend
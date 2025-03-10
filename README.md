# Takehome Assignment

Please see the [project requirements](REQUIREMENTS.md) for detailed specifications.

## Table of Contents

- [Stack](#stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Production](#production)
- [Application Modules](#application-modules)
  - [Authentication](#authentication)
  - [Customer Portal](#customer-portal)
  - [Staff Dashboard](#staff-dashboard)
  - [Admin Panel](#admin-panel)

## Stack

- MongoDB
- Express.js
- React.js
- Node.js

## Features

- Google OAuth2
- 2FA with speakeasy and qrcode
- Websockets for live updates
- Role based authentication

## Getting Started

### Prerequisites

- Node.js
- NPM
- MongoDB (local or cloud instance)

### Installation

1. Clone this repository
2. Navigate to the project directory

### Environment Setup

- Create a `.env` file in the server directory using the provided example
- Note: The first user created will be assigned the Admin role
- Subsequent users will be assigned the Customer role
- Maintain at least one Admin user to preserve administrative access

## Running the Application

### Development

1. Use development environment variables as specified in the `.env.example`
2. Start the frontend: `cd client && npm run dev`
3. Start the backend: `cd server && npm run dev`

### Production

1. Use production environment variables as specified in the `.env.example`
2. Configure the HTTPS/HTTP setting using the test prod variable
3. Build the frontend: `cd client && npm run build`
4. Start the server: `cd server && node server.js`

## Application Modules

### Authentication
[View Screenshots](./screenshots/auth)
- Login/Signup functionality
- QR code generation for 2FA setup
- 6-digit verification code input
- Role based dashboards

### Customer Dashboard
[View Screenshots](./screenshots/customer)
- Product browsing and cart management
- Quote request system
- Order quantity modification (Pending state only)
- Real-time price estimates
- Status change notifications

### Staff Dashboard
[View Screenshots](./screenshots/staff)
- Inventory management (Add/Edit/Delete)
- Order processing and updates
- Automatic inventory tracking
- Quantity verification before order status updates

### Admin Dashboard
[View Screenshots](./screenshots/admin)
- User role management
- User deletion capabilities
- Access to system logs
- Log filtering by Role and User
- Real-time user updates

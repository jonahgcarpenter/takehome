# B2B E-Commerce Web Application

## Task Overview:

Develop a basic B2B e-commerce web application focusing on security, real-time updates, and role-based functionality. This project will assess your ability to build a full-stack application using modern technologies while adhering to best practices.

## Requirements:

### Frontend:

- **Framework**: React.js
- **UI Library**: Use MUI UI components.
- **Real-Time Updates**: Implement real-time UI updates (via WebSockets) to reflect CRUD operations instantly.

### Backend:

- **Language/Framework**: Node.js with Express.
- **API**: Develop RESTful APIs for all database tables.

### Security:

- Implement OAuth 2.0 to secure all API endpoints.
- Integrate TOTP-based login for multi-factor authentication.

### Database:

- **Options**: MariaDB.
- **Data Model**: Design tables to support users, roles, products, and necessary audit logs.

### User Roles (RBAC)

- **Roles**:
  - Admin
  - Staff
  - Customer
- **Permissions**:
  - **Admin**: Full access, including viewing audit logs and managing user roles
  - **Staff**: Ability to add products, update inventory, and manage orders
  - **Customer**: Ability to browse products, view available quantities, and raise RFQs and POs

## Core Features:

### Authentication & Authorization:

- Secure login using TOTP.
- OAuth 2.0 secured endpoints.
- Role-Based Access Control (RBAC) implementation.

### Product Management:

- **Staff**: Add new products, update inventory levels, manage orders, and handle POs.
- **Customers**: Browse products and check real-time inventory status.

### CRUD Operations & Logging:

- Build RESTful APIs for all tables (users, products, etc.).
- Every CRUD operation should trigger a real-time update on the UI.
- Maintain detailed logs of all CRUD operations performed by any user (e.g., timestamp, user, operation).

## Task Breakdown:

### Data Modelling:

- Design and implement the database schema (e.g., Users, Roles, Products, Audit Logs).
- Ensure proper relationships and constraints are in place.

### API Development:

- Develop secure RESTful APIs for CRUD operations on all tables.
- Apply OAuth 2.0 to protect these endpoints.
- Ensure proper error handling and data validation.

### Authentication:

- Implement TOTP-based login for secure user authentication.
- Ensure that login sessions and token management are handled securely.

### Frontend Implementation

- Build the user interface using React.js and MUI components
- Create views for different roles:
  - **Admin**: Access to audit logs and user management
  - **Staff**: Interfaces for product addition and inventory updates
  - **Customer**: A product browsing interface showing real-time inventory
- Implement real-time updates on the UI whenever a CRUD operation occurs

### Real-Time Functionality:

- Use WebSockets to push updates to the frontend.
- Ensure that all users see the most recent data without needing to refresh the page.

### Logging:

- Record every CRUD operation with necessary details (user, timestamp, action type, etc.).
- Provide an interface (for Admin) to view these logs.

## Evaluation Criteria

- **Code Quality**: Readability, modularity, and documentation
- **Security**: Robust implementation of OAuth 2.0, TOTP authentication, and RBAC
- **Functionality**: Working RESTful APIs, real-time UI updates, and comprehensive logging
- **User Experience**: Clean, intuitive UI with effective use of MUI components
- **Problem Solving**: Clear and efficient solutions to meet the requirements
- **Documentation**: Clear setup instructions and code comments

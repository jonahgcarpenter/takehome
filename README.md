# Takehome Assignment

Please see the [project requirements](REQUIREMENTS.md) for detailed specifications.

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

## Instructions

- Make sure your system has Node and NPM installed
- Clone this repo to your local machine
- Make sure to create your own ".env" file  within the root of the server directory based on the example one given
- Understand the first user created will have Admin role where any subsequent users are given Customer. Ensure you always keep atleast one Admin user so you dont lose admin aceess.

### Developement

- Ensure youre using the proper .env variables for the development enviornment as explained in the env example file
- Run both frontend and backend servers using the "npm run dev" command in the root of the respecitve server or client directory

### Production

- Ensure youre using the proper .env variables for the production enviornment as explained in the env example file
- Set the test prod variable depending on wether your using HTTPS or HTTP to ensure authentication works
- Navigate to the client directory, and run the "npm run build" command. This will create the static files and place them in the proper directory
- Navigate to the server directory and run the "node sever.js" command to start the server
  
## Authentication
[View Screenshots](./screenshots/auth)
- Login/Signup page for creating account or logging in
- QR code display for scanning to authenticator app (Google Authenticator)
- Page to input 6 digit code for verification
  
## Customer
[View Screenshots](./screenshots/customer)
- View products, add items to your cart and request a quote
- Ability to edit your request quantity if the order is in the "Pending" state only
- Gives an estimated cost per item, where a Staff/Admin will set the "Quoted Price" on their end
- Popup notifications for changes in order status

## Staff
[View Screenshots](./screenshots/staff)
- Add/Edit/Delete inventory
- Ability to updated existing orders
- Inventory quantity is automaticlly updated appropriatly based on order state.
- Ensures product amount is updated before allowing order to be processed to ensure proper tracking of inventory
- Can only update requested quantity in processing state

## Admin
[View Screenshots](./screenshots/admin)
- Ability to update user roles and delete users, with live updates to end users
- Access to logs with ability to clear and filter by Role and User display name

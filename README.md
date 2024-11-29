## Court Booking System  

### Project Overview  
This project is a web application built using React for the frontend, and Express.js with MongoDB for the backend. It allows users to log in, view available sports court slots, and make bookings accordingly. The application ensures secure authentication, real-time slot availability, and a user-friendly interface for seamless bookings.

---

### Table of Contents  
- [Instructions for Using the Sports Court Booking System](#instructions-for-using-the-sports-court-booking-system)
- [Live Demo](#live-demo)
- [Project Report](#project-report)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Special Instructions](#special-instructions)
- [Dependencies](#dependencies)

---

### Instructions for Using the Sports Court Booking System  

#### For Customers (Users)

1. **Registration**:
   - Go to the **Registration** page on the website.
   - Enter your details such as **Name**, **Email**, and **Password**.
   - Click on **Register** to create your account.
   - You will receive a confirmation email. Follow the instructions in the email to verify your account.

2. **Login**:
   - Once registered, navigate to the **Login** page.
   - Enter your **Email** and **Password**.
   - Click on **Login** to access your account.
   - If you forget your password, click **Forgot Password** and follow the steps to reset it.

3. **Browse Available Court Slots**:
   - After logging in, you will be redirected to the **Dashboard** where you can view available sports court slots.
   - You can filter court availability by date and time.
   - The available slots will be shown with the time and type of court (e.g., Tennis, Basketball, etc.).

4. **Booking a Court**:
   - Select an available court slot that you would like to book.
   - Click on the **Book Now** button next to the slot.
   - Click **Confirm Booking** to complete the reservation.
   - You will receive a confirmation email once your booking is successfully made.

5. **View Your Bookings**:
   - In the **Dashboard**, you can view all your upcoming bookings.

6. **Logout**:
   - When you are done using the system, click on the **Logout** button to safely log out of your account.

---

#### For Managers (Admin)

1. **Login**:
   - Navigate to the **Manager Login** page.
   - Enter your **Manager Email** and **Password**.
   - Click **Login** to access the admin dashboard.

2. **Managing Court Slots**:
   - To add a new available slot, click on the **Add Court Slot** button.
   - Fill in the details like **Date**, **Court Type**, and **Availability**.
   - Click **Save** to add the new slot to the system.

3. **Managing User Bookings**:
   - As a manager, you can view all customer bookings on the **Bookings Management** page.
   - You can **Cancel** or **Modify** bookings if necessary, especially in cases of court maintenance or emergencies.
   - For any cancellations, you may contact the user through the provided email or phone number.

4. **Managing Users**:
   - You can view the list of registered users under the **User Management** section.
   - You can modify user information or remove users from the system if needed.
   - If a user has specific issues with their account, you can reset their password directly from the admin panel.

5. **View Reports and Analytics**:
   - The **Analytics** section provides data on court usage, booking trends, and other relevant metrics.
   - You can generate reports based on court utilization, peak hours, and user activity for better decision-making.

6. **Logout**:
   - Once you're done managing the system, click the **Logout** button to securely exit the admin dashboard.

---

### Live Demo  
Access the live versions of the frontend and backend applications through the links below:

- **Frontend Application**: [Live Frontend](https://court-booking-system.vercel.app/)
- **Backend API**: [Live Backend](https://courtbooking-system.onrender.com)

---

### Project Report  
- **Report Link**: [Project Report](https://drive.google.com/file/d/1BZjmbWI3VbQ3AL3pIdpWTM3k_n8Hs3ae/view?usp=sharing)

---

### Prerequisites  
Before you begin, ensure you have met the following requirements:

- **Node.js** and **npm** installed on your machine. You can download them from [Node.js Official Website](https://nodejs.org).
- A running instance of the **backend API**. Update the API endpoints in the code if necessary.
- **Git** installed for version control (optional but recommended).

---

### Installation  

#### Clone the Repository:
```bash
git clone https://github.com/your-username/court-booking-system.git
```

#### Navigate to the Project Directory:
```bash
cd court-booking-system
```

#### Install Dependencies:
```bash
npm install
```

---

### Running the Application  

#### Development Mode  
To run the application in development mode with hot-reloading:

```bash
npm start
```

The frontend application will start on `http://localhost:3000` by default, and the backend API will run on `http://localhost:5000`.

#### Production Build  
To create a production build for the frontend:

```bash
npm run build
```

This will generate optimized static files in the `build` directory.

---

### Project Structure

#### Frontend
```
frontend/
  src/
    components/
      Login.jsx
      Register.jsx
      ScheduleGrid.jsx
      ...
    utils/
      dateUtils.js
    contexts/
      AuthContext.js
    App.js
    index.js
  public/
    index.html
  package.json
  README.md
```

#### Backend
```
backend/
  controllers/
    userController.js
    bookingController.js
    ...
  routes/
    userRoute.js
    bookingRoute.js
    ...
  server.js
  package.json
  .env
  .gitignore
```

---

### Deployment  

#### Frontend Deployment  
1. **Connect Repository**: Log in to [Render.com](https://render.com) and connect your GitHub repository.
2. **Create a New Static Site**:
   - Select the `frontend` directory.
   - Set the build command to `npm run build`.
   - Set the publish directory to `build`.
3. **Environment Variables**: If required, set environment variables in Render.com's dashboard.
4. **Deploy**: Render.com will automatically build and deploy your frontend application.

#### Backend Deployment  
1. **Connect Repository**: Log in to [Render.com](https://render.com) and connect your GitHub repository.
2. **Create a New Web Service**:
   - Select the `backend` directory.
   - Set the build command to `npm install`.
   - Set the start command to `npm start`.
3. **Environment Variables**: Add necessary environment variables such as:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
4. **Deploy**: Render.com will automatically install dependencies and start your backend server.

---

### Assumptions and Limitations  
- **Authentication**: The application assumes that user authentication is handled via JWT tokens stored securely in localStorage.
- **API Endpoints**: The frontend expects specific API endpoints (e.g., `/api/user/login`, `/api/centre/getCentre`). Ensure these endpoints are available and correctly configured.
- **Booking Limitation**: Users cannot book court slots unless authenticated. Proper authentication flow must be maintained.
- **Date Range**: The application displays available slots for the next 7 days.
- **Data Structure**: The code assumes certain structures for the data returned from the API. Modify the code if your API responses differ.

---

### Special Instructions  
- **Environment Variables**: For security, set environment variables directly in the deployment environment (Render.com dashboard) instead of using `.env` files in production.
- **Styling Conflicts**: The application uses Chakra UI for styling. Avoid mixing external CSS and Chakra UI styles to prevent conflicts.
- **Error Handling**: Basic error handling is implemented. Further enhancements might be necessary for production, such as more descriptive error messages and logging.

---

### Dependencies  

#### Frontend:
- **React**: A JavaScript library for building user interfaces.
- **React Router DOM**: For handling routing in the application.

#### Backend:
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB & Mongoose**: For database management.
- **bcryptjs**

: For hashing passwords (replacing bcrypt to avoid native module issues).
- **jsonwebtoken**: For handling JWT tokens.
- **dotenv**: For loading environment variables.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **body-parser**: For parsing incoming request bodies.

#### Other Tools:
- **Nodemon**: For automatically restarting the server during development.
- **Axios**: For making HTTP requests from the frontend.

For a complete list of dependencies and their versions, refer to the respective `package.json` files in the frontend and backend directories.

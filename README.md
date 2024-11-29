# Court Booking for the Game

## Project Description

Court Booking for the Game is a web application where users can book sports courts for different games. Each court can be reserved for one-hour slots, and users are prevented from booking a court that is already occupied during the chosen time. The platform provides a seamless experience for managing and viewing available courts.
## Project Link->  https://games-theory1.vercel.app/login
## Drive-Link->   https://drive.google.com/file/d/1Y8m4hgckAmTqH4wK9nS1J5wEg1Lnr9LX/view?usp=drive_link

## Features

- **User Authentication**: Secure user registration and login system.
- **Court Booking**: Book courts for different sports.
- **Real-Time Availability**: Courts display whether they are occupied or available in real-time.
- **Responsive Design**: Frontend built with responsive design principles, ensuring usability across devices.
- **Error Handling**: Comprehensive error pages for common mistakes (404, unauthorized access, etc.).

## Project Structure

### Backend
- **Controllers**:
  - `auth.js`: Handles user authentication (login and registration).
  - `createBooking.js`: Manages court booking logic.
  - `viewBooking.js`: Retrieves the list of bookings.
  - `Centres.js`, `Courts.js`, `Sports.js`: Handle the creation and management of centers, courts, and sports.

- **Models**:
  - `Bookings.js`: Database model for storing booking information.
  - `Users.js`: User data model.
  
- **Routes**:
  - `auth.js`: Defines routes related to user authentication.
  - `centre.js`, `createBooking.js`: Routes for creating centers and booking courts.

- **Other Files**:
  - `.env`: Stores environment variables.
  - `middlewares.js`: Middleware functions for handling authentication and authorization.
  - `utils.js`: Utility functions for handling various backend operations.

### Frontend
- **Components**:
  - `Home.js`: Home page where users can browse available courts.
  - `Login.js`: User login page.
  - `Register.js`: User registration page.
  - `Navbar.js`: Site navigation bar.
  - `PageNotFound.js`: 404 error page.
  
- **Context**: State management using React Context API.
  
- **Hooks**: Custom React hooks for managing state and side effects.
  
- **Public**: Contains static files and assets (e.g., project images).

## Technologies Used

- **Frontend**: React.js, React Hooks, React Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Vercel for frontend, backend deployed on [add your backend hosting provider]
  
## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/court-booking-app.git

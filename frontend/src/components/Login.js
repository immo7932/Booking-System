// Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Backdrop,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "mdi-material-ui/Google"; // Import GoogleIcon

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_GLOBALURL
    : process.env.REACT_APP_GLOBALURL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Added for error handling
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to clear the error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000); // Clear error message after 4 seconds

      return () => clearTimeout(timer); // Clean up the timer if component unmounts
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before new submission
    setLoading(true); // Start loader


    try {
      console.log(process.env.LOCALURL)
      const response = await axios.post(
        `${process.env.REACT_APP_GLOBALURL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      

      console.log("Login successful", response.data);

      // Save user ID and authToken in local storage
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("authToken", response.data.authToken);
      localStorage.setItem("userRole", response.data.user.role);

      // Redirect to the home page
      navigate("/home");
    } catch (error) {
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        } else if (error.response.status === 500) {
          setErrorMessage("Server error. Unable to login. Please try again.");
        } else {
          setErrorMessage(
            error.response.data.message ||
              "Login failed. Please check your credentials."
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from the server. Please try again.");
      } else {
        // Other errors
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false); // Stop loader
    }

    // Clear the form
    setEmail("");
    setPassword("");
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Login
        </Typography>

        {/* Display error message if any */}
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            required
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Forgot Password Link */}
          <Typography variant="body2" align="right">
            <Link to="/forgotPassword" style={{ textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </Typography>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register here
            </Link>
          </Typography>
        </Box>

        {/* Divider */}
        {/* <Divider sx={{ my: 2, width: "100%" }}>OR</Divider> */}

        {/* Social Sign-In Buttons */}
        {/* <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mb: 1 }}
        >
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon sx={{ color: "#4267B2" }} />}
        >
          Sign in with Facebook
        </Button> */}
      </Box>
    </Container>
  );
};

export default Login;

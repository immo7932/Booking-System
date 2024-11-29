// AddCentre.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import Sidebar from "./Sidebar";
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_GLOBALURL
    : process.env.REACT_APP_GLOBALURL;

const AddCentre = () => {
  const [centreName, setCentreName] = useState("");
  const [location, setLocation] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const addCentre = async () => {
    const getToken = localStorage.getItem("authToken");
    //console.log(getToken);
    axios.defaults.withCredentials = true;
    try {
      await axios.post(
        `${process.env.REACT_APP_GLOBALURL}/api/centres/add-centres`,
        {
          name: centreName,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken}`, // Sending token in Authorization header
          },
          withCredentials: true,
        }
      );
      setCentreName("");
      setLocation("");
      showMessage("Centre added successfully", "success");
    } catch (err) {
      showMessage("Error adding centre", "error");
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Add Centre
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Centre Name"
            value={centreName}
            onChange={(e) => setCentreName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={addCentre}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Centre
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Sidebar>
  );
};

export default AddCentre;

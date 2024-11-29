// UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_GLOBALURL
    : process.env.REACT_APP_GLOBALURL;



const UserProfile = () => {
  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.REACT_APP_GLOBALURL}/api/User/getUserDetailS/${userId}`
        );
        setUser(userResponse.data);

        // If user is a customer, fetch bookings
        if (userResponse.data.role === "customer") {
          const bookingsResponse = await axios.get(
            `${process.env.REACT_APP_GLOBALURL}/api/User/getBookingDetailS/${userId}`
          );
          setBookings(bookingsResponse.data);
        }

        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchData();
  }, [navigate, userId]);

  return (
    <Sidebar>
      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* User Profile Card */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  title="User Profile"
                  sx={{
                    textAlign: "center",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "bold",
                    color: "#6610f2",
                  }}
                />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name:"
                        secondary={user?.name || "N/A"}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Email:"
                        secondary={user?.email || "N/A"}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Role:"
                        secondary={user?.role || "N/A"}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Bookings Card */}
            {user?.role === "customer" && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title="My Bookings"
                    sx={{
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "bold",
                      color: "#6610f2",
                    }}
                  />
                  <CardContent sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <Card
                          key={index}
                          sx={{ mb: 2, boxShadow: 2, borderRadius: 1 }}
                        >
                          <CardContent>
                            <List>
                              <ListItem>
                                <ListItemText
                                  primary="Centre:"
                                  secondary={booking.centre}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Sport:"
                                  secondary={booking.sport}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Court:"
                                  secondary={booking.court}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Date:"
                                  secondary={booking.date}
                                />
                              </ListItem>
                              <Divider />
                              <ListItem>
                                <ListItemText
                                  primary="Time:"
                                  secondary={`${booking.startTime} - ${booking.endTime}`}
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body1" align="center">
                        No bookings found.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Loader */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Sidebar>
  );
};

export default UserProfile;

// middlewareAdmin.js

const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  //console.log(token);

  if (!token) {
   // console.log("No authToken cookie found.");
    return res
      .status(401)
      .json({ message: "No token provided. Authorization denied." });
  }

  try {
    // Verify the token using the same secret as in loginUser
    const decoded = jwt.verify(
      token,
      "b0742345623214e7f5aac75a4200799d80b55d26a62b97cd23015c33ae3ac11513e2e7" // Ensure this matches the secret used in loginUser
    );
    //console.log("Decoded JWT:", decoded);

    // Check if the user role is manager
    if (decoded.user.role && decoded.user.role.toLowerCase() === "customer") {
      req.user = decoded.user; // Attach user info to the request object
      next();
    } else {
      //console.log("User role is not customer.");
      return res.status(403).json({ message: "Forbidden: Customer only." });
    }
  } catch (err) {
   // console.error("JWT Verification Error:", err); // Log the error for debugging
    return res
      .status(401)
      .json({ message: "Invalid token. Authorization denied." });
  }
};

module.exports = verifyAdmin;

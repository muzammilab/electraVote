//External Module
const express = require("express");
const cors = require("cors");
const fs = require("fs"); // <-- for file system operations like creating folder
const path = require("path"); // <-- for handling folder paths
require("dotenv").config();

//local Module
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads folder created");
}

const checkRoleRouter = require("./routes/checkRole");
const userRouter = require("./routes/userRoute");
const candidateRouter = require("./routes/candidateRoute");
const electionRouter = require("./routes/electionRoute");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if using cookies / sessions
  })
); 

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

// To serve static files like images from 'uploads' folder 
app.use("/uploads", express.static("uploads"));


const MONGO_DB_URL = process.env.MONGO_URI;

app.use("/auth", checkRoleRouter);
app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
app.use("/election", electionRouter);


const Port = process.env.port || 3003;
mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(Port, () => {
      console.log(`server run on address http://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to MongoDB", err);
  });

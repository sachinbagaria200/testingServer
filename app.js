const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");

require("dotenv").config();

const HttpError = require("./models/http-error");
const authRoutes = require("./routes/authRoutes");
const serverRoutes = require("./routes/serverRoutes");
const { verifyTokenForAllRoutes } = require("./middlewares/defaultAuth");

const PORT = process.env.PORT;
const connectDB = require("./config/dbConnect.js");
//Connect mongo db
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res, next) => res.json({ message: `Server is running...` }));

app.use("/auth", authRoutes);
app.use("/api", verifyTokenForAllRoutes, serverRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    message: error.message || "An unkown error occured.",
    status: false,
  });
});

app.listen(PORT, () => {
  console.log(`server is up and running on port: ${PORT}.`);
});

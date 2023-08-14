const { json } = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const HttpError = require("./models/http-error");

const authRoutes = require("./routes/authRoutes");
const serverRoutes = require("./routes/serverRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res, next) => res.json({ message: `Server is running...` }));

app.use("/auth", authRoutes);
app.use("/api", serverRoutes);

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

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
}
main()
  .then(() => {
    console.log("DB connected!");
    try {
      app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
    } catch (error) {
      console.log(error.message);
    }
  })
  .catch((err) => console.log(err));

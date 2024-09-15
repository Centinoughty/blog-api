const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);

connectDb();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

app.use(postRoutes);
app.use(authRoutes);
app.use(userRoutes);
//apiDocs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error ${err.message}`);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`API is listening on ${port}`);
});

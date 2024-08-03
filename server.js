const path = require("path");
const express = require("express");

const app = express();

const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const { checkGroup } = require("./utils/checkGroup");

// INIT

// configPath
// const configPath="./config/config.env"
const configPath="./config/configTest.env"  


// Load env vars
dotenv.config({
  path: configPath,
  // debug: true,
});

// Connect to database...
connectDB();
checkGroup();

// Route files
const auth = require("./routes");



// Body parser
app.use(express.json({ limit: "25mb" }));

// Cookie parser
app.use(cookieParser());
// app.use(checkLimitationSpot);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

// File uploading
app.use(
  fileUpload({
    createParentPath: true,
    abortOnLimit: true,
    fileSize: 90000000,
  })
);
// Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Prevent http param pollution
app.use(hpp());
var corsOptions = {
  origin: '*', // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
// Set static folder
var public = path.join(__dirname, "public");
app.use(express.static(public));

app.use("/api/v1/auth", auth);
// Mount routers6
app.use(errorHandler);

const PORT = process.env.PORT || 8002;

const expressServer = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close expressServer & exit process
  // expressServer.close(() => process.exit(1));
});

module.exports = {
  app,
};

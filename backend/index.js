// dotenv config
require("dotenv").config();
// OR 
// require("dotenv/config");

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
 
// Calling the Express(), BodyParser, & a Static("public"), EJS MIddleware Template to get extra styling and resources
const app = express();
app.use(cors());
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

/*=== MongoDB Connection Function===*/
connectDB();

// Port assigned to the server
const PORT = process.env.PORT || 5000;

// Dev Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Dev MIddleware
/*app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});*/

/*======================= Routes Below ==========================*/
// ROUTES exported
app.use("/api/users", require("./routes/userRoute"))
app.use("/api/goals", require("./routes/goalRoute"))

// MIDDLEWARE for error handling
const { errorHandler, notFound } = require("./middleware/errorMIddleware")
app.use(errorHandler)
app.use(notFound)


/*======================= Routes Below ==========================*/

// App Server is listening on a specific port created...
app.listen(PORT, function () {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
    );
  });
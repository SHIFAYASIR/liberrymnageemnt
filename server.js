const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const mssql = require("./utils/sql.helper.js");

// middleware
const { notFound, errorHandler } = require("./middleware/error.middleware.js");

// user define routes
const masterBookRoutes = require("./routes/V1/masterBookEntry.routes.js");
const uploadRoutes = require("../job portal/routes/V1/upload.routes.js");


dotenv.config();

const app = express();
mssql.connect();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
// const __dirname3 = path.resolve();
// console.log(__dirname3);
app.use("/uploads", express.static("/uploads"));

// user define routes

app.use("/api/masterBook", masterBookRoutes);
// app.use("/api/employee-type", emploayeeTypeRoutes);



// app
//   .route("/api/employees")
//   .get(employeesController.getEmployees)
//   .post(employeesController.addEmployee);

app.get("/", (req, res) => {
  res.send("Api is running");
});




app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Server started running on ${colors.green(
      `http://localhost:${process.env.PORT}`
    )} for ${colors.rainbow(process.env.NODE_ENV)}`
  );
});

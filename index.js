const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require('body-parser')
app.use(express.json());
app.use(cors());
const db = require("./models");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Router
const employeeRouter = require("./routes/employee");
app.use("/", employeeRouter);

const projectRouter = require("./routes/project");
app.use('/project',projectRouter);

const notificationRouter = require("./routes/notification");
app.use("/notification",notificationRouter );

db.sequelize.sync().then(() => {
  app.listen(5050, () => {
    console.log("Server running on port 3001");
  });
});

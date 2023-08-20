const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

app.use(helmet());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    
    res.header("Access-Control-Allow-Credentials", true);
  
    next();
});
  

whitelist = ["http://localhost:8080"]
let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    optionsSuccessStatus: 200,
};
corsOptions = { origin: whitelist };
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
app.use(cookieParser(9));


// SET THE PORT AND THE JSON SPACES USED
app.set('port', 3080);
app.set('json spaces', 2);

const AuthRouter = require("./app/routes/auth.router");
const UserRouter = require("./app/routes/user.router");
const ChampionshipRouter = require("./app/routes/championship.router");
const OrganizationRouter = require("./app/routes/organization.router");

// DEFINE ALL THE MAJOR ROUTES
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/championships", ChampionshipRouter);
app.use("/organizations", OrganizationRouter);

// START LISTENING
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
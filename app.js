const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// SET THE PORT AND THE JSON SPACES USED
app.set('port', process.env.PORT || 3080);
app.set('json spaces', 2);

const UserRouter = require("./app/routes/user.router");

// DEFINE ALL THE MAJOR ROUTES
app.use("/users", bodyParser.json(), UserRouter);

// START LISTENING
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// SET THE PORT AND THE JSON SPACES USED
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

const SeasonRouter = require("./app/routes/season.routes");

// DEFINE ALL THE MAJOR ROUTES
app.use("/seasons", bodyParser.json(), SeasonRouter);

// START LISTENING
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
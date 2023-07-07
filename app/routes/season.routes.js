let express = require('express');
let router = express.Router();
const SeasonController = require("../controllers/season.controller");

router.get("/", SeasonController.getSeasons);

router.post("/", SeasonController.createSeason);

module.exports = router;
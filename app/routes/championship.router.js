let express = require('express');
let router = express.Router();

const ChampionshipController = require("../controllers/championship.controller");

router.get("/", [], ChampionshipController.getAllChampionships);

module.exports = router;
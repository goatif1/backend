let express = require('express');
let router = express.Router();

const ChampionshipController = require("../controllers/championship.controller");

router.get("/", [], ChampionshipController.getAllChampionships);

router.get("/:id_championship", [], ChampionshipController.getChampionship);
router.get("/:id_championship/drivers_standing", [], ChampionshipController.getChampionshipDriverStanding);
router.get("/:id_championship/teams_standing", [], ChampionshipController.getChampionshipTeamStanding);
router.get("/:id_championship/races", [], ChampionshipController.getChampionshipRaces);

module.exports = router;
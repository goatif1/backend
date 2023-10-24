let express = require('express');
let router = express.Router();

const ChampionshipController = require("../controllers/championship.controller");
const { isChampionshipAdmin } = require('../middleware/organization.middleware');
const { raceDoesntHaveRoulette, rouletteDataFields } = require('../middleware/race.middleware');
const { checkToken } = require('../middleware/user.middleware');

router.get("/", [], ChampionshipController.getAllChampionships);

router.get("/:id_championship", [], ChampionshipController.getChampionship);
router.get("/:id_championship/drivers_standing", [], ChampionshipController.getChampionshipDriverStanding);
router.get("/:id_championship/teams_standing", [], ChampionshipController.getChampionshipTeamStanding);
router.get("/:id_championship/races", [], ChampionshipController.getChampionshipRaces);

router.post("/:id_championship/races/:id_race/roulette", [checkToken, isChampionshipAdmin, raceDoesntHaveRoulette, rouletteDataFields], ChampionshipController.createRaceRoulette);

module.exports = router;
const RaceService = require("../services/race.service");

const raceHasRoulette = async (req, res, next) => {
    try {
        let roulette = await RaceService.getRaceRoulette(req.params.id_race);

        if (!roulette){
            return res.status(400).json({status: 400, error: "Error. Race doesn't have roulette yet."});
        }

        next();
    } catch(e) {
        return res.status(400).json({status: 400, error: "Error checking if race has roulette."});
    }
}

const raceDoesntHaveRoulette = async (req, res, next) => {
    try {
        let roulette = await RaceService.getRaceRoulette(req.params.id_race);

        if (roulette){
            return res.status(400).json({status: 400, error: "Error. Race doesn't have roulette yet."});
        }

        next();
    } catch(e) {
        return res.status(400).json({status: 400, error: "Error checking if race has roulette."});
    }
}

module.exports = {
    raceHasRoulette,
    raceDoesntHaveRoulette
}
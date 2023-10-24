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

const rouletteDataFields = async (req, res, next) => {
    try {
        if (!req.body) return res.status(400).json({status: 400, error: "Request body is missing"});

        if (!req.body.options) return res.status(400).json({status: 400, error: "options field is missing in request body."})
        if (req.body.options.length <= 2) return res.status(400).json({status: 400, error: "options must have at least two elements"})

        next();

    } catch (e){
        return res.status(400).json({status: 400, error: "Error checking roulette options."});
    }
}

module.exports = {
    raceHasRoulette,
    raceDoesntHaveRoulette,
    rouletteDataFields
}
let SeasonService = require("../services/season.service");

const getSeasons = async function (req, res, next) {
    console.log("SEASON CONTROLLER - getSeasons");
    try{
        let seasons = await SeasonService.getSeasons();
        return res.status(200).json({ status: 200, data: seasons, message: "Successfully Seasons Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

const createSeason = async function (req, res, next) {
    try{
        let season_data = {};
        // Check mandatory params
        if (!req.body){
            return res.status(400).json({ status: 400, message: "Bad Request (no body)" });
        }else{
            if (!req.body.alias || !req.body.date_ini || !req.body.date_end){
                return res.status(400).json({ status: 400, message: "Bad Request (alias, date_ini, date_end are mandatory)" });
            }
        }

        season_data.alias = req.body.alias;
        season_data.date_ini = req.body.date_ini;
        season_data.date_end = req.body.date_end;
        season_data.image = req.body.image ?? null;
        season_data.finished = req.body.finished ?? false;

        let created = await SeasonService.createSeason(season_data);

        return res.status(200).json({ status: 200, data: created, message: "Successfully Created Season" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getSeasons,
    createSeason
}
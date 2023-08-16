const ChampionshipService = require("../services/championship.service");

const getAllChampionships = async function (req, res, next) {
    try {
        let championships = await ChampionshipService.getAllChampionship();
        return res.status(200).json(championships);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getAllChampionships
}
const ChampionshipService = require("../services/championship.service");

const getAllChampionships = async function (req, res, next) {
    try {
        let championships = await ChampionshipService.getAllChampionship();
        return res.status(200).json(championships);
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Error getting all championships" });
    }
}

const getOrganizationChampionships = async function (req, res, next) {
    try {
        let championships = await ChampionshipService.getOrganizationChampionships(req.params.id_organization);
        return res.status(200).json(championships);
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Error getting organization championships" });
    }
}

const createChampionship = async (req, res, next) => {
    try {
        let organization_id = req.params.id_organization;
        
        let created = await ChampionshipService.createChampionship();
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Error creating championship" });
    }
}

module.exports = {
    getAllChampionships,
    getOrganizationChampionships,
    createChampionship
}
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

const getChampionship = async (req, res, next) => {
    try {
        let championship = await ChampionshipService.getChampionship(req.params.id_championship);
        return res.status(200).json(championship);
    } catch (e){
        return res.status(400).json({ status: 400, message: "Error getting championship" });
    }
}

const getChampionshipDriverStanding = async (req, res, next) => {
    try {
        let standing = await ChampionshipService.getChampionshipDriverStanding(req.params.id_championship);
        return res.status(200).json(standing);
    } catch (e){
        return res.status(400).json({ status: 400, message: "Error getting championship drivers standing" });
    }
}

const getChampionshipTeamStanding = async (req, res, next) => {
    try {
        let standing = await ChampionshipService.getChampionshipTeamStanding(req.params.id_championship);
        return res.status(200).json(standing);
    } catch (e){
        return res.status(400).json({ status: 400, message: "Error getting championship teams standing" });
    }
}

const getChampionshipRaces = async (req, res, next) => {
    try {
        let races = await ChampionshipService.getChampionshipRaces(req.params.id_championship);
        return res.status(200).json(races);
    } catch (e){
        return res.status(400).json({ status: 400, message: "Error getting championship races" });
    }
}

const createChampionship = async (req, res, next) => {
    try {
        let organization_id = req.params.id_organization;

        let created = await ChampionshipService.createChampionship(req.address, organization_id, req.body);

        return res.status(200).json({status: "Success"});
    } catch (e) {
        return res.status(400).json({ status: 400, message: "Error creating championship" });
    }
}

module.exports = {
    getAllChampionships,
    getOrganizationChampionships,

    getChampionship,
    getChampionshipDriverStanding,
    getChampionshipTeamStanding,
    getChampionshipRaces,

    createChampionship
}
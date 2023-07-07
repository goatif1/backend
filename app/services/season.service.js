let { QueryTypes } = require("sequelize");

const getSeasons = async function (){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                season.id,
                season.alias,
                season.date_ini,
                season.date_end,
                season.image,
                season.finished
            FROM season;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT
            })
            .then((seasons) => {
                resolve(seasons);
            })
            .catch((err) => {
                reject(err);
                throw Error("SeasonService. Error while getting seasons. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting seasons");
    }
}

const createSeason = async function (seasonData){
    try {
        
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            INSERT INTO season (alias, date_ini, date_end, image, finished)
            VALUES ($alias, $date_ini, $date_end, $image, $finished);
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                bind: {
                    alias: seasonData.alias,
                    date_ini: seasonData.date_ini,
                    date_end: seasonData.date_end,
                    image: seasonData.image,
                    finished: seasonData.finished
                },
                type: QueryTypes.INSERT
            })
            .then((season) => {
                resolve(season);
            })
            .catch((err) => {
                reject(err);
                throw Error("SeasonService. Error while creating a new season. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting seasons");
    }
}

module.exports = {
    getSeasons,
    createSeason
}
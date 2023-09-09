let { QueryTypes } = require("sequelize");

// GET
const invitationExists = async function (invitation_code){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT 
                user.invitation_code 
            FROM user 
            WHERE invitation_code = $invitation_code;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    invitation_code: invitation_code
                }
            })
            .then((invitations_code) => {
                resolve(invitations_code.length > 0);
            })
            .catch((err) => {
                reject(err);
                throw Error("InvitationService. Error while checking invitation existance. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("InvitationService. Error while checking invitation existance. " + err);
    }
}

module.exports = {
    invitationExists
}
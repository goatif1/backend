let { QueryTypes } = require("sequelize");

const getNonce = async function (address){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                user.nonce
            FROM user
            WHERE user.address = $address;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    address: address
                }
            })
            .then((nonce) => {
                resolve(nonce && nonce.length > 0 ? nonce[0] : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while getting nonce. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting nonce");
    }
}

module.exports = {
    getNonce
}
let { QueryTypes } = require("sequelize");

// GET
const getUser = async function (id){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                user.id as id,
                user.email as user.email,
                user.password as password,
                user.nickname as nickname,
                user.dateofcreation as dateofcreation,
                user.url_image as url_image
            FROM user
            WHERE user.id = $id
            LIMIT 1;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id: id
                }
            })
            .then((users) => {
                resolve(users && users.length > 0 ? users[0] : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while getting user data. " + err);
            });
        });

    } catch (e) {
        // log errors
        console.log("Get user exception: ", e);
        throw Error("Error while getting user data");
    }
}

const existsUser = async (email, nickname) => {
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT id
            FROM user
            WHERE email = $email OR nickname = $nickname;
        `;

        let find_res = await DBConn.query(sqlQuery, {
            type: QueryTypes.SELECT,
            bind: {
                email: email,
                nickname: nickname
            }
        });

        return find_res && find_res.length > 0;

    } catch(e){
        throw Error("Error while finding user.");
    }
}

const nicknameIsAvailable = async (nickname) => {
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT nickname
            FROM user
            WHERE nickname = $nickname;
        `;

        let find_res = await DBConn.query(sqlQuery, {
            type: QueryTypes.SELECT,
            bind: {
                nickname: nickname
            }
        });

        if (find_res && find_res.length > 0) return false;
        return true;

    } catch (e) {

    }
}

// POST
const register = async function (email, nickname, hashedPassword){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            INSERT INTO user (email, password, nickname)
            VALUES ($email, $hashedPassword, $nickname);
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                bind: {
                    email: email,
                    hashedPassword: hashedPassword,
                    nickname: nickname
                }
            })
            .then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while creating user. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while creating user. " + e);
    }
}

module.exports = {
    getUser,

    existsUser,
    nicknameIsAvailable,

    register
}
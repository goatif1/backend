let UserService = require("../services/user.service");
const crypto = require('crypto');

const getNonce = async function (req, res, next) {
    try{
        let user = await UserService.getUser(req.public_address);
        let nonce = null;
        if (!user){
            const new_nonce = crypto.randomInt(1, 4294967290);
            const new_uuid = crypto.randomUUID();
            const nickname = new_uuid.substring(19, 23);
            const invitation_code = new_uuid.substring(0, 12);
            let userCreated = await UserService.createUser(req.public_address, new_nonce, nickname, invitation_code);
            if (!userCreated){
                return res.status(400).json({ status: 400, message: "Unable to create user." });
            }
            nonce = new_nonce;
        }else {
            nonce = user.nonce;
        }
        return res.status(200).json({ status: 200, data: nonce, message: "Successfully Nonce Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getNonce
}
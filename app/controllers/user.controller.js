let UserService = require("../services/user.service");

const getNonce = async function (req, res, next) {
    console.log("USER CONTROLLER - getNonce");
    try{
        let nonce = await UserService.getNonce(req.public_address);
        console.log("NONCE: ", nonce);
        return res.status(200).json({ status: 200, data: nonce, message: "Successfully Nonce Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getNonce
}
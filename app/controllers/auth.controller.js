const UserService = require("../services/user.service");
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const SECRET = 'GoatiF1_s3cr3t_jwt_k3y';

const authenticate = async function (req, res, next) {
    try {
        if (!req.body){
            return res.status(400).json({ status: 400, message: "Missing request body to authenticate." });
        }
        if (!req.body.address){
            return res.status(400).json({ status: 400, message: "Missing public address in request body to authenticate." });
        }
        if (!req.body.signature){
            return res.status(400).json({ status: 400, message: "Missing signature in request body to authenticate." });
        }
        const public_address = req.body.address;
        const signature = req.body.signature;

        const nonce = await UserService.getNonce(public_address);
        if (!nonce){
            return res.status(400).json({ status: 400, message: "Nonce not found." });
        }
        const userMessage = `GoatiF1 Sign to log in with one-time nonce: ${nonce}`;
        const msg = `0x${stringToHex(userMessage)}`;

        // Eliptic curve signature verification with ecrecover function
        const msgBuffer = ethUtil.toBuffer(msg);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
        const publicKey = ethUtil.ecrecover(
            msgHash, 
            signatureParams.v,
            signatureParams.r,
            signatureParams.s
        );
        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const recoveredAddress = ethUtil.bufferToHex(addressBuffer);

        if (recoveredAddress.toLowerCase() === public_address.toLowerCase()){
            // create jwt
            let token = jwt.sign({ address: public_address }, SECRET, {
                expiresIn: 86400 // 24H
            });
            return res.status(200).json({
                ecrecovery: true,
                auth: true,
                token: token
            })
        } else {
            return res.status(400).json({ status: 400, message: "Signature recovery error." });
        }

    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

const login = async (req, res, next) => {

}

const isNicknameAvailable = async (req, res, next) => {
    try {
        const {nickname} = req.query;
        console.log("Nickname is: ", nickname);

        if (!nickname) return res.status(400).json({error: "Nickname missing in request query."});

        let isAvailable = await UserService.nicknameIsAvailable(nickname);

        return res.status(200).json({available: isAvailable});
    } catch(e) {
        res.status(500).json({error: "Internal server error"});
    }
}

const register = async (req, res, next) => {
    try {
        const { email, username: nickname, password } = req.body;

        // Check if user already exists

        const existingUser = UserService.existsUser(email, nickname);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user data (in a real application, you would store this in a database)
        UserService.register(email, nickname, hashedPassword);

        return res.status(201).json({ message: 'User registered successfully' });

    } catch(e) {
        console.error(e);
        res.status(500).json({error: "Internal server error"});
    }
}

const stringToHex = (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return Array.prototype.map.call(data, byte => byte.toString(16).padStart(2, '0')).join('');
}

module.exports = {
    authenticate,

    isNicknameAvailable,
    register
}
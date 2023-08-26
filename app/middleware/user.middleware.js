const jwt = require("jsonwebtoken");

const GetAddress_inParams = async (req, res, next) => {
    try {
        if (!req.params || !req.params.address){
            return res.status(400).json({ status: 400, error: "Error getting user public address."});
        } else {
            req.public_address = req.params.address;
            next();
        }
    } catch(e){
        return res.status(400).json({ status: 400, error: "Error getting user public address."});
    }
}

const GetAddress_inBody = async (req, res, next) => {
    try {
        if (!req.body || !req.body.address){
            return res.status(400).json({ status: 400, error: "Error getting user public address."});
        } else {
            req.public_address = req.body.address;
            next();
        }
    } catch(e){
        return res.status(400).json({ status: 400, error: "Error getting user public address."});
    }
}

const checkToken = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token) return res.status(401).json({status: 401, error: "No token provided"});
        
        token = token.replace("Bearer ", "");

        jwt.verify(token, 'GoatiF1_s3cr3t_jwt_k3y', (err, decoded) => {
            if (err) return res.status(401).json({status: 401, error: "Failed to authenticate token."});

            req.address = decoded.address;
            next();
        })

    } catch (e) {
        return res.status(400).json({status: 400, error: "Error checking token."});
    }
}

module.exports = {
    GetAddress_inParams,
    GetAddress_inBody,
    checkToken
}

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

module.exports = {
    GetAddress_inParams,
    GetAddress_inBody
}
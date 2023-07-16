
const GetAddress = async (req, res, next) => {
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

module.exports = {
    GetAddress
}
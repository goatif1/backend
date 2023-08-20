const CreateOrganization = async (req, res, next) => {
    try {
        if (!req.body || !req.body.name || !req.body.description){
            return res.status(400).json({ status: 400, error: "Error getting League body parameters."});
        } else {
            next();
        }
    } catch(e){
        return res.status(400).json({ status: 400, error: "Error getting League body parameters."});
    }
}

module.exports = {
    CreateOrganization
}
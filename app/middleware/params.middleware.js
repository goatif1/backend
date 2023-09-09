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

const CreateChampionship = async (req, res, next) => {
    try {
        if (!req.body) return res.status(400).json({status: 400, error: "Fields Error: Not found request body."});

        let data = req.body;
        // TODO FOLLOW FROM HERE

        if (!data.name) return res.status(400).json({status: 400, error: "Fields Error: "})

    } catch (e){
        return res.status(400).json({ status: 400, error: "Error checking create championship required parameters."});
    }
}

module.exports = {
    CreateOrganization,
    CreateChampionship
}
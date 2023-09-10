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

        if (!data.name) return res.status(400).json({status: 400, error: "Fields Error: Not found 'name' in request body"});
        if (!data.description) return res.status(400).json({status: 400, error: "Fields Error: Not found 'description' in request body"});
        if (!data.hasOwnProperty("adminIsDriver")) return res.status(400).json({status: 400, error: "Fields Error: Not found 'adminIsDriver' in request body"});
        if (!data.invitationCodes) return res.status(400).json({status: 400, error: "Fields Error: Not found 'invitationCodes' in request body"});
        if (!data.teams) return res.status(400).json({status: 400, error: "Fields Error: Not found 'teams' in request body"});

        if (typeof data.name != "string") return res.status(400).json({status: 400, error: "Fields Error: 'name' has to be a string"});
        if (typeof data.description != "string") return res.status(400).json({status: 400, error: "Fields Error: 'description' has to be a string"});
        if (typeof data.adminIsDriver != "boolean") return res.status(400).json({status: 400, error: "Fields Error: 'adminIsDriver' has to be a boolean"});
        if (!Array.isArray(data.invitationCodes)) return res.status(400).json({status: 400, error: "Fields Error: 'invitationCodes' has to be an array of strings"});
        if (!Array.isArray(data.teams)) return res.status(400).json({status: 400, error: "Fields Error: 'teams' has to be an array of strings"});

        next();

    } catch (e){
        return res.status(400).json({ status: 400, error: "Error checking create championship required parameters."});
    }
}

module.exports = {
    CreateOrganization,
    CreateChampionship
}
const GetInvitation_inParams = (req, res, next) => {
    try {
        if (!req.params || !req.params.invitation_code){
            return res.status(400).json({status: 400, error: "Error getting invitation from request params"});
        }

        req.invitation_code = req.params.invitation_code;
        next();

    } catch(e) {
        return res.status(400).json({status: 400, error: "Error getting invitation from request params"});
    }
}

module.exports = {
    GetInvitation_inParams
}
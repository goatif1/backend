const InvitationService = require("../services/invitation.service");

const invitationExist = async (req, res, next) => {
    try {
        let exists = await InvitationService.invitationExists(req.invitation_code);
        return res.status(200).json(exists)
    } catch (e) {
        return res.status(400).json({status: 400, error: "Error checking the existance of an invitation code."})
    }
}

module.exports = {
    invitationExist
}
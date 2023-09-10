const OrganizationService = require("../services/organization.service");

const isOrganizationAdmin = async (req, res, next) => {
    try {
        let is_admin = await OrganizationService.isOrganizationAdmin(req.address, req.params.id_organization);

        if (!is_admin){
            return res.status(400).json({status: 400, error: "Error. User is not the league administrator."});
        }

        next();
    } catch(e) {
        return res.status(400).json({status: 400, error: "Error checking if user is the league admin."});
    }
}

module.exports = {
    isOrganizationAdmin
}
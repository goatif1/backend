const OrganizationService = require("../services/organization.service");

const getAllOrganizations = async function (req, res, next) {
    try {
        let organizations = await OrganizationService.getAllOrgnanizations();
        return res.status(200).json(organizations);
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

const createOrganization = async (req, res, next) => {
    try {
        let create_result = await OrganizationService.createOrganization(req.public_address, req.body.name, req.body.description);
        if (create_result){
            return res.status(200).json({created: true});
        }
        return res.status(400).json({ status: 400, message: "Error creating League." });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

module.exports = {
    getAllOrganizations,
    createOrganization
}
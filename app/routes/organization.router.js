let express = require('express');
let router = express.Router();

const OrganizationController = require("../controllers/organization.controller");
const { checkToken } = require('../middleware/user.middleware');
const { CreateOrganization } = require('../middleware/params.middleware');

// TODO: ADD THE TOKEN MIDDLEWARE
router.get("/", [], OrganizationController.getAllOrganizations);
router.get("/admin", [checkToken], OrganizationController.getUserOrganizations);

router.post("/", [checkToken, CreateOrganization], OrganizationController.createOrganization);

module.exports = router;
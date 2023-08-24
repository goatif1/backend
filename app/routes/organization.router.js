let express = require('express');
let router = express.Router();

const OrganizationController = require("../controllers/organization.controller");
const { GetAddress_inBody } = require('../middleware/user.middleware');
const { CreateOrganization } = require('../middleware/params.middleware');

// TODO: ADD THE TOKEN MIDDLEWARE
router.get("/", [], OrganizationController.getAllOrganizations);

router.post("/", [GetAddress_inBody, CreateOrganization], OrganizationController.createOrganization);

module.exports = router;
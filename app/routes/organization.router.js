let express = require('express');
let router = express.Router();

const OrganizationController = require("../controllers/organization.controller");
const ChampionshipController = require("../controllers/championship.controller");

const { checkToken } = require('../middleware/user.middleware');
const { CreateOrganization, CreateChampionship } = require('../middleware/params.middleware');
const { isOrganizationAdmin } = require('../middleware/organization.middleware');

// TODO: ADD THE TOKEN MIDDLEWARE
router.get("/", [], OrganizationController.getAllOrganizations);
router.get("/admin", [checkToken], OrganizationController.getUserOrganizations);

router.get("/:id_organization", [], OrganizationController.getOrganization);
router.get("/:id_organization/championships", [], ChampionshipController.getOrganizationChampionships);

router.post("/", [checkToken, CreateOrganization], OrganizationController.createOrganization);
router.post("/:id_organization/championships", [checkToken, isOrganizationAdmin, CreateChampionship], ChampionshipController.createChampionship);

module.exports = router;
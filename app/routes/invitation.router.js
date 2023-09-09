let express = require('express');
let router = express.Router();

const InvitationController = require("../controllers/invitation.controller");
const { GetInvitation_inParams } = require('../middleware/invitation.middleware');

router.get("/:invitation_code/exist", [GetInvitation_inParams], InvitationController.invitationExist);

module.exports = router;
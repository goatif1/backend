let express = require('express');
let router = express.Router();

const UserController = require("../controllers/user.controller");
const { GetAddress_inParams } = require('../middleware/user.middleware');

router.get("/:address/nonce", [GetAddress_inParams], UserController.getNonce);

module.exports = router;
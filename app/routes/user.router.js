let express = require('express');
let router = express.Router();

const UserController = require("../controllers/user.controller");
const { GetAddress } = require('../middleware/user.middleware');

router.get("/:address/nonce", [GetAddress], UserController.getNonce);

module.exports = router;
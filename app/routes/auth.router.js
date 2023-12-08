let express = require('express');
let router = express.Router();

const AuthController = require("../controllers/auth.controller");

router.post("/", [], AuthController.authenticate);

router.get("/nickname", [], AuthController.isNicknameAvailable);

router.post("/login", [], AuthController.login);
router.post("/register", [], AuthController.register);

module.exports = router;
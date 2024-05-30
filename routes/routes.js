const express = require('express');
const CloudEvolveController = require("../controller/MainCntrl")
const validations = require('../config/validator');
router = express.Router();


//mailapi
router.post("/test1",CloudEvolveController.test1)
router.post("/sendmail",CloudEvolveController.PublicPortalContactForm)

module.exports = router;
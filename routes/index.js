const express = require("express");
const router = express.Router();
module.exports = router;

router.use('/wiki', require('./wiki'));
router.use('/user', require('./user'));


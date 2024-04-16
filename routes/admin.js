const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
// const verifyToken = require('../middleware/verifyToken'); // You can create this middleware



router.post("/schoolRegister", adminController.schoolRegister);
module.exports = router;
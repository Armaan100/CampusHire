const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const adminController = require('../controllers/admin.controller.js');
const {authAdmin} = require('../middlewares/auth.middleware');

router.post("/register", [
    body('id')
    .isLength({min: 5, max: 5}).withMessage("ID must be of 5 digits")
    .isNumeric().withMessage('ID must be a number'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('name').isLength({min:3}).withMessage('Name must be atleast 3 characters long')
], adminController.Register);

router.post("/login", [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
], adminController.Login);

router.get("/logout", authAdmin, adminController.Logout);

module.exports = router;
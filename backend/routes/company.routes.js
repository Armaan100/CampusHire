const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const companyController = require('../controllers/company.controller.js');
const {authCompany} = require('../middlewares/auth.middleware');

router.post("/register", [
    body('id').isLength({min: 5, max: 5}).withMessage('Please enter a valid id'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid roll number'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long')
], companyController.Register);

router.post("/login",[
    body('rollno').isLength({min:8,max:15}).withMessage('Please enter a valid roll number'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],companyController.Login);

router.get("/logout", authCompany, companyController.Logout);

router.post("/post-job", authCompany, companyController.PostJob);

router.get("/get-applications", authCompany, companyController.GetApplications);

router.put("/shortlist-resume", authCompany, companyController.ShortlistResume);

router.put("/send-coding-test", authCompany, companyController.SendCodingTest);

router.get("/get-applications-phase2", authCompany, companyController.GetApplicationsPhase2);

router.put("/evaluate-coding-test", authCompany, companyController.EvaluateCodingTest);

router.get("/get-applications-phase3", authCompany, companyController.GetApplicationsPhase3);

router.put("/schedule-interview", authCompany, companyController.ScheduleInterview); 

router.put("/evaluate-interview", authCompany, companyController.EvaluateInterview);

module.exports = router;

//remaining with -> validation of these routes + controller for student after applying to the company, i.e., submitting the coding test and all
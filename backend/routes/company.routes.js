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
    body('email').isEmail().withMessage('Please enter a valid roll number'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],companyController.Login);

router.get("/logout", authCompany, companyController.Logout);

router.get("/get-profile", authCompany, companyController.GetProfile);

router.post("/post-job", authCompany, companyController.PostJob);

router.get("/get-jobs", authCompany, companyController.GetJobs);

router.get("/get-applications/:job_id", authCompany, companyController.GetApplications);

router.post("/shortlist-resume", authCompany, companyController.ShortlistResume);

router.post("/send-coding-test", authCompany, companyController.SendCodingTest);

router.get("/get-applications-phase2/:job_id", authCompany, companyController.GetApplicationsPhase2);

router.post("/evaluate-coding-test", authCompany, companyController.EvaluateCodingTest);

router.get("/get-applications-phase3/:job_id", authCompany, companyController.GetApplicationsPhase3);

router.post("/schedule-interview", authCompany, companyController.ScheduleInterview); 

router.get("/get-applications-phase4/:job_id", authCompany, companyController.GetApplicationsPhase4);

router.post("/evaluate-interview", authCompany, companyController.EvaluateInterview);

router.get("/job-status/:job_id", authCompany, companyController.JobStatus);

router.post("/update-job-phase/", authCompany, companyController.UpdateJobPhase);

module.exports = router;

//remaining with -> validation of these routes + controller for student after applying to the company, i.e., submitting the coding test and all
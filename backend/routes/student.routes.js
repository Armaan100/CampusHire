const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const upload = require('../libs/multer');

const studentController = require('../controllers/student.controller.js');
const {authStudent, authCompany} = require('../middlewares/auth.middleware');

router.post("/register", [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Please enter a valid phone number'),
    body('roll_number').isLength({ min: 8, max: 15 }).withMessage('Please enter a valid roll number'),
    body('semester').notEmpty().withMessage('Please enter a valid semester type'),
    body('branch').notEmpty().withMessage('Please enter a valid branch'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('year_of_passing').notEmpty().withMessage('Please enter a valid year of passing'),
    body('current_cgpa').notEmpty().withMessage('Please enter a valid cgpa')
], studentController.Register);

router.post("/login",[
    body('rollno').isLength({min:8,max:15}).withMessage('Please enter a valid roll number'),
    body('password').isLength({min:3}).withMessage('Password must be atleast 3 characters long')
],studentController.Login);


router.get("/logout", authStudent, studentController.Logout);

// router.get("/profile", authStudent, studentController.Profile);

router.post("/upload-resume", authStudent, upload.single('resume'), studentController.UploadResume);

router.get("/get-full-time", authStudent, studentController.GetFullTime);

router.get("/get-internships", authStudent, studentController.GetInternships);

router.get("/get-job-details/:job_id", authStudent, studentController.GetJobDetails);

router.post("/apply-job", authStudent, studentController.ApplyJob);

router.post("/submit-coding-test", authStudent, studentController.SubmitCodingTest);

router.get("/get-profile", authStudent, studentController.GetProfile);

router.get("/get-applied-internships", authStudent, studentController.GetAppliedInternships); //to be done

router.get("/get-applied-full-time", authStudent, studentController.GetAppliedFullTime); //to be done


router.get("/get-application-details/:job_id", authStudent, studentController.GetApplicationDetails);  //to be done

router.get("/download-resume/:resume", authCompany, studentController.DownloadResume); 

module.exports = router;
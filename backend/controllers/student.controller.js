const sendEmail = require("../libs/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {db} = require("../db/db");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const { application } = require("express");

//Register Student
module.exports.Register = async(req, res) => {
    console.log(req.body);

    try{
        const {roll_number, name, password, city, state, email, phone, branch, semester, year_of_passing, current_cgpa} = req.body;

        //check if a file is uploaded
        // if(!req.file){
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please upload a resume"
        //     });
        // }

        // //file uploaded
        // const resumePath = req.file.path;

        //check if email already exists
        db.query("SELECT * FROM student WHERE email = ?", [email], async(err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            //email already exits
            if(result.length > 0){
                return res.status(400).json({
                    success:  false,
                    message: "Email already exists"
                    });
            }

            //email does not exits
            let hashedPassword = await bcrypt.hash(password, 10);   //hash the password
            

            //insert the student into the database
            const insertQuery = "INSERT INTO Students (roll_number, name, password, city, state, email, phone, branch, semester, year_of_passing, current_cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(insertQuery, [roll_number, name, hashedPassword, city, state, email, phone, branch, semester, year_of_passing, current_cgpa], (err, result) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }

                //generate JWT token
                const token = jwt.sign(
                    {id: rollNumber},
                    process.env.JWT_SECRET, 
                    {expiresIn: "1h"}
                );
                
                //send the token to frontend
                res.cookie("token", token);

                res.status(200).json({
                    success: true,
                    message: "Student registered successfully",
                    token
                });
            });
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



//Login Student
module.exports.Login = async(req, res) => {
    try{
        const {rollNumber, password} = req.body;

        //check if student exists
        db.query("SELECT * FROM student WHERE rollNumber = ?", [rollNumber], async(err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            //student does not exist
            if(result.length === 0){
                return res.status(400).json({
                    success: false,
                    message: "Invalid roll number"
                });
            }

            //student exists
            const isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch){
                return res.status(400).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            //generate JWT token
            const token = jwt.sign(
                {id: rollNumber},
                process.env.JWT_SECRET, 
                {expiresIn: "1h"}
            );
            
            //send the token to frontend
            res.cookie("token", token);

            res.status(200).json({
                success: true,
                message: "Student logged in successfully",
                token
            });
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



//Logout Student
module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie("token"); 

        return res.status(200).json({
            success: true,
            message: "Student logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


//UploadResume
module.exports.UploadResume = async(req, res) => {
    try{
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume file",
            });
        }

        // File uploaded
        const studentId = req.student.rollNumber;
        const resumePath = req.file.path;

        db.query("UPDATE student SET resume = ? WHERE rollNumber = ?", [resumePath, studentId], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message,
                });
            }

            res.status(200).json({
                success: true,
                message: "Resume uploaded successfully",
            });
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



//getJobs
module.exports.GetFullTime = async(req, res) => {
    try{
        const student = req.student;

        const query = "SELECT * FROM Job WHERE eligibility_year = ? AND eligibility_cgpa <= ? AND type='FullTime'";

        db.query(query, [student.year_of_passing, student.current_cgpa], (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            return res.status(200).json({
                success: true,
                jobs: result
            })
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}


//getInternships
module.exports.GetInternships = async(req, res) => {
    try{
        const student = req.student;

        const query = "SELECT * FROM Job WHERE eligibility_year = ? AND eligibility_cgpa <= ? AND type='Internship'"

        db.query(query, [student.year_of_passing, student.current_cgpa], (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            return res.status(200).json({
                success: true,
                jobs: result
            })
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}


//applyJob
module.exports.ApplyJob = async(req, res) => {
    try{
        const {job_id} = req.body;
        const student = req.student;
        const rollNumber = student.roll_number;

        //check if the student has already applied for the job
        const [existingApplication] = await db.execute("SELECT * FROM Application WHERE job_id = ? AND roll_number = ?", [job_id, rollNumber]);
        if(existingApplication.length > 0){
            return res.status(400).json({
                success: false,
                message: "You have already applied for the job"
            })
        }


        //apply for the job
        const query = "INSERT INTO application (job_id, roll_number, overall_status) VALUES (?, ?, ?)";

        db.query(query, [job_id, rollNumber, "Applied"], (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            res.status(200).json({
                success: true,
                message: "Job applied successfully",
                rollNumber: rollNumber,
                job_id: job_id
            })
        })
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}







const sendEmail = require("../libs/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const path = require("path");
const fs = require("fs");

//Register Student
module.exports.Register = async (req, res) => {
  console.log(req.body);

  try {
    const {
      rollNumber,
      name,
      password,
      city,
      state,
      email,
      phone,
      branch,
      semester,
      yearOfPassing,
      currentCGPA,
    } = req.body;

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
    db.query(
      "SELECT * FROM student WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        //email already exits
        if (result.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }

        //email does not exits
        let hashedPassword = await bcrypt.hash(password, 10); //hash the password

        //insert the student into the database
        const query =
          "INSERT INTO Student (roll_number, name, password, city, state, email, phone, branch, semester, year_of_passing, current_cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          query,
          [
            rollNumber,
            name,
            hashedPassword,
            city,
            state,
            email,
            phone,
            branch,
            semester,
            yearOfPassing,
            currentCGPA,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Problem making the query",
                error: err.message,
              });
            }

            //generate JWT token
            const token = jwt.sign({ id: rollNumber }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });

            //send the token to frontend
            res.cookie("token", token);

            res.status(200).json({
              success: true,
              message: "Student registered successfully",
              token,
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Yo",
      error: err.message,
    });
  }
};

//Login Student
module.exports.Login = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    //check if student exists
    db.query(
      "SELECT * FROM student WHERE roll_number = ?",
      [rollNumber],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        //student does not exist
        if (result.length === 0) {
          return res.status(400).json({
            success: false,
            message: "You are not registered. Please register first",
          });
        }

        //student exists
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Password Incorrect",
          });
        }

        //generate JWT token
        const token = jwt.sign({ id: rollNumber }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        //send the token to frontend
        res.cookie("token", token);

        res.status(200).json({
          success: true,
          message: "Student logged in successfully",
          token,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//Logout Student
module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Student logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//Profile Student
module.exports.Profile = async (req, res) => {
  try {
    const rollNumber = req.student.roll_number;

    db.query(
      "SELECT * FROM student WHERE roll_number = ?",
      [rollNumber],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        //student does not exist
        if (result.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Student not found",
          });
        }

        //remove password from the result
        result[0].password = undefined;

        //student exists
        res.status(200).json({
          success: true,
          student: result[0],
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}


//UploadResume
module.exports.UploadResume = async (req, res) => {
  try {
    // Check if a file was uploaded
    console.log(req.file);
    console.log(req.student);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }

    // File uploaded
    const rollNumber = req.student.roll_number;
    const resumePath = req.file.path;
    console.log(resumePath);

    db.query(
      "UPDATE student SET resume = ? WHERE roll_number = ?",
      [resumePath, rollNumber],
      (err, result) => {
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
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


//getJobs
module.exports.GetFullTime = async (req, res) => {
  try {
    const student = req.student;

    const query =
      "SELECT * FROM Job WHERE eligibility_year = ? AND eligibility_cgpa <= ? AND type='FullTime'";

    db.query(
      query,
      [student.year_of_passing, student.current_cgpa],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        return res.status(200).json({
          success: true,
          jobs: result,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//getInternships
module.exports.GetInternships = async (req, res) => {
  try {
    const student = req.student;
    console.log(req.student);

    const query =
      "SELECT * FROM Job WHERE eligibility_year = ? AND eligibility_cgpa <= ? AND type='Internship'";

    db.query(
      query,
      [student.year_of_passing, student.current_cgpa],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        console.log(result);

        return res.status(200).json({
          success: true,
          jobs: result,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//applyJob
module.exports.ApplyJob = async (req, res) => {
  try {
    const { job_id } = req.body;
    const rollNumber = req.student.roll_number;

    //check if the student has already applied for the job
    query = "SELECT * FROM Application WHERE job_id = ? AND roll_number = ?";
    db.query(query, [job_id, rollNumber], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      //student already applied
      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for the job",
        });
      }

      //apply for the job
      const query =
        "INSERT INTO Application (job_id, roll_number, overall_status) VALUES (?, ?, ?)";
      db.query(query, [job_id, rollNumber, "Applied"], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "Job applied successfully",
          rollNumber: rollNumber,
          job_id: job_id,
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//Till Here Done Testing✅


//submitCodingTest
module.exports.SubmitCodingTest = async (req, res) => {
  try {
    const { job_id } = req.body;
    const rollNumber = req.student.rollNumber;

    //check if the student has applied for the job
    const [existingApplication] = await db.execute(
      "SELECT * FROM Application WHERE job_id = ? AND roll_number = ?",
      [job_id, rollNumber]
    );

    if (existingApplication.length === 0) {
      return res.status(400).json({
        success: false,
        message: "You have not applied for the job",
      });
    }

    //check if the student has already submitted the coding test
    const [existingCodingTestSubmission] = await db.execute(
      "SELECT * FROM Application WHERE job_id = ? AND roll_number = ? AND coding_test_completed=?",
      [job_id, rollNumber, 1]
    );
    if (existingCodingTestSubmission.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted the coding test",
      });
    }

    //submit the coding test
    const query =
      "INSERT INTO Application (job_id, roll_number, coding_test_completed) VALUES (?, ?, ?)";

    db.query(query, [job_id, rollNumber, 1], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Coding test submitted successfully",
        rollNumber: rollNumber,
        job_id: job_id,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//getProfile
module.exports.GetProfile = async (req, res) => {
  try {
    const rollNumber = req.student.rollNumber;

    const [result] = await db.query(
      `SELECT roll_number, name, email, phone, city, state, branch, semester, year_of_passing, currentCGPA FROM student WHERE roll_number = ?`,
      [rollNumber]
    );

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student: result[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

//getApplication
module.exports.GetApplicationDetails = async (req, res) => {
  try {
    const { roll_number } = req.student;
    const { job_id } = req.params;

    const [result] = await db.query(
      `
        SELECT 
        A.job_id,
        J.title AS job_title,
        J.type AS job_type,
        C.name AS company_name,
        A.resume_status,
        A.coding_test_status,
        A.interview_status,
        A.overall_status,
        A.coding_test_link,
        A.interview_time,
        A.interview_venue,
        FROM application A, job B, company C
        WHERE A.job_id = J.job_id
        AND J.company_id = C.company_id
        AND A.roll_number = ?
        AND A.job_id = ?
      `,
      [roll_number, job_id]
    );

    res.status(200).json({
      success: true,
      application: result[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const sendEmail = require("../libs/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const path = require("path");
const fs = require("fs");
const { query } = require("express-validator");

//Register student
module.exports.Register = async (req, res) => {
  console.log(req.body);

  try {
    const {
      roll_number,
      name,
      password,
      city,
      state,
      email,
      phone,
      branch,
      semester,
      year_of_passing,
      current_cgpa,
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
            err: err.message,
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
          "INSERT INTO student (roll_number, name, password, city, state, email, phone, branch, semester, year_of_passing, current_cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          query,
          [
            roll_number,
            name,
            hashedPassword,
            city,
            state,
            email,
            phone,
            branch,
            semester,
            year_of_passing,
            current_cgpa,
          ],
          (err, result) => {
            if (err) {
              console.error("Error inserting student:", err.message);
              return res.status(500).json({
                success: false,
                message: "Problem making the query",
                error: err.message,
              });
            }

            //generate JWT token
            const token = jwt.sign({ id: roll_number }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });

            //send the token to frontend
            res.cookie("token", token);

            res.status(200).json({
              success: true,
              message: "student registered successfully",
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

//Login student
module.exports.Login = async (req, res) => {
  try {
    const { roll_number, password } = req.body;

    //check if student exists
    db.query(
      "SELECT * FROM student WHERE roll_number = ?",
      [roll_number],
      async (err, result) => {
        if (err) {
          
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        console.log(result);

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
        const token = jwt.sign({ id: roll_number }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        //send the token to frontend
        res.cookie("token", token);

        res.status(200).json({
          success: true,
          message: "student logged in successfully",
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

//Logout student
module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "student logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//Profile student
module.exports.GetProfile = async (req, res) => {
  try {
    const roll_number = req.student.roll_number;
    console.log(roll_number);

    db.query(
      "SELECT * FROM student WHERE roll_number = ?",
      [roll_number],
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
            message: "student not found",
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
    const roll_number = req.student.roll_number;
    const resumePath = req.file.path;
    console.log(resumePath);

    db.query(
      "UPDATE student SET resume = ? WHERE roll_number = ?",
      [resumePath, roll_number],
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


//getjobs
module.exports.GetFullTime = async (req, res) => {
  try {
    const student = req.student;

    const query = `SELECT J.*, C.name FROM job J, company C WHERE J.company_id = C.company_id AND eligibility_year = ? AND eligibility_cgpa <= ? AND type='FullTime'`;

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

    const query = `
    SELECT J.*,
    C.name 
    FROM job J, company C
    WHERE J.company_id = C.company_id AND eligibility_year = ? AND eligibility_cgpa <= ? AND type='Internship'`;

    db.query(
      query,
      [student.year_of_passing, student.current_cgpa, null],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }
        
        console.log(result);

        // Check if the student has applied for any internships
        const query = `SELECT A.job_id FROM application A, job J WHERE A.job_id = J.job_id AND A.roll_number = ? AND J.type='Internship'`;  //to etch the job_id of internships student has applied for
        db.query(query, [student.roll_number], (err, appliedInternships) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: err.message,
            });
          }
          
          let filteredInternships = [];

          for(let r of result){
            let isApplied = false;

            for(let a of appliedInternships){
              if(r.job_id === a.job_id){
                isApplied = true;
                break;
              }
            }

            if(!isApplied){
              filteredInternships.push(r);
            }
          }

          console.log(filteredInternships);

          // Return the list of internships
          return res.status(200).json({
            success: true,
            jobs: filteredInternships
          });
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


//getjobDetails
module.exports.GetJobDetails = async (req, res) => {
  const job_id = req.params.job_id;
  const roll_number = req.student.roll_number;
  console.log(roll_number, job_id);

  try{
    const query = `SELECT J.*, C.* from job J, company C WHERE J.company_id = C.company_id AND job_id = ?`;
    db.query(query, [job_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      //job does not exist
      if(result.length === 0){
        return res.status(404).json({
          success: false,
          message: "job not found",
        });
      }

      //job exists
      return res.status(200).json({
        success: true,
        job: result[0],
      });
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}


//applyjob
module.exports.ApplyJob = async (req, res) => {
  try {
    const { job_id } = req.body;
    console.log(job_id);
    const roll_number = req.student.roll_number;

    //check if the student has already applied for the job
    const query = "SELECT * FROM application WHERE job_id = ? AND roll_number = ?";
    db.query(query, [job_id, roll_number], (err, result) => {
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
        "INSERT INTO application (job_id, roll_number, overall_status) VALUES (?, ?, ?)";
      db.query(query, [job_id, roll_number, "Applied"], (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        res.status(200).json({
          success: true,
          message: "job applied successfully",
          roll_number: roll_number,
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



//submitCodingTest
module.exports.SubmitCodingTest = async (req, res) => {
  try {
    const { job_id, coding_username } = req.body;
    const roll_number = req.student.roll_number;
    
    //studet already had submitted the coding test validation done in frontend
    
    //submit the coding test
    const updateQuery ="UPDATE application SET coding_test_completed = ?, coding_username = ? WHERE job_id = ? AND roll_number = ?";

    db.query(updateQuery, [1, coding_username, job_id, roll_number], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      console.log("Yes");

      res.status(200).json({
        success: true,
        message: "Coding test submitted successfully",
        roll_number: roll_number,
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


//Till Here Done Testing✅


//getProfile
/*
module.exports.GetProfile = async (req, res) => {
  try {
    const roll_number = req.student.roll_number;

    const query = `SELECT roll_number, name, email, phone, city, state, branch, semester, year_of_passing, current_cgpa, resume FROM student WHERE roll_number = ?`;
    db.query(query, [roll_number], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      // Check if the student exists
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "student not found",
        });
      }

      // Return the student profile
      return res.status(200).json({
        success: true,
        student: result[0],
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
*/


//getAppliedInternships
module.exports.GetAppliedInternships = async (req, res) => {
  try{
    const roll_number = req.student.roll_number;
    const query = `
      SELECT A.job_id, J.title, J.type, J.salary, C.name, A.overall_status AS status
      FROM application A
      JOIN job J ON A.job_id = J.job_id
      JOIN company C ON J.company_id = C.company_id
      WHERE A.roll_number = ? AND J.type = 'Internship'
    `;

    db.query(query, [roll_number], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      // Check if the student has applied for any jobs
      // if (result.length === 0) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "No applied internships found",
      //   });
      // }

      // Return the list of applied jobs
      return res.status(200).json({
        success: true,
        jobs: result,
      });
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

//getAppliedFullTimejobs
module.exports.GetAppliedFullTime = async (req, res) => {
  try{
    const roll_number = req.student.roll_number;
    const query = `
      SELECT A.job_id, J.title, J.type, J.salary, C.name, A.overall_status
      FROM application A
      JOIN job J ON A.job_id = J.job_id
      JOIN company C ON J.company_id = C.company_id
      WHERE A.roll_number = ? AND J.type = 'FullTime'
    `;

    db.query(query, [roll_number], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      // Check if the student has applied for any jobs
      // if (result.length === 0) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "No applied full time jobs found",
      //   });
      // }

      // Return the list of applied jobs
      return res.status(200).json({
        success: true,
        jobs: result,
      });
    });
  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}



//getapplication
module.exports.GetApplicationDetails = async (req, res) => {
  try {
    const roll_number = req.student.roll_number;
    const { job_id } = req.params;
    console.log(roll_number, job_id);
    
    const query = `
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
        A.coding_test_completed,
        A.interview_date_time,
        A.interview_venue
        FROM application A, job J, company C
        WHERE A.job_id = J.job_id
        AND J.company_id = C.company_id
        AND A.roll_number = ?
        AND A.job_id = ?
      `;
      
    db.query(query, [roll_number, job_id], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      // Check if the application exists
      // if (result.length === 0) {
      //   return res.status(404).json({
      //     success: false,
      //     message: "application not found",
      //   });
      // }

      // Return the application details
      return res.status(200).json({
        success: true,
        applicationDetails: result[0],
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch application details",
      error: err.message,
    });
  }
};



module.exports.DownloadResume = async (req, res) => {
  try{
    const filename = req.params.resume;
    console.log(filename);
    res.download(`../backend/public/images/upload/${filename}`);
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Failed to download resume",
      error: err.message,
    });
  }
}
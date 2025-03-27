const sendEmail = require("../libs/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

//Register Company
module.exports.Register = async (req, res) => {
  console.log(req.body);

  try {
    const { name, email, phone, password, city, state, website } = req.body;
    console.log(req.body);

    //check if email already exists
    const query = "SELECT * FROM company WHERE email = ?";
    db.query(query, [email], async (err, result) => {
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

        //insert the admin into the database
        const query = "INSERT INTO company (name, email, password, phone, city, state, website) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [name, email, hashedPassword, phone, city, state, website], async (err, result) => {
            if (err) {
              return res.status(500).json({
                success: false,
                error: err.message,
              });
            }
            
            console.log(result.insertId);
            //generate JWT token
            const token = jwt.sign(
              { id: result.insertId },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );

            //send the token to frontend
            res.cookie("token", token);

            res.status(200).json({
              success: true,
              message: "Company registered successfully",
              token,
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


//Login Company
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if student exists
    const query = "SELECT * FROM company WHERE email = ?";
    db.query(query, [email], async (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message,
          });
        }

        //company does not exist
        if (result.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Company not found",
          });
        }

        //company exists
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: "Incorrect password",
          });
        }

        //generate JWT token
        const token = jwt.sign(
          {id: result[0].company_id }, 
          process.env.JWT_SECRET, 
          { expiresIn: "1h"});


        //send the token to frontend
        res.cookie("token", token);

        res.status(200).json({
          success: true,
          message: "Company logged in successfully",
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


//Logout Company
module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Company logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



//Post a job (protected to Company)
module.exports.PostJob = async (req, res) => {
  try {
    const {title, description, eligibility_cgpa, eligibility_year, salary, type, deadline} = req.body;

    //find the company_id from the token
    const company_id = req.company.id;

    // const posted_date = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");
    const posted_date = new Date().toISOString().split("T")[0];
    
    //check if deadline is greater than the posted_date or not
    
    // Input validation
    if (!title || !eligibility_cgpa || !eligibility_year || !type || !posted_date || !deadline || !salary) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    const query = "INSERT INTO job (company_id, title, description, eligibility_cgpa, eligibility_year, type, posted_date, deadline, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(query, [company_id, title, description, eligibility_cgpa, eligibility_year, type, posted_date, deadline, salary], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }

        const job_id = result.insertId;
        console.log(job_id);

        res.status(201).json({
            success: true,
            message: 'FullTime/Internship posted successfully',
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



//GetApplications
module.exports.GetApplications = async(req, res) => {
  try{
    const company = req.company;
    const company_id = company.id;

    //fetch all applications applied to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ?
    `;

    db.query(query, [company_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status.json(200).json({
        success: true,
        applications: result
      })
    });

  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}



//ShortlistResume
module.exports.ShortlistResume = async(req, res) => {
  try{
    const {roll_number, job_id, resume_status} = req.body;
    
    const query = `
    UPDATE Application
    SET resume_status = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    db.query(query, [resume_status, roll_number, job_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Resume status updated successfully"
      });
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}


//Send Coding Test
module.exports.SendCodingTest = async(req, res) => {
  try{
    const {roll_number, job_id, coding_test_link} = req.body;

    // Validate coding_test_link
    if (!coding_test_link) {
      return res.status(400).json({
          success: false,
          message: 'Coding test link is required',
      });
    }

    const query = `
    UPDATE Application
    SET coding_test_link = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    db.query(query, [coding_test_link, roll_number, job_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        message: "Coding test link sent successfully"
      })
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}


module.exports.GetApplicationsPhase2 = async(req, res) => {
  try{
    const company = req.company;
    const company_id = company.id;

    //fetch all applications whose resume has been accepted to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ? AND A.resume_status = 'Accepted'
    `;

    db.query(query, [company_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status.json(200).json({
        success: true,
        applications: result
      })
    });

  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

//Evaluate Coding Test
module.exports.EvaluateCodingTest = async(req, res) => {
  try{
    const {roll_number, job_id, coding_test_status} = req.body;
    
    const query = `
    UPDATE Application
    SET coding_test_status = ?
    WHERE roll_number = ? AND job_id = ?
    `; //coding_test_status = enum('accepted', 'rejected')

    db.query(query, [coding_test_status, roll_number, job_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status(200).json({
        success: true,
        message: "Coding test status updated successfully"
      });
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}



//GetApplicationsPhase3
module.exports.GetApplicationsPhase3 = async(req, res) => {
  try{
    const company = req.company;
    const company_id = company.id;

    //fetch all applications whose coding test has been accepted to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ? AND A.coding_test_status = 'accepted'
    `;

    db.query(query, [company_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status.json(200).json({
        success: true,
        applications: result
      })
    });

  }catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}


//Schedule Interview
module.exports.ScheduleInterview = async(req, res) => {
  try{
    const { roll_number, job_id, interview_time, interview_venue } = req.body;

    if (!interview_time || !interview_venue) {
      return res.status(400).json({
          success: false,
          message: 'Interview time and venue are required',
      });
    }

    const query = `
    UPDATE Application
    SET interview_time = ?, interview_venue = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    db.query(query, [interview_time, interview_venue, roll_number, job_id], (err, result) => {
      if (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
      }

      res.staus(200).json({
        success: true,
        message: "Interview scheduled successfully"
      })
    });
  }catch(err){
    return res.staus(500).json({
      success: false,
      error: err.message
    })
  }
}


//Evaluate Interview
module.exports.EvaluateInterview = async(req, res) => {
  try{
    const { roll_number, job_id, interview_status } = req.body;

    const query = `
    UPDATE Application
    SET interview_status = ?, overall_status = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    db.query(query, [interview_status, interview_status, roll_number, job_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        message: "Interview evaluated successfully"
      })
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
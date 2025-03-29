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


//Get Company Profile
module.exports.Profile = async (req, res) => {
  try {
    const company_id = req.company.company_id;
    console.log(company_id);

    const query = "SELECT * FROM company WHERE company_id = ?";
    db.query(query, [company_id], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      //remove password from the result
      const { password, ...company } = result[0];
      console.log(company);
      res.status(200).json({
        success: true,
        company,
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};



//Post a job (protected to Company)
module.exports.PostJob = async (req, res) => {
  try {
    const {title, description, eligibility_cgpa, eligibility_year, salary, type, deadline} = req.body;

    //find the company_id from the token
    const company_id = req.company.company_id;
    console.log(company_id);

    // const posted_date = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");
    const posted_date = new Date().toISOString().split("T")[0];
    
    //check if deadline is greater than the posted_date or not
    
    // Input validation
    if (!company_id || !title || !eligibility_cgpa || !eligibility_year || !type || !posted_date || !deadline || !salary) {
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
    const company_id = req.company.company_id;
    console.log(req.company);

    //fetch all applications applied to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume, S.year_of_passing, S.current_cgpa
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

      return res.status(200).json({
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


//left to do -> if the resumeStatus === false then, make overall_status -> false too
//ShortlistResume
module.exports.ShortlistResume = async(req, res) => {
  try{
    const {roll_number, job_id, resume_status} = req.body;  //resume status tu company r uporot jodi accept button click taar uport -> ('accepted', 'rejected') 
    
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


//after shortlisting resumes, company will send coding test link to the students yo

//Send Coding Test
module.exports.SendCodingTest = async(req, res) => {
  try{
    const {title, year_of_passing, coding_test_link} = req.body;
    const company_id = req.company.company_id;

    // Validate input
    if (!title || !year_of_passing || !coding_test_link) {
      return res.status(400).json({
        success: false,
        message: "Title, year of passing, and coding test link are required",
      });
    }

    const query = `
    UPDATE Application A, Job J, Student S
    SET A.coding_test_link = ?
    WHERE A.roll_number = S.roll_number AND A.job_id = J.job_id
    AND J.title = ? AND S.year_of_passing = ? AND A.resume_status = ? AND J.company_id = ?
    `;

    db.query(query, [coding_test_link, title, year_of_passing, 'accepted', company_id], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        coding_test_link,
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


//getApplicationsPhase2 <-> jaar jaar resume shortlist hol and they HAD SUBMITTED THE CODING TEST( to be done yoooo ( student tu kori korim yooo ) ) eheti fetch hobo
module.exports.GetApplicationsPhase2 = async(req, res) => {
  try{
    const company_id = req.company.company_id;

    //fetch all applications whose resume has been accepted to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume, S.year_of_passing, S.current_cgpa
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ? AND A.resume_status = ?
    `;

    db.query(query, [company_id, 'accepted'], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      console.log(result);

      return res.status(200).json({
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

//left to do -> if the coding_test_status === false then, make overall_status -> false too
//Evaluate Coding Test
module.exports.EvaluateCodingTest = async(req, res) => {
  try{
    const {roll_number, job_id, coding_test_status} = req.body;   //coding test status tu company r uporot, -> jodi accept button click taar uport -> ('accepted', 'rejected') 
    
    // iyat company_id r hisape update aplication nelage 
    // cuz, update from frontend koribo and frontend t moi pothaisu only those applications who belongs to that company so, the company will only be visible with hihotor applications

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


//GetApplicationsPhase3 <-> jaar jaar coding test accept hol eheti fetch hobo
module.exports.GetApplicationsPhase3 = async(req, res) => {
  try{
    const company_id = req.company.company_id;

    //fetch all applications whose coding test has been accepted to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ? AND A.coding_test_status = ?
    `;

    db.query(query, [company_id, 'accepted'], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status(200).json({
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
    const { roll_number, job_id, interview_date_time, interview_venue } = req.body;

    //interview_date_time: "2021-08-10 10:00:00"

    if (!interview_date_time || !interview_venue) {
      return res.status(400).json({
          success: false,
          message: 'Interview time and venue are required',
      });
    }

    //same iyatu since frontend t only company r applications show koribo so, company_id di query update koribo nelage
    const query = `
    UPDATE Application
    SET interview_date_time = ?, interview_venue = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    db.query(query, [interview_date_time, interview_venue, roll_number, job_id], (err, result) => {
      if (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Interview scheduled successfully"
      })
    });
  }catch(err){
    return res.status(500).json({
      success: false,
      error: err.message
    })
  }
}


//GetApplicationsPhase3 <-> jaar jaar coding test accept hol eheti fetch hobo and mark time finally ki interview clear koril ne nai based on the interview
module.exports.GetApplicationsPhase3 = async(req, res) => {
  try{
    const company_id = req.company.company_id;

    //fetch all applications whose coding test has been accepted to this company
    const query = `
    SELECT A.roll_number, A.job_id,
    J.title, J.description, 
    S.name, S.email, S.resume
    FROM application A, job J, student S
    WHERE A.job_id = J.job_id AND A.roll_number = S.roll_number AND J.company_id = ? AND A.coding_test_status = ?
    `;

    db.query(query, [company_id, 'accepted'], (err, result) => {
      if(err){
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.status(200).json({
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


//Evaluate Interview
module.exports.EvaluateInterview = async(req, res) => {
  try{
    const { roll_number, job_id, interview_status } = req.body;

    const query = `
    UPDATE Application
    SET interview_status = ?, overall_status = ?
    WHERE roll_number = ? AND job_id = ?
    `;

    let overall_status = 'rejected';
    if(interview_status === 'accepted'){
      overall_status = 'accepted';
    }

    db.query(query, [interview_status, overall_status, roll_number, job_id], (err, result) => {
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

// done till here✅😎 yo
// bass olop corner cases and like sending the data olop bhalke and majot eta part where only coding test dile heitu he data set pothabo ase and not 
// coding test accept ne reject hol
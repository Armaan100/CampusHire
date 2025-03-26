const jwt = require('jsonwebtoken');
const db = require('../db/db');

//student auth
module.exports.authStudent = async(req, res, next) => {
    try{
        //extract token from cookies or authorization header
        console.log("Auth Student...");
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        console.log(req.headers.authorization.split(' ')[1]);

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No Token Provided"
            });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const rollNumber = decoded.id;  //id <-> rollNumber
        console.log(rollNumber)

        //fetch student from db using rollNumber
        const query = "SELECT * FROM Student WHERE roll_number = ?";
        db.query(query, [rollNumber], (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            console.log(result[0]);

            if(result.length === 0){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid Student"
                })
            }

            //attach student to req object
            req.student = result[0];
            next();
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



//company auth
module.exports.authCompany = async(req, res, next) => {
    try{
        //extract token from cookies or authorization header
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No Token Provided"
            });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company_id = decoded.id;  

        //fetch company from db using companny_id
        const query = "SELECT * FROM company WHERE company_id = ?";
        db.query(query, [company_id], (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    error: err.message
                })
            }

            console.log(result[0]);

            if(result.length === 0){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid Company"
                })
            }

            //attach student to req object
            req.company = result[0];
            next();
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}



//admin auth
module.exports.authAdmin = async(req, res, next) => {
    try{
        //extract token from cookies or authorization header
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No Token Provided"
            });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin_id = decoded.id;  

         //fetch company from db using companny_id
         const query = "SELECT * FROM admin WHERE admin_id = ?";
         db.query(query, [admin_id], (err, result) => {
             if(err){
                 return res.status(500).json({
                     success: false,
                     error: err.message
                 })
             }
 
             console.log(result[0]);
 
             if(result.length === 0){
                 return res.status(401).json({
                     success: false,
                     message: "Unauthorized: Invalid Admin"
                 })
             }
 
             //attach student to req object
             req.admin = result[0];
             next();
         })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}





const jwt = require('jsonwebtoken');
const {db} = require('../db/db');

//student auth
module.exports.authStudent = async(req, res, next) => {
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
        const id = decoded.id;  //id <-> rollNumber

        //fetch student from db using id(rollNumber)
        const [student] = await db.execute("SELECT * FROM student WHERE roll_number = ?", [id]);

        if (student.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid student'
            });
        }

        //attach student to req object
        req.student = student[0];
        next();
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
        const id = decoded.id;  

        //fetch student from db using id(rollNumber)
        const [company] = await db.execute("SELECT * FROM company WHERE id = ?", [id]);

        if (company.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid company'
            });
        }

        //attach student to req object
        req.company = company[0];
        next();
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
        const id = decoded.id;  

        //fetch student from db using id(rollNumber)
        const [admin] = await db.execute("SELECT * FROM admin WHERE id = ?", [id]);

        if (admin.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid admin'
            });
        }

        //attach student to req object
        req.admin = admin[0];
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}





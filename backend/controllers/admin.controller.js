const sendEmail = require("../libs/nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {db} = require("../db/db");

//Register Admin
module.exports.Register = async(req, res) => {
    console.log(req.body);

    try{
        const {email, name, password} = req.body;

        //check if email already exists
        db.query("SELECT * FROM admin WHERE email = ?", [email], async(err, result) => {
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

            //insert the admin into the database
            const insertQuery = "INSERT INTO admin (name, email, password) VALUES (?, ?, ?, ?)";
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if(err){
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }


                //generate JWT token
                const token = jwt.sign(
                    {id: result[0].id},
                    process.env.JWT_SECRET, 
                    {expiresIn: "1h"}
                );
                
                //send the token to frontend
                res.cookie("token", token);

                res.status(200).json({
                    success: true,
                    message: "Admin registered successfully",
                    token
                });
            });
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}




//Login Admin
module.exports.Login = async(req, res) => {
    console.log(req.body);

    try{
        const {email, password} = req.body;

        //fetch admin from the database using email
        const [admin] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);

        //admin does not exist
        if(admin.length === 0){
            return res.status(400).json({
                success: false,
                message: "Admin not found"
            });
        }


        //admin exists

        //compare the password
        const validPassword = await bcrypt.compare(password, admin[0].password);

        if(!validPassword){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        //generate JWT token
        const token = jwt.sign(
            {id: admin[0].id},
            process.env.JWT_SECRET, 
            {expiresIn: "1h"}
        );

        //send the token to frontend
        res.cookie("token", token);

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            token
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
}


//Logout Admin
module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie("token"); 

        return res.status(200).json({
            success: true,
            message: "Admin logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
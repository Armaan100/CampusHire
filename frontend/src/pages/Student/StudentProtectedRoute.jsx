import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const StudentProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            navigate("/student-login");
            return;
        }

        const verifyStudent = async () => {
            try{
                const response = await axios.get("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/student/get-profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if(response.status !== 200){
                    throw new Error("Unauthorized");
                }
            }catch(err){
                console.log("Error: ", err);
                localStorage.removeItem("token");
                navigate("/student-login");
            }finally{
                setIsLoading(false);
            }
        }

        verifyStudent();
    }, [navigate]);

    if(isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Verifying Student Access...</p>
            </div>
        );
    }


    return(
        <div>
            {children}
        </div>
    )
}

export default StudentProtectedRoute;
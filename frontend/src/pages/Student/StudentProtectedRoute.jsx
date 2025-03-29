import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const StudentProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            navigate("/login");
            return;
        }

        const verifyStudent = async () => {
            try{
                const response = await axios.get("http://localhost:5000/student/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if(response.status === 200){
                    throw new Error("Unauthorized");
                }
            }catch(err){
                console.log("Error: ", err);
                localStorage.removeItem("token");
                navigate("/login");
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
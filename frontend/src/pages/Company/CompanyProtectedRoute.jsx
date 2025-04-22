import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CompanyProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
            navigate("/company-login");
            return;
        }

        const verifyCompany = async () => {
            try{
                const response = await axios.get("https://campus-hire-kx9vewvzf-armaan-gogois-projects.vercel.app/company/get-profile", {
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
                navigate("/company-login");
            }finally{
                setIsLoading(false);
            }
        }

        verifyCompany();
    }, [navigate]);

    if(isLoading){
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Verifying Company Access...</p>
            </div>
        );
    }


    return(
        <div>
            {children}
        </div>
    )
}

export default CompanyProtectedRoute;
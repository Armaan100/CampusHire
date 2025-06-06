import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roll_number: "",
    name: "",
    password: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    branch: "",
    semester: "",
    year_of_passing: "",
    current_cgpa: "",
  });

  const [errMessage, setErrMessage] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!/^\d{10}$/.test(formData.phone)) {
      return "Invalid phone number format (10 digits required)";
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      return "Invalid email address format";
    }
    if (!/^\d{9}$/.test(formData.roll_number)) {
      return "Invalid roll number format (9 digits required)";
    }
    if (!/^\d{4}$/.test(formData.year_of_passing)) {
      return "Invalid year of passing format (4 digits required)";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage("");
    // setSuccessMessage("");
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setErrMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request...");
      const response = await axios.post(
        "https://campus-hire-backend-457618.an.r.appspot.com/student/register",
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/student");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "An error occurred. Please try again.";
      setErrMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - decorative */}
            <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-purple-600 p-8 flex flex-col justify-center">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Campus Hire
                </h2>
                <p className="text-white/90 mt-4">
                  Join our platform to connect with top companies and kickstart
                  your career.
                </p>
                <div className="mt-8">
                  <Link
                    to="/student-login"
                    className="text-yellow-300 hover:text-yellow-200 font-medium"
                  >
                    Already have an account? Login here
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side - form */}
            <div className="md:w-2/3 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Account
                </h1>
                <p className="mt-2 text-gray-600">
                  Please fill in your details for registration
                </p>
              </div>

              {errMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                  {errMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="roll_number"
                      placeholder="Roll Number"
                      value={formData.roll_number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Select Branch</option>
                      <option value="COPC">COPC</option>
                      <option value="COE">COE</option>
                      <option value="COBS">COBS</option>
                      <option value="ENC">ENC</option>
                    </select>
                  </div>

                  <div>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                      <option value="">Select Semester</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      name="year_of_passing"
                      placeholder="Year of Passing"
                      value={formData.year_of_passing}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      name="current_cgpa"
                      placeholder="Current CGPA"
                      value={formData.current_cgpa}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;

import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Resetpassword = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uid = queryParams.get("uid");
  const token = queryParams.get("token");
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains("dark")
  );
  useEffect(() => {
    if (!uid && !token) {
      navigate('/auth/sign-in');
    }
  }, [uid, token])
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.body.classList.contains("dark");
      setIsDarkMode(dark);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect(); // Cleanup
  }, []);

  // Validatsiya funksiyasi
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(validatePassword(e.target.value));
    setApiMessage("");
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    // Avval inputni validatsiya qilamiz
    const validationError = validatePassword(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!uid && !token) {
      navigate('/auth/sign-in');
    }
    setError("");
    setIsSubmitting(true);
    setApiMessage("");

    try {
      const response = await fetch(
        `${apiUrl}auth/reset-password/?uid=${uid}&token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_password: inputValue }),
          redirect: "follow",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Agar status code 2xx bo'lmasa
        setApiMessage(result.message || "Something went wrong");
      } else {
        setApiMessage("Password reset successfully!");
        // Bu yerda hohlagan yo'nalishga o'tish mumkin masalan:
        getToken()
      }
    } catch (error) {
      setApiMessage("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  async function getToken(params) {
    if (localStorage.getItem("reset-email")) {
      try {
        const response = await fetch(`${apiUrl}auth/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              "email": localStorage.getItem("reset-email"),
              "password": inputValue
            }
          ),
          redirect: "follow"
        })

        const result = await response.json()
        if (response.ok) {
          localStorage.removeItem("reset-email")
          localStorage.setItem("access_token", result.access);
          localStorage.setItem("refresh_token", result.refresh);
          navigate("/admin/default")
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  return (
    <div
      className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } min-h-screen flex items-center justify-center px-4 transition-colors duration-300`}
    >
      <div
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } w-full max-w-md shadow-xl rounded-xl p-8 transition-colors duration-300`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        <form className="space-y-5" onSubmit={resetPassword} noValidate>
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={inputValue}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none transition ${isDarkMode
                ? "bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-400"
                : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm mt-1">
              {error}
            </p>
          )}

          {/* API message */}
          {apiMessage && (
            <p className={`text-sm mt-1 ${apiMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
              {apiMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!!error || isSubmitting}
            className={`w-full font-semibold py-3 rounded-lg transition ${!!error || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isSubmitting ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;

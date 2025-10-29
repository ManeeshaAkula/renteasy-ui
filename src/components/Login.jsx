import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { login, setAuthToken, getRoleIdByCode } from "../services/api";
import { useRole } from "../context/RoleContext";
import AuthLayout from "./AuthLayout";

function Login({ onSuccessfulAuth }) {
    const [showPassword, setShowPassword] = useState(false);
    const { setRole, setUserId } = useRole();
    const [formData, setFormData] = useState({ username: "", password: "", role: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (!formData.role) newErrors.role = "Please select a user type";
        return newErrors;
    };

    const handleVerifyLogin = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        try {
            console.log(".........formData in login", formData)
            const roleData = await getRoleIdByCode(formData.role.toUpperCase());
            console.log("............ roledata in login", roleData)
            formData.role = roleData.data.id;
            console.log("......... after formData in login", formData)

            const response = await login(formData);
            console.log("......... responsein login", response)
            if (response?.token || response?.jwt) {
                setAuthToken(response.token || response.jwt);
                const r =
                    (response.role_code && response.role_code.toUpperCase()) ||
                    (response.user?.role_name && response.user.role_name.toUpperCase()) ||
                    "LENDER";
                setRole(r);
                setUserId(response.user?.id || "");
                if (onSuccessfulAuth) onSuccessfulAuth(response);
                navigate("/dashboard");
            } else {
                setErrors((prev) => ({
                    ...prev,
                    loginError: response?.message || "Authentication failed. Please try again.",
                }));
            }
        } catch (error) {
            console.log("........ error in login", error);
            console.error("Error in login", error);
            setErrors((prev) => ({
                ...prev,
                loginError: "Invalid credentials. Please verify your username and password.",
            }));
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleVerifyLogin}>
                <div className="login-page-form-group">
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.username ? "input-error" : ""}`}
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Email or mobile number"
                            autoComplete="username"
                        />
                        {errors.username && <span className="error-symbol">❗</span>}
                        {errors.username && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.username}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.password ? "input-error" : ""}`}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {errors.password && <span className="error-symbol">❗</span>}
                        {errors.password && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.password}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-wrapper">
                        <select
                            className={`input-field ${errors.role ? "input-error" : ""}`}
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Select user type
                            </option>
                            <option value="lender">Lender</option>
                            <option value="buyer">Buyer</option>
                        </select>
                        {errors.role && <span className="error-symbol">❗</span>}
                        {errors.role && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.role}
                            </div>
                        )}
                    </div>
                </div>


                {errors.loginError && (
                    <div className="error-tooltip-inline">{errors.loginError}</div>
                )}

                <button
                    type="submit"
                    className="login-form-submit"
                    onClick={handleVerifyLogin}
                >
                    Login
                </button>

                <p className="form-row-links">
                    Don’t have an account?{''}
                    <span className="signup-link">
                        <Link to="/register">Sign Up Here</Link>
                    </span>

                </p>
                {/* <div className="form-row-links" style={{ justifyContent: "flex-end" }}>
                    <span className="forgot-password">
                        <Link to="/register">Create account</Link>
                    </span>
                </div> */}
            </form>
        </AuthLayout>
    );
}

export default Login;

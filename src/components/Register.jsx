import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { register as registerApi, setAuthToken } from "../services/api";

export default function Register() {
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!formData.fullName.trim()) e.fullName = "Full name is required";
        if (!formData.username.trim()) e.username = "Email or mobile is required";
        if (!formData.password.trim()) e.password = "Password is required";
        if (!formData.confirmPassword.trim()) e.confirmPassword = "Confirm your password";
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
        if (!formData.agree) e.agree = "Please accept the terms";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length > 0) return;
        try {
            const payload = { name: formData.fullName, username: formData.username, password: formData.password };
            const res = await registerApi(payload);
            if (res?.token || res?.jwt) {
                setAuthToken(res.token || res.jwt);
                // navigate("/dashboard");
            } else {
                setErrors((p) => ({ ...p, submit: res?.message || "Registration failed" }));
            }
        } catch (err) {
            setErrors((p) => ({ ...p, submit: "Unable to register right now" }));
        }
    };

    return (
        <AuthLayout visualHeading="Create your account">
            <form onSubmit={handleSubmit}>
                <div className="login-page-form-group">
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.fullName ? "input-error" : ""}`}
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full name"
                            autoComplete="name"
                        />
                        {errors.fullName && <span className="error-symbol">❗</span>}
                        {errors.fullName && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.fullName}
                            </div>
                        )}
                    </div>
                </div>

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
                            type={showPwd ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowPwd((s) => !s)}
                            tabIndex={-1}
                            aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                            {showPwd ? <FaEye /> : <FaEyeSlash />}
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
                        <input
                            className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
                            type={showConfirm ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="password-toggle-icon"
                            onClick={() => setShowConfirm((s) => !s)}
                            tabIndex={-1}
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                            {showConfirm ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {errors.confirmPassword && <span className="error-symbol">❗</span>}
                        {errors.confirmPassword && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                        id="agree"
                        name="agree"
                        type="checkbox"
                        checked={formData.agree}
                        onChange={handleChange}
                    />
                    <label htmlFor="agree">I agree to the Terms</label>
                </div>
                {errors.agree && (
                    <div className="error-tooltip-inline">{errors.agree}</div>
                )}

                {errors.submit && (
                    <div className="error-tooltip-inline">{errors.submit}</div>
                )}

                <button type="submit" className="login-form-submit">Create Account</button>

                <p className="form-row-links">
                    Already have an account?{''}
                    <span className="signup-link">
                        <Link to="/login">Login</Link>
                    </span>

                </p>
            </form>
        </AuthLayout>
    );
}

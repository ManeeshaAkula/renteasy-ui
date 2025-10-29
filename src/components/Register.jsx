import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { register as registerApi, setAuthToken, getRoleIdByCode } from "../services/api";

export default function Register() {
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email_id: "",
        mobile: "",
        city: "",
        state: "",
        zip: "",
        role: "",
        roleId: "",
        gender: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });
    const [roleLoading, setRoleLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        const next = { ...formData, [name]: type === "checkbox" ? checked : value };
        setFormData(next);
        setErrors((prev) => ({ ...prev, [name]: "" }));

        if (name === "role") {
            setRoleLoading(true);
            setErrors((prev) => ({ ...prev, role: "", roleLookup: "" }));
            try {
                if (!value) {
                    setFormData((p) => ({ ...p, roleId: "" }));
                } else {
                    console.log("............value", value)
                    const roleData = await getRoleIdByCode(value.toUpperCase());
                    console.log("........ roleid", roleData)
                    //   if (id) {
                    setFormData((p) => ({ ...p, roleId: roleData.data.id }));
                    //   } else {
                    //     setFormData((p) => ({ ...p, roleId: "" }));
                    //     setErrors((prev) => ({ ...prev, roleLookup: "Unable to find role. Try again." }));
                    //   }
                }
                console.log("......... formdata", formData)
            } catch {
                setFormData((p) => ({ ...p, roleId: "" }));
                setErrors((prev) => ({ ...prev, roleLookup: "Unable to find role. Try again." }));
            } finally {
                setRoleLoading(false);
            }
        }
    };

    const validate = () => {
        const e = {};
        if (!formData.first_name.trim()) e.first_name = "First name is required";
        if (!formData.email_id.trim()) e.email_id = "Email is required";
        if (!formData.mobile.trim()) e.mobile = "Mobile number is required";
        if (!formData.city.trim()) e.city = "City is required";
        if (!formData.state.trim()) e.state = "State is required";
        if (!formData.zip.trim()) e.zip = "ZIP code is required";
        if (!formData.role.trim()) e.role = "Role is required";
        if (formData.role && !formData.roleId) e.roleLookup = "Selected role is invalid";
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
            const payload = {
                first_name: formData.first_name,
                middle_name: formData.middle_name || "",
                last_name: formData.last_name || "",
                password: formData.password,
                gender: formData.gender || "",
                role_id: formData.roleId.data.id,
                mobile: formData.mobile,
                email_id: formData.email_id,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
            };
            console.log("......... payload in register", payload)
            const res = await registerApi(payload);
            if (res?.data || res?.data?.data || res?.data?.data?.id) {
                // setUserId(res.data.data.id);
                navigate('/login');
            } else {
                setErrors((p) => ({ ...p, submit: res?.message || "Registration failed" }));
            }
        } catch {
            setErrors((p) => ({ ...p, submit: "Unable to register right now" }));
        }
    };

    const label = (text, required) => (
        <label className="input-label">
            {text} {required && <span aria-hidden="true" style={{ color: "red" }}>*</span>}
        </label>
    );

    return (
        <AuthLayout visualHeading="Create your account">
            <form onSubmit={handleSubmit}>
                <div className="login-page-form-group">
                    {label("First name", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.first_name ? "input-error" : ""}`}
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First name"
                            autoComplete="given-name"
                        />
                        {errors.first_name && <span className="error-symbol">❗</span>}
                        {errors.first_name && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.first_name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Middle name", false)}
                    <div className="input-wrapper">
                        <input
                            className="input-field"
                            type="text"
                            id="middle_name"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            placeholder="Middle name (optional)"
                            autoComplete="additional-name"
                        />
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Last name", false)}
                    <div className="input-wrapper">
                        <input
                            className="input-field"
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last name (optional)"
                            autoComplete="family-name"
                        />
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Email", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.email_id ? "input-error" : ""}`}
                            type="email"
                            id="email_id"
                            name="email_id"
                            value={formData.email_id}
                            onChange={handleChange}
                            placeholder="Email"
                            autoComplete="email"
                        />
                        {errors.email_id && <span className="error-symbol">❗</span>}
                        {errors.email_id && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.email_id}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Mobile", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.mobile ? "input-error" : ""}`}
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile number"
                            autoComplete="tel"
                        />
                        {errors.mobile && <span className="error-symbol">❗</span>}
                        {errors.mobile && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.mobile}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("City", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.city ? "input-error" : ""}`}
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            autoComplete="address-level2"
                        />
                        {errors.city && <span className="error-symbol">❗</span>}
                        {errors.city && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.city}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("State", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.state ? "input-error" : ""}`}
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            autoComplete="address-level1"
                        />
                        {errors.state && <span className="error-symbol">❗</span>}
                        {errors.state && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.state}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("ZIP", true)}
                    <div className="input-wrapper">
                        <input
                            className={`input-field ${errors.zip ? "input-error" : ""}`}
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            placeholder="ZIP code"
                            autoComplete="postal-code"
                        />
                        {errors.zip && <span className="error-symbol">❗</span>}
                        {errors.zip && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.zip}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Role", true)}
                    <div className="input-wrapper">
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`input-field ${errors.role || errors.roleLookup ? "input-error" : ""}`}
                            disabled={roleLoading}
                        >
                            <option value="" disabled>Select role</option>
                            <option value="Lender">Lender</option>
                            <option value="Buyer">Buyer</option>
                        </select>
                        {(errors.role || errors.roleLookup) && <span className="error-symbol">❗</span>}
                        {(errors.role || errors.roleLookup) && (
                            <div className="error-tooltip">
                                <div className="tooltip-arrow" />
                                {errors.role || errors.roleLookup}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-page-form-group">
                    {label("Gender", false)}
                    <div className="input-wrapper">
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Select gender (optional)</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    {label("Password", true)}
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
                    {label("Confirm password", true)}
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
                {errors.agree && <div className="error-tooltip-inline">{errors.agree}</div>}
                {errors.submit && <div className="error-tooltip-inline">{errors.submit}</div>}

                <button type="submit" className="login-form-submit" disabled={roleLoading}>Create Account</button>

                <p className="form-row-links">
                    Already have an account?{" "}
                    <span className="signup-link">
                        <Link to="/login">Login</Link>
                    </span>
                </p>
            </form>
        </AuthLayout>
    );
}

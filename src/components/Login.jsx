import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { login, setAuthToken, getRoleIdByCode } from "../services/api";
import { useRole } from "../context/RoleContext";
import AuthLayout from "./AuthLayout";

function Login({ onSuccessfulAuth }) {
  const [showPassword, setShowPassword] = useState(false);
  const { setRole, setUserId, setUserName } = useRole();
  const [formData, setFormData] = useState({ username: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "", loginError: "" }));
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
      const roleRes = await getRoleIdByCode(String(formData.role).toUpperCase());
      // console.log("....... roleRes in login", roleRes)
      const roleId = roleRes?.data?.id ?? roleRes?.data?.data?.id;
      // console.log(".......... roleId in login", roleId)
      if (!roleId) {
        setErrors((p) => ({ ...p, loginError: "Unable to identify role. Please try again." }));
        return;
      }

      const payload = {
        username: formData.username.trim(),
        password: formData.password,
        role_id: roleId
      };
      // console.log(".......... payload in login", payload)
      const response = await login(payload);
      // console.log("........ response after login api", response)
      const token = response?.token ?? response?.jwt ?? response?.data?.token ?? response?.data?.data?.token;

      if (!token) {
        setErrors((p) => ({
          ...p,
          loginError: response?.message || "Authentication failed. Please try again."
        }));
        return;
      }

      localStorage.setItem("authToken", token);
      setAuthToken(token);

      const user = response?.user || response?.data?.user || {};
      const id = user?.id ?? response?.user_id ?? response?.data?.user_id ?? "";
      if (id) {
        setUserId(String(id));
        localStorage.setItem("userId", String(id));
      }
      console.log("....... user in login", user)
      const first_name = user?.first_name || "";
      const last_name = user?.last_name || "";
      const initials = ((user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")).toUpperCase() || "U";
      // const fullName = [first_name, last_name].filter(Boolean).join(" ");
      setUserName(initials);
      // localStorage.setItem("userName", JSON.stringify(initials));
      const roleCode =
        (roleRes?.data?.code && String(roleRes?.data?.code).toUpperCase()) ||
        String(formData.role).toUpperCase();
      console.log("...... rolecode in login", roleCode)
      setRole(roleCode);
      localStorage.setItem("role", roleCode);

      if (onSuccessfulAuth) onSuccessfulAuth(response);

      navigate("/dashboard", {
        state: {
          userName: initials,
          role: roleCode,
          userId: id
        }
      }
      );
    } catch (error) {
      setErrors((p) => ({
        ...p,
        loginError: "Invalid credentials. Please verify your username and password."
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
              onClick={() => setShowPassword((p) => !p)}
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

        {errors.loginError && <div className="error-tooltip-inline">{errors.loginError}</div>}

        <button type="submit" className="login-form-submit">
          Login
        </button>

        <p className="form-row-links">
          Don’t have an account?{" "}
          <span className="signup-link">
            <Link to="/register">Sign Up Here</Link>
          </span>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;

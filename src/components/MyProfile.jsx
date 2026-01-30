import React, { useEffect, useMemo, useState } from "react";
import "../styles/MyProfile.css";
import { getUserById, updateUserById } from "../services/api";

export default function MyProfile() {
    const userId = useMemo(() => localStorage.getItem("userId"));
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        mobile: "",
        email_id: "",
        city: "",
        state: "",
        zip: "",
    });

    // console.log("......... userId in my profile", userId);

    const GENDER_OPTIONS = [
        { id: "", name: "Select gender" },
        { id: "MALE", name: "Male" },
        { id: "FEMALE", name: "Female" },
        { id: "OTHER", name: "Other" },
        { id: "PREFER_NOT_TO_SAY", name: "Prefer not to say" },
    ];

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState({});
    const [banner, setBanner] = useState({ type: "", text: "" });

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const res = await getUserById(userId);
                const data = res?.data || {};
                if (!active) return;
                setProfile(data);
                setForm({
                    first_name: data.first_name || "",
                    middle_name: data.middle_name || "",
                    last_name: data.last_name || "",
                    gender: data.gender || "",
                    mobile: data.mobile || "",
                    email_id: data.email_id || "",
                    city: data.city || "",
                    state: data.state || "",
                    zip: data.zip || "",
                });
            } catch (e) {
                if (!active) return;
                setBanner({ type: "error", text: "Failed to load profile." });
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [userId]);

    const onChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const e = {};
        if (!form.first_name.trim()) e.first_name = "First name is required";
        if (!form.mobile.trim()) e.mobile = "Mobile is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email_id.trim())) e.email_id = "Valid email is required";
        if (!form.city.trim()) e.city = "City is required";
        if (!form.state.trim()) e.state = "State is required";
        if (!form.zip.trim()) e.zip = "ZIP is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSave = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            setBanner({ type: "", text: "" });
            const res = await updateUserById(userId, form);
            const saved = res?.data || {};
            setProfile(saved);
            setForm({
                first_name: saved.first_name || "",
                middle_name: saved.middle_name || "",
                last_name: saved.last_name || "",
                gender: saved.gender || "",
                mobile: saved.mobile || "",
                email_id: saved.email_id || "",
                city: saved.city || "",
                state: saved.state || "",
                zip: saved.zip || "",
            });
            setEditing(false);
            setBanner({ type: "success", text: "Profile updated successfully." });
            setTimeout(() => setBanner({ type: "", text: "" }), 2500);
        } catch (e) {
            setBanner({ type: "error", text: "Update failed. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const onCancel = () => {
        if (profile) {
            setForm({
                first_name: profile.first_name || "",
                middle_name: profile.middle_name || "",
                last_name: profile.last_name || "",
                gender: profile.gender || "",
                mobile: profile.mobile || "",
                email_id: profile.email_id || "",
                city: profile.city || "",
                state: profile.state || "",
                zip: profile.zip || "",
            });
        }
        setErrors({});
        setEditing(false);
    };
    // localStorage.removeItem("userName");
    const initials = ((form.first_name?.[0] || "") + (form.last_name?.[0] || "")).toUpperCase() || "U";
    // {form.first_name} {form.middle_name ? `${form.middle_name} ` : ""}{form.last_name}
    const userName = ((form.first_name) + " " + (form.last_name));
    // console.log("..........userName in my profile", userName)
    localStorage.setItem("userName", userName);
    if (loading) {
        return <div className="mp-wrap"><div className="mp-loading">Loading profile…</div></div>;
    }

    return (
        <div className="mp-wrap">
            <div className="mp-head">
                <h1 className="mp-title">My Profile</h1>
                <div className="mp-actions">
                    {!editing ? (
                        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
                    ) : (
                        <>
                            <button className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
                            <button className="btn primary" onClick={onSave} disabled={saving}>
                                {saving ? "Saving…" : "Save"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {banner.text ? (
                <div className={`mp-banner ${banner.type === "error" ? "error" : "success"}`}>
                    {banner.text}
                </div>
            ) : null}

            <div className="mp-card">
                <div className="mp-identity">
                    <div className="mp-avatar">{initials}</div>
                    <div className="mp-id-meta">
                        <div className="mp-name">
                            {form.first_name} {form.middle_name ? `${form.middle_name} ` : ""}{form.last_name}
                        </div>
                        {/* <div className="mp-sub">{profile?.id ? `User ID: ${profile.id}` : ""}</div> */}
                    </div>
                </div>

                <div className="mp-form">
                    <div className="mp-grid">
                        <Field
                            label="First Name"
                            value={form.first_name}
                            onChange={v => onChange("first_name", v)}
                            error={errors.first_name}
                            editing={editing}
                        />
                        <Field
                            label="Middle Name"
                            value={form.middle_name}
                            onChange={v => onChange("middle_name", v)}
                            editing={editing}
                        />
                        <Field
                            label="Last Name"
                            value={form.last_name}
                            onChange={v => onChange("last_name", v)}
                            editing={editing}
                        />
                        <SelectField
                            label="Gender"
                            value={form.gender}
                            onChange={v => onChange("gender", v)}
                            options={GENDER_OPTIONS}
                            editing={editing}
                        />

                        <Field
                            label="Mobile"
                            value={form.mobile}
                            onChange={v => onChange("mobile", v)}
                            error={errors.mobile}
                            editing={editing}
                        />
                        <Field
                            label="Email"
                            value={form.email_id}
                            onChange={v => onChange("email_id", v)}
                            error={errors.email_id}
                            type="email"
                            editing={editing}
                        />

                        <Field
                            label="City"
                            value={form.city}
                            onChange={v => onChange("city", v)}
                            error={errors.city}
                            editing={editing}
                        />
                        <Field
                            label="State"
                            value={form.state}
                            onChange={v => onChange("state", v)}
                            error={errors.state}
                            editing={editing}
                        />
                        <Field
                            label="ZIP"
                            value={form.zip}
                            onChange={v => onChange("zip", v)}
                            error={errors.zip}
                            editing={editing}
                        />
                    </div>
                </div>

                {editing && (
                    <div className="mp-sticky-actions">
                        <button className="btn ghost" onClick={onCancel} disabled={saving}>Discard</button>
                        <button className="btn primary" onClick={onSave} disabled={saving}>
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ label, value, onChange, error, type = "text", editing }) {
    return (
        <div className={`mp-field${error ? " has-error" : ""}`}>
            <label className="mp-label">{label}</label>
            {editing ? (
                <input
                    className="mp-input"
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <div className="mp-read">{value || "—"}</div>
            )}
            {error ? <div className="mp-err">{error}</div> : null}
        </div>
    );
}

function SelectField({ label, value, onChange, options, editing }) {
    const display = options.find(o => o.id === value)?.name || "";
    return (
        <div className="mp-field">
            <label className="mp-label">{label}</label>
            {editing ? (
                <select className="mp-input" value={value} onChange={(e) => onChange(e.target.value)}>
                    {options.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            ) : (
                <div className="mp-read">{display || "—"}</div>
            )}
        </div>
    );
}

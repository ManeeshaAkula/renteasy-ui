import React, { useEffect, useMemo, useState } from "react";
import "../styles/RenterProfile.css";

const GENDER_OPTIONS = ["MALE","FEMALE","OTHER","PREFER_NOT_TO_SAY"];

export default function RenterProfile() {
  const userId = useMemo(()=> localStorage.getItem("userId") || "U-1001", []);
  const [form, setForm] = useState({
    first_name: "", middle_name:"", last_name:"", gender:"",
    mobile:"", email_id:"", city:"", state:"", zip:""
  });
  const [original, setOriginal] = useState(form);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let active = true;
    (async ()=>{
      try{
        setLoading(true);
        // TODO: replace with API
        const res = {
          data:{
            id:userId, first_name:"Alex", middle_name:"", last_name:"Khan",
            gender:"MALE", mobile:"+1 555-555-0100", email_id:"alex@example.com",
            city:"San Jose", state:"CA", zip:"95134"
          }
        };
        if(!active) return;
        setForm({...res.data});
        setOriginal({...res.data});
      }catch{
        if(!active) return;
        setErr("Failed to load profile");
      }finally{
        if(active) setLoading(false);
      }
    })();
    return ()=>{ active=false; }
  }, [userId]);

  const onChange = (k, v) => setForm(p=>({...p, [k]:v}));

  const validate = () => {
    if(!form.first_name.trim()) return "First name is required";
    if(!form.mobile.trim()) return "Mobile is required";
    if(!/^\S+@\S+\.\S+$/.test(form.email_id.trim())) return "Valid email is required";
    if(!form.city.trim()) return "City is required";
    if(!form.state.trim()) return "State is required";
    if(!form.zip.trim()) return "ZIP is required";
    return "";
  };

  const onSave = async () => {
    const v = validate();
    if(v){ setErr(v); return; }
    try{
      setSaving(true); setErr("");
      // await updateProfile(userId, form);
      setOriginal(form);
      setEditing(false);
    }catch{
      setErr("Update failed");
    }finally{
      setSaving(false);
    }
  };

  const onCancel = () => { setForm(original); setEditing(false); setErr(""); };

  if(loading) return <div className="rp-wrap">Loading…</div>;

  const initials = ((form.first_name?.[0]||"") + (form.last_name?.[0]||"")).toUpperCase() || "U";

  return (
    <div className="rprof-wrap">
      <div className="rprof-head">
        <h1 className="rprof-title">My Profile</h1>
        {!editing ? (
          <button className="btn" onClick={()=>setEditing(true)}>Edit</button>
        ) : (
          <div className="rprof-actions">
            <button className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
            <button className="btn primary" onClick={onSave} disabled={saving}>{saving?"Saving…":"Save"}</button>
          </div>
        )}
      </div>

      {err ? <div className="rprof-alert">{err}</div> : null}

      <div className="rprof-card">
        <div className="rprof-id">
          <div className="avatar">{initials}</div>
          <div className="meta">
            <div className="name">{form.first_name} {form.middle_name} {form.last_name}</div>
            <div className="sub">User ID: {userId}</div>
          </div>
        </div>

        <div className="rprof-grid">
          <Field label="First Name" value={form.first_name} onChange={v=>onChange("first_name", v)} editing={editing} required />
          <Field label="Middle Name" value={form.middle_name} onChange={v=>onChange("middle_name", v)} editing={editing} />
          <Field label="Last Name" value={form.last_name} onChange={v=>onChange("last_name", v)} editing={editing} />
          <Select label="Gender" value={form.gender} options={GENDER_OPTIONS} onChange={v=>onChange("gender", v)} editing={editing} />
          <Field label="Mobile" value={form.mobile} onChange={v=>onChange("mobile", v)} editing={editing} required />
          <Field label="Email"  value={form.email_id} onChange={v=>onChange("email_id", v)} editing={editing} type="email" required />
          <Field label="City"   value={form.city} onChange={v=>onChange("city", v)} editing={editing} required />
          <Field label="State"  value={form.state} onChange={v=>onChange("state", v)} editing={editing} required />
          <Field label="ZIP"    value={form.zip} onChange={v=>onChange("zip", v)} editing={editing} required />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, editing, type="text", required }) {
  return (
    <div className="rf-field">
      <label className="rf-label">{label}{required ? " *" : ""}</label>
      {editing
        ? <input className="rf-input" type={type} value={value||""} onChange={e=>onChange(e.target.value)} />
        : <div className="rf-read">{value || "—"}</div>}
    </div>
  );
}

function Select({ label, value, options, onChange, editing }) {
  return (
    <div className="rf-field">
      <label className="rf-label">{label}</label>
      {editing
        ? (
          <select className="rf-input" value={value||""} onChange={e=>onChange(e.target.value)}>
            <option value=""></option>
            {options.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
          </select>
        )
        : <div className="rf-read">{value || "—"}</div>
      }
    </div>
  );
}

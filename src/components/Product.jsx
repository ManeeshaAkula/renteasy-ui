// src/components/Product.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Product.css";
import { FiEdit2 } from "react-icons/fi";
import { createProduct } from "../services/api";

function Field({ name, label, type = "text", className, value, onChange, error, isEditing }) {
  return (
    <div className={`field ${className || ""}`}>
      <label>{label}</label>
      {isEditing ? (
        type === "textarea" ? (
          <textarea value={value ?? ""} onChange={(e) => onChange(name, e.target.value)} rows={4} />
        ) : (
          <input type={type} value={value ?? ""} onChange={(e) => onChange(name, e.target.value)} />
        )
      ) : (
        <div className="read-value">{value || "—"}</div>
      )}
      {error ? <span className="err">{error}</span> : null}
    </div>
  );
}

export default function Product({ sellerId: sellerIdProp = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditRoute = useMemo(() => Boolean(id), [id]);

  const navProduct = location.state?.product || null;
  const navMode = location.state?.mode || null;
  const effectiveSellerId = useMemo(() => sellerIdProp || "1234" || "", [sellerIdProp]);

  const [form, setForm] = useState({
    id: "",
    seller_id: "",
    title: "",
    description: "",
    image_url: "",
    category_id: "",
    price_per_day: "",
    quantity: "",
    deposit: "",
    location_city: "",
    location_state: "",
    location_zip: ""
  });

  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(!isEditRoute || navMode === "edit");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [skipFetch, setSkipFetch] = useState(Boolean(navProduct));

  useEffect(() => {
    let cancel = false;

    const setFromData = (data) => {
      const next = {
        id: data.id || "",
        seller_id: data.seller_id || effectiveSellerId,
        title: data.title || "",
        description: data.description || "",
        image_url: data.image_url || "",
        category_id: data.category_id || "",
        price_per_day: data.price_per_day?.toString?.() || "",
        quantity: data.quantity?.toString?.() || "",
        deposit: data.deposit?.toString?.() || "",
        location_city: data.location_city || "",
        location_state: data.location_state || "",
        location_zip: data.location_zip || ""
      };
      setForm(next);
      setOriginal(next);
      setImgPreview(next.image_url || "");
    };

    (async () => {
      if (!isEditRoute) {
        setForm((p) => ({ ...p, seller_id: effectiveSellerId }));
        return;
      }

      if (navProduct) {
        setFromData(navProduct);
        setIsEditing(navMode === "edit");
        setSkipFetch(true);
        return;
      }

      if (!skipFetch) {
        try {
          setLoading(true);
          const res = await axios.get(`/api/products/${id}`);
          if (cancel) return;
          const data = res?.data?.data || res?.data || {};
          setFromData(data);
        } catch (e) {
          setApiError(e?.response?.status === 404 ? "Product not found (404)." : "Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => { cancel = true; };
  }, [isEditRoute, id, navProduct, navMode, effectiveSellerId, skipFetch]);

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const err = {};
    if (!effectiveSellerId) err.seller_id = "Missing seller";
    if (!form.title.trim()) err.title = "Required";
    if (!form.category_id.trim()) err.category_id = "Required";
    if (!form.location_city.trim()) err.location_city = "Required";
    if (!form.location_state.trim()) err.location_state = "Required";
    if (!form.location_zip.trim()) err.location_zip = "Required";
    if (!form.price_per_day || Number.isNaN(Number(form.price_per_day))) err.price_per_day = "Required";
    if (!form.quantity || Number.isNaN(Number(form.quantity))) err.quantity = "Required";
    if (!form.deposit || Number.isNaN(Number(form.deposit))) err.deposit = "Required";
    if (!imgFile && !form.image_url.trim()) err.image_url = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const buildPayload = () => ({
    seller_id: effectiveSellerId,
    title: form.title.trim(),
    description: form.description?.trim() || "",
    category_id: form.category_id.trim(),
    price_per_day: Number(form.price_per_day),
    quantity: Number(form.quantity),
    deposit: Number(form.deposit),
    location_city: form.location_city.trim(),
    location_state: form.location_state.trim(),
    location_zip: form.location_zip.trim()
  });

  const handleSave = async () => {
    if (!validate()) return;
    setApiError("");
    setSaving(true);
    try {
      if (imgFile) {
        const fd = new FormData();
        Object.entries(buildPayload()).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", imgFile);

        if (isEditRoute) {
          await axios.put(`/api/products/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        } else {
          await createProduct(fd);
        }
      } else {
        const payload = { ...buildPayload(), image_url: form.image_url.trim() };
        if (isEditRoute) {
          await axios.put(`/api/products/${id}`, payload);
        } else {
          await axios.post(`/api/products`, payload);
        }
      }
      navigate("/products");
    } catch {
      setApiError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEditRoute && original) {
      setForm(original);
      setImgPreview(original.image_url || "");
      setImgFile(null);
      setErrors({});
      setIsEditing(false);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="product-wrap product-scroll">
      <div className="product-head">
        <h1 className="product-title">
          {isEditRoute ? (isEditing ? "Edit Product" : "Product Details") : "Add Product"}
        </h1>
        <div className="product-actions">
          {!isEditing && isEditRoute && (
            <button className="btn" onClick={() => setIsEditing(true)} title="Edit">
              <FiEdit2 />
            </button>
          )}
          <button className="btn ghost" onClick={handleCancel} disabled={saving || loading}>
            {isEditRoute && !isEditing ? "Close" : "Cancel"}
          </button>
          <button className="btn primary" onClick={handleSave} disabled={saving || loading || !isEditing}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {apiError ? <div className="form-alert">{apiError}</div> : null}

      <div className="product-form">
        <div className="form-grid">
          <div className="field">
            <label>Seller ID</label>
            <div className="read-value">{effectiveSellerId || "—"}</div>
            {errors.seller_id ? <span className="err">{errors.seller_id}</span> : null}
          </div>

          <Field name="title" label="Title" value={form.title} onChange={onChange} error={errors.title} isEditing={isEditing} />
          <Field name="description" label="Description" type="textarea" className="span-2" value={form.description} onChange={onChange} error={errors.description} isEditing={isEditing} />
          <Field name="category_id" label="Category ID" value={form.category_id} onChange={onChange} error={errors.category_id} isEditing={isEditing} />
          <Field name="price_per_day" label="Price/Day" type="number" value={form.price_per_day} onChange={onChange} error={errors.price_per_day} isEditing={isEditing} />
          <Field name="quantity" label="Quantity" type="number" value={form.quantity} onChange={onChange} error={errors.quantity} isEditing={isEditing} />
          <Field name="deposit" label="Deposit" type="number" value={form.deposit} onChange={onChange} error={errors.deposit} isEditing={isEditing} />
          <Field name="location_city" label="City" value={form.location_city} onChange={onChange} error={errors.location_city} isEditing={isEditing} />
          <Field name="location_state" label="State" value={form.location_state} onChange={onChange} error={errors.location_state} isEditing={isEditing} />
          <Field name="location_zip" label="ZIP" value={form.location_zip} onChange={onChange} error={errors.location_zip} isEditing={isEditing} />
        </div>

        <div className="image-section">
          <div className="field">
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={onImageFile} disabled={!isEditing} />
          </div>
          <div className="image-preview">
            {imgPreview ? <img src={imgPreview} alt="preview" /> : <div className="image-empty">No image</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

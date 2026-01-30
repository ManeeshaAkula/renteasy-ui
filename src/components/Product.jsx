// src/components/Product.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/Product.css";
import { FiEdit2 } from "react-icons/fi";
import { createProduct, getCategoryByCode } from "../services/api";

function Field({ name, label, type = "text", className, value, onChange, error, isEditing }) {
  return (
    <div className={`field ${className || ""}`}>
      <label>{label}</label>
      {isEditing ? (
        type === "textarea" ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
            rows={4}
          />
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        )
      ) : (
        <div className="read-value">{value || "—"}</div>
      )}
      {error ? <span className="err">{error}</span> : null}
    </div>
  );
}

function CategoryField({ value, onChange, error, isEditing, options }) {
  const selectedLabel = useMemo(() => {
    const hit = options.find((o) => o.id === value);
    return hit ? hit.label : "";
  }, [options, value]);

  return (
    <div className="field">
      <label>Category (Code)</label>
      {isEditing ? (
        <select
          value={value || ""}
          onChange={(e) => onChange("category_id", e.target.value)}
        >
          <option value="">Select category</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="read-value">{selectedLabel || "—"}</div>
      )}
      {error ? <span className="err">{error}</span> : null}
    </div>
  );
}

export default function Product({ userId: userIdProp = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditRoute = useMemo(() => Boolean(id), [id]);
// console.log(".............userIdProp", userIdProp)
  const navProduct = location.state?.product || null;
  const navMode = location.state?.mode || null;
  const effectiveuserId = useMemo(
    () => userIdProp || "1234" || "",
    [userIdProp]
  );
  const user_name = localStorage.getItem("userName");

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
    location_zip: "",
  });

  const [original, setOriginal] = useState(null);
  const [isEditing, setIsEditing] = useState(!isEditRoute || navMode === "edit");

  // image state
  const [imgFile, setImgFile] = useState(null); // actual File
  const [imgPreview, setImgPreview] = useState(""); // blob URL for preview

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [skipFetch, setSkipFetch] = useState(Boolean(navProduct));

  // reference data (categories)
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");

  // fetch categories from reference-data (PRODUCTS)
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setCatLoading(true);
        setCatError("");

        const res = await getCategoryByCode("PRODUCTS");

        if (cancel) return;

        // handle both {data:[...]} and raw [...]
        const rows = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        const mapped = rows.map((r) => ({
          id: r.id,
          label: r.code || r.label || "Unnamed",
        }));

        setCategories(mapped);
      } catch (err) {
        setCatError("Failed to load categories");
        setCategories([]);
      } finally {
        setCatLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, []);

  // fetch existing product if editing (or hydrate from nav state)
  useEffect(() => {
    let cancel = false;

    const setFromData = (data) => {
      const next = {
        id: data.id || "",
        seller_id: data.seller_id || effectiveuserId,
        title: data.title || "",
        description: data.description || "",
        image_url: data.image_url || "",
        category_id: data.category_id || "",
        price_per_day: data.price_per_day?.toString?.() || "",
        quantity: data.quantity?.toString?.() || "",
        deposit: data.deposit?.toString?.() || "",
        location_city: data.location_city || "",
        location_state: data.location_state || "",
        location_zip: data.location_zip || "",
      };
      setForm(next);
      setOriginal(next);
      setImgPreview(next.image_url || "");
      // very important: if we're editing an existing product with an already stored image_url,
      // we do NOT set imgFile here. imgFile stays null until user selects a new file.
    };

    (async () => {
      if (!isEditRoute) {
        // creating new product
        setForm((p) => ({ ...p, seller_id: effectiveuserId }));
        return;
      }

      if (navProduct) {
        // came via navigate(..., { state: { product, mode } })
        setFromData(navProduct);
        setIsEditing(navMode === "edit");
        setSkipFetch(true);
        return;
      }

      if (!skipFetch) {
        try {
          setLoading(true);
          const res = await fetch(`/api/products/${id}`);
          const parsed = await res.json();

          if (cancel) return;

          const data = parsed?.data || parsed || {};
          setFromData(data);
        } catch (e) {
          setApiError("Failed to load product");
        } finally {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancel = true;
    };
  }, [isEditRoute, id, navProduct, navMode, effectiveuserId, skipFetch]);

  // handle text inputs
  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // handle image input
  const onImageFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file.name, file.type, file.size);

    setImgFile(file);
    setImgPreview(URL.createObjectURL(file)); // show preview in UI
  };

  // validation
  const validate = () => {
    const err = {};
    if (!effectiveuserId) err.seller_id = "Missing seller";
    if (!form.title.trim()) err.title = "Required";
    if (!form.category_id.trim()) err.category_id = "Required";
    if (!form.location_city.trim()) err.location_city = "Required";
    if (!form.location_state.trim()) err.location_state = "Required";
    if (!form.location_zip.trim()) err.location_zip = "Required";
    if (!form.price_per_day || Number.isNaN(Number(form.price_per_day)))
      err.price_per_day = "Required";
    if (!form.quantity || Number.isNaN(Number(form.quantity)))
      err.quantity = "Required";
    if (!form.deposit || Number.isNaN(Number(form.deposit)))
      err.deposit = "Required";

    // rule: must have either new imgFile OR an existing image_url
    if (!imgFile && !form.image_url.trim()) err.image_url = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // payload builder for non-FormData case
  const buildPayload = () => ({
    seller_id: effectiveuserId,
    user_name: localStorage.getItem("userName"),
    title: form.title.trim(),
    description: form.description?.trim() || "",
    category_id: form.category_id.trim(),
    price_per_day: form.price_per_day,
    quantity: form.quantity,
    deposit: form.deposit,
    location_city: form.location_city.trim(),
    location_state: form.location_state.trim(),
    location_zip: form.location_zip.trim(),
  });

  // save handler
  const handleSave = async () => {
    if (!validate()) return;
    setApiError("");
    setSaving(true);

    try {
      let response;

      // if we have an uploaded file, send multipart/FormData
      if (imgFile) {
        const fd = new FormData();
        fd.append("seller_id", effectiveuserId);
        fd.append("title", form.title.trim());
        fd.append("description", form.description?.trim() || "");
        fd.append("category_id", form.category_id.trim());
        fd.append("price_per_day", form.price_per_day);
        fd.append("quantity", form.quantity);
        fd.append("deposit", form.deposit);
        fd.append("location_city", form.location_city.trim());
        fd.append("location_state", form.location_state.trim());
        fd.append("location_zip", form.location_zip.trim());
        fd.append("image", imgFile); // IMPORTANT: real File object

        console.log("FormData Preview before submit:");
        for (const [k, v] of fd.entries()) {
          console.log(k, v);
        }

        // createProduct will detect FormData and send as multipart
         response = await createProduct(fd);
        console.log("........... response in if", response)
      } else {
        // no new file -> send JSON body with existing image_url
        const payload = {
          ...buildPayload(),
          image_url: form.image_url.trim(), // keep existing URL if present
        };

        response = await createProduct(payload);
                console.log("........... response", response)

      }

      console.log("Create product response:", response);

      navigate("/products");
    } catch (err) {
      console.error("Error while saving:", err);
      setApiError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEditRoute && original) {
      // revert changes if editing
      setForm(original);
      setImgPreview(original.image_url || "");
      setImgFile(null);
      setErrors({});
      setIsEditing(false);
    } else {
      // on create, just go back
      navigate("/products");
    }
  };

  return (
    <div className="product-wrap product-scroll">
      <div className="product-head">
        <h1 className="product-title">
          {isEditRoute
            ? isEditing
              ? "Edit Product"
              : "Product Details"
            : "Add Product"}
        </h1>
        <div className="product-actions">
          {!isEditing && isEditRoute && (
            <button
              className="btn"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <FiEdit2 />
            </button>
          )}
          <button
            className="btn ghost"
            onClick={handleCancel}
            disabled={saving || loading}
          >
            {isEditRoute && !isEditing ? "Close" : "Cancel"}
          </button>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={saving || loading || !isEditing}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {apiError ? <div className="form-alert">{apiError}</div> : null}
      {catError ? <div className="form-alert">{catError}</div> : null}

      <div className="product-form">
        <div className="form-grid">
          <div className="field">
            <label>Seller</label>
            <div className="read-value">{user_name || "—"}</div>
            {errors.seller_id ? (
              <span className="err">{errors.seller_id}</span>
            ) : null}
          </div>

          <Field
            name="title"
            label="Title"
            value={form.title}
            onChange={onChange}
            error={errors.title}
            isEditing={isEditing}
          />

          <Field
            name="description"
            label="Description"
            type="textarea"
            className="span-2"
            value={form.description}
            onChange={onChange}
            error={errors.description}
            isEditing={isEditing}
          />

          <CategoryField
            value={form.category_id}
            onChange={onChange}
            error={errors.category_id}
            isEditing={isEditing}
            options={categories}
          />

          <Field
            name="price_per_day"
            label="Price/Day"
            type="number"
            value={form.price_per_day}
            onChange={onChange}
            error={errors.price_per_day}
            isEditing={isEditing}
          />

          <Field
            name="quantity"
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={onChange}
            error={errors.quantity}
            isEditing={isEditing}
          />

          <Field
            name="deposit"
            label="Deposit"
            type="number"
            value={form.deposit}
            onChange={onChange}
            error={errors.deposit}
            isEditing={isEditing}
          />

          <Field
            name="location_city"
            label="City"
            value={form.location_city}
            onChange={onChange}
            error={errors.location_city}
            isEditing={isEditing}
          />

          <Field
            name="location_state"
            label="State"
            value={form.location_state}
            onChange={onChange}
            error={errors.location_state}
            isEditing={isEditing}
          />

          <Field
            name="location_zip"
            label="ZIP"
            value={form.location_zip}
            onChange={onChange}
            error={errors.location_zip}
            isEditing={isEditing}
          />
        </div>

        <div className="image-section">
          <div className="field">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageFile}
              disabled={!isEditing}
            />
            {errors.image_url ? (
              <span className="err">{errors.image_url}</span>
            ) : null}
          </div>

          <div className="image-preview">
            {imgPreview ? (
              <img src={imgPreview} alt="preview" />
            ) : (
              <div className="image-empty">No image</div>
            )}
          </div>
        </div>
      </div>

      {catLoading ? <div className="field note">Loading categories…</div> : null}
    </div>
  );
}

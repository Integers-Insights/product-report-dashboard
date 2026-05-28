import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const base_url = import.meta.env.VITE_BASE_URL || "";

const FIELD_META = {
  product_name: {
    label: "Product Name",
    required: true,
    placeholder: "e.g. Organic Turmeric Powder",
  },
  description: {
    label: "Description",
    required: true,
    placeholder: "2–3 sentence product description",
    multiline: true,
  },
  category: {
    label: "Category",
    required: true,
    placeholder: "e.g. Nutraceutical",
  },
};

const ProductEditModal = ({ product, onClose, onSaved }) => {
  const missingFields = (product?.missing_fields || []).map((f) =>
    typeof f === "string" ? f : f.field,
  );

  const [form, setForm] = useState(() => {
    const init = {};
    Object.keys(FIELD_META).forEach((key) => {
      init[key] = product?.[key] ?? "";
    });
    return init;
  });

  const [saving, setSaving] = useState(false);

  const isMissing = (field) => missingFields.includes(field);
  const requiredMissing = Object.entries(FIELD_META)
    .filter(([k, m]) => m.required && (!form[k] || form[k] === ""))
    .map(([k]) => k);

  const handleSave = async () => {
    if (requiredMissing.length > 0) {
      toast.error(`Fill required fields: ${requiredMissing.join(", ")}`);
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      const updates = {};
      Object.keys(FIELD_META).forEach((key) => {
        if (form[key] !== "") updates[key] = form[key];
      });

      const res = await fetch(
        `${base_url}/products/update?product_id=${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      toast.success("Product updated");
      onSaved({ ...product, ...data.product_data });
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6]">
          <div>
            <h2 className="text-base font-semibold text-[#000000]">
              {product?.product_name || "Edit Product"}
            </h2>
            <p className="text-xs text-[#5F6368] mt-0.5">
              Fill in missing fields to improve intelligence accuracy
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-black cursor-pointer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {Object.entries(FIELD_META)
            .slice(0, 3)
            .map(([field, meta]) => {
              const missing = isMissing(field);
              const inputClass = `w-full rounded-lg border px-3 py-2 text-sm text-[#001413] outline-none
              ${missing ? "border-[#D48C15] bg-[#FFFBF2]" : "border-[#E6E6E6]"}
              focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]`;
              return (
                <div key={field}>
                  <label className="block text-xs font-medium text-[#001413] mb-1">
                    {meta.label}
                    {meta.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                    {missing && !meta.required && (
                      <span className="ml-2 text-[#D48C15] font-light">
                        (missing)
                      </span>
                    )}
                  </label>
                  {meta.multiline ? (
                    <textarea
                      rows={3}
                      value={form[field]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field]: e.target.value }))
                      }
                      placeholder={meta.placeholder}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field]}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, [field]: e.target.value }))
                      }
                      placeholder={meta.placeholder}
                      className={inputClass}
                    />
                  )}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E6E6E6]">
          <p className="text-xs text-[#5F6368]">
            {requiredMissing.length > 0
              ? `${requiredMissing.length} required field(s) still missing`
              : "✓ All required fields filled"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E6E6E6] text-sm text-[#5F6368] hover:bg-[#F5F5F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-sm font-medium hover:bg-[#0274AE] disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;

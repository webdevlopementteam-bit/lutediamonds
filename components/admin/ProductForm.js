// components/admin/ProductForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MultiImageUploader from "./MultiImageUploader";
import RichTextEditor from "./RichTextEditor";
import { readApiError } from "@/lib/apiError";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none transition-all placeholder:text-[#A5A5A5] focus:border-[#BF9A3A] focus:ring-2 focus:ring-[#BF9A3A]/20";

const labelClass =
  "mb-1.5 block text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#6B6B6B]";

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      {title && (
        <div className="mb-5">
          <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#8A8A8A]">
            {title}
          </h2>
          {description && <p className="mt-1.5 text-[13.5px] text-[#8A8A8A]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function FieldError({ children }) {
  if (!children) return null;
  return (
    <p data-field-error className="mt-1.5 flex items-start gap-1 text-[12.5px] font-medium text-red-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-[2px] h-3.5 w-3.5 shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5M12 16h.01" />
      </svg>
      {children}
    </p>
  );
}

function TextField({ label, value, onChange, type = "text", required, placeholder, hint, prefix, error }) {
  const ring = error
    ? "border-red-400 focus:border-red-500 focus-within:border-red-500 focus:ring-red-500/20 focus-within:ring-red-500/20"
    : "border-black/10 focus:border-[#BF9A3A] focus-within:border-[#BF9A3A] focus:ring-[#BF9A3A]/20 focus-within:ring-[#BF9A3A]/20";

  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#BF9A3A]">*</span>}
      </label>

      {prefix ? (
        <div className={`flex items-stretch overflow-hidden rounded-lg border transition-all focus-within:ring-2 ${ring}`}>
          <span className="flex shrink-0 items-center border-r border-black/10 bg-black/[0.03] px-3 text-[13.5px] text-[#8A8A8A]">
            {prefix}
          </span>
          <input
            type={type}
            required={required}
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-w-0 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none placeholder:text-[#A5A5A5]"
          />
        </div>
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none transition-all placeholder:text-[#A5A5A5] focus:ring-2 ${ring}`}
        />
      )}

      <FieldError>{error}</FieldError>
      {!error && hint && <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">{hint}</p>}
    </div>
  );
}

export default function ProductForm({ categories, initialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);

  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    price: initialProduct?.price ?? "",
    compareAtPrice: initialProduct?.compareAtPrice ?? "",
    category: initialProduct?.category?._id || initialProduct?.category || "",
    description: initialProduct?.description || "",
    images: initialProduct?.images || [],
    imagesAlt: initialProduct?.imagesAlt || "",
    stock: initialProduct?.stock ?? 10,
    collectionTag: initialProduct?.collectionTag || "",
    featured: initialProduct?.featured || false,
    metaTitle: initialProduct?.metaTitle || "",
    metaDescription: initialProduct?.metaDescription || "",
    keywords: initialProduct?.keywords?.join(", ") || "",
    specs: {
      centerStone: initialProduct?.specs?.centerStone || "",
      accentStones: initialProduct?.specs?.accentStones || "",
      metal: initialProduct?.specs?.metal || "",
      totalCarats: initialProduct?.specs?.totalCarats || "",
      totalWeight: initialProduct?.specs?.totalWeight || "",
      size: initialProduct?.specs?.size || "",
      certificate: initialProduct?.specs?.certificate || "",
    },
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /* edit karte hi us field ka error hata do */
  function clearFieldError(key) {
    setFieldErrors((fe) => {
      if (!fe[key]) return fe;
      const next = { ...fe };
      delete next[key];
      return next;
    });
  }

  function update(key, value) {
    clearFieldError(key);
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateSpec(key, value) {
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));
  }
  function updateName(value) {
    clearFieldError("name");
    if (!slugTouched) clearFieldError("slug");
    setForm((f) => ({ ...f, name: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  /* pehle error tak scroll karo */
  function scrollToFirstError() {
    setTimeout(() => {
      const el = document.querySelector("[data-field-error]");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  /* server pe bhejne se pehle hi obvious cheezein pakad lo */
  function validate() {
    const fe = {};
    if (!form.name.trim()) fe.name = "Name is required.";
    if (!form.slug.trim()) fe.slug = "Slug is required.";
    if (form.price === "" || Number.isNaN(Number(form.price))) fe.price = "Enter a valid price.";
    else if (Number(form.price) < 0) fe.price = "Price cannot be negative.";
    if (form.compareAtPrice !== "" && Number(form.compareAtPrice) <= Number(form.price))
      fe.compareAtPrice = "Must be higher than the price.";
    if (form.stock !== "" && Number(form.stock) < 0) fe.stock = "Stock cannot be negative.";
    if (!form.category) fe.category = "Pick a category.";
    if (!form.images.length) fe.images = "Add at least one image.";
    return fe;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const localErrors = validate();
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      setError("Please fix the highlighted fields below.");
      scrollToFirstError();
      return;
    }

    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        stock: Number(form.stock),
        keywords: form.keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const url = isEdit ? `/api/products/${initialProduct._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // HTML error page aane pe bhi ye nahi tootega
        const { error: message, fieldErrors: serverFields } = await readApiError(res);
        setFieldErrors(serverFields);
        setError(message);
        if (Object.keys(serverFields).length) scrollToFirstError();
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Could not reach the server. Check your connection and try again."
          : err.message || "Could not save product."
      );
    } finally {
      setSaving(false);
    }
  }

  const metaLen = form.metaDescription.length;
  const price = Number(form.price) || 0;
  const compare = Number(form.compareAtPrice) || 0;
  const discount = compare > price && price > 0 ? Math.round(((compare - price) / compare) * 100) : 0;
  const keywordChips = form.keywords
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const SaveButton = ({ className = "" }) => (
    <button
      type="submit"
      disabled={saving}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#141414] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#BF9A3A] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {saving && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
    </button>
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* ---------- header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-medium leading-tight tracking-[-0.01em] text-[#141414] sm:text-[28px]">
            {isEdit ? "Edit Product" : "New Product"}
          </h1>
          <p className="mt-1.5 text-[14.5px] text-[#6B6B6B]">
            {isEdit ? "Update this piece and save your changes." : "Add a new piece to the store."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && form.slug && (
            <Link
              href={`/product/${form.slug}`}
              target="_blank"
              className="rounded-lg border border-black/10 px-4 py-2.5 text-[14px] font-medium text-[#5A5A5A] transition-colors hover:border-[#BF9A3A] hover:text-[#BF9A3A]"
            >
              Preview
            </Link>
          )}
          <Link
            href="/admin/products"
            className="text-[14px] font-medium text-[#6B6B6B] transition-colors hover:text-[#BF9A3A]"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px] xl:items-start">
        {/* main column */}
        <div className="min-w-0 space-y-6">
          <Card title="Basics">
            <div className="space-y-5">
              <TextField
                label="Name"
                value={form.name}
                onChange={updateName}
                placeholder="Oval Tanzanite Halo Pendant"
                error={fieldErrors.name}
                required
              />

              <div>
                <label className={labelClass}>
                  Slug <span className="ml-1 text-[#BF9A3A]">*</span>
                </label>
                <div className={`flex items-stretch overflow-hidden rounded-lg border transition-all focus-within:ring-2 ${
                  fieldErrors.slug
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20"
                    : "border-black/10 focus-within:border-[#BF9A3A] focus-within:ring-[#BF9A3A]/20"
                }`}>
                  <span className="hidden shrink-0 items-center border-r border-black/10 bg-black/[0.03] px-3 text-[13px] text-[#8A8A8A] sm:flex">
                    /product/
                  </span>
                  <input
                    required
                    value={form.slug}
                    placeholder="oval-tanzanite-halo-pendant"
                    onChange={(e) => {
                      setSlugTouched(true);
                      update("slug", slugify(e.target.value));
                    }}
                    aria-invalid={Boolean(fieldErrors.slug)}
                    className="w-full min-w-0 bg-white px-3.5 py-2.5 text-[14.5px] text-[#141414] outline-none placeholder:text-[#A5A5A5]"
                  />
                </div>
                <FieldError>{fieldErrors.slug}</FieldError>
                {!fieldErrors.slug && (
                  <p className="mt-1.5 text-[12.5px] text-[#9A9A9A]">
                    {isEdit
                      ? "Careful — changing this breaks existing links."
                      : "Name se apne aap ban raha hai."}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Pricing & stock">
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                label="Price"
                type="number"
                prefix="R"
                value={form.price}
                onChange={(v) => update("price", v)}
                placeholder="0.00"
                error={fieldErrors.price}
                required
              />
              <TextField
                label="Compare-at"
                type="number"
                prefix="R"
                value={form.compareAtPrice}
                onChange={(v) => update("compareAtPrice", v)}
                placeholder="Optional"
                error={fieldErrors.compareAtPrice}
                hint={discount > 0 ? `${discount}% off` : "Original price"}
              />
              <TextField
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(v) => update("stock", v)}
                error={fieldErrors.stock}
              />
            </div>

            {compare > 0 && compare <= price && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-700">
                Compare-at price should be higher than the price, otherwise no discount will show.
              </p>
            )}
          </Card>

          <Card title="Images" description="Pehli image product card aur listings me dikhegi.">
            <MultiImageUploader values={form.images} onChange={(v) => update("images", v)} />
            <FieldError>{fieldErrors.images}</FieldError>
            <div className="mt-4">
              <TextField
                label="Image Alt Text (SEO)"
                value={form.imagesAlt}
                onChange={(v) => update("imagesAlt", v)}
                placeholder="e.g. Oval tanzanite halo pendant in 18k white gold"
                hint="Applied to all images of this product — describes it for search engines and screen readers."
              />
            </div>
          </Card>

          <Card title="Description">
            <RichTextEditor
              value={form.description}
              onChange={(html) => update("description", html)}
              placeholder="Describe this piece..."
            />
          </Card>

          <Card title="Specifications">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Center Stone" value={form.specs.centerStone} onChange={(v) => updateSpec("centerStone", v)} />
              <TextField label="Accent Stones" value={form.specs.accentStones} onChange={(v) => updateSpec("accentStones", v)} />
              <TextField label="Metal" value={form.specs.metal} onChange={(v) => updateSpec("metal", v)} />
              <TextField label="Total Carats" value={form.specs.totalCarats} onChange={(v) => updateSpec("totalCarats", v)} />
              <TextField label="Total Weight" value={form.specs.totalWeight} onChange={(v) => updateSpec("totalWeight", v)} />
              <TextField label="Size" value={form.specs.size} onChange={(v) => updateSpec("size", v)} />
              <TextField label="Certificate" value={form.specs.certificate} onChange={(v) => updateSpec("certificate", v)} />
            </div>
          </Card>
        </div>

        {/* sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-32">
          <Card>
            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13.5px] text-red-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4.5M12 16h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            <SaveButton />
          </Card>

          <Card title="Organisation">
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    aria-invalid={Boolean(fieldErrors.category)}
                    className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-[14.5px] text-[#141414] outline-none transition-all focus:ring-2 ${
                      fieldErrors.category
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                        : "border-black/10 focus:border-[#BF9A3A] focus:ring-[#BF9A3A]/20"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]"
                  >
                    <path d="m6 9.5 6 6 6-6" />
                  </svg>
                </div>
                <FieldError>{fieldErrors.category}</FieldError>
              </div>

              <TextField
                label="Collection Tag"
                value={form.collectionTag}
                onChange={(v) => update("collectionTag", v)}
                placeholder="Bridal"
              />

              {/* featured toggle */}
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-black/10 px-3.5 py-3">
                <span>
                  <span className="block text-[14.5px] font-medium text-[#141414]">Featured</span>
                  <span className="mt-0.5 block text-[12.5px] text-[#8A8A8A]">Show on homepage</span>
                </span>
                <span className="relative inline-flex shrink-0">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update("featured", e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="block h-6 w-11 rounded-full bg-black/15 transition-colors peer-checked:bg-[#BF9A3A]" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          </Card>

          <Card title="SEO" description="Leave blank to fall back to the name and description.">
            <div className="space-y-5">
              <TextField
                label="Meta Title"
                value={form.metaTitle}
                onChange={(v) => update("metaTitle", v)}
                placeholder={form.name || "Page title for Google"}
              />

              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={form.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Snippet shown in search results."
                  className={`${inputClass} resize-y`}
                />
                <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-[#9A9A9A]">Aim for 120–160</span>
                  <span className={metaLen > 150 ? "text-amber-600" : "text-[#9A9A9A]"}>
                    {metaLen}/160
                  </span>
                </div>
              </div>

              <div>
                <TextField
                  label="Keywords"
                  value={form.keywords}
                  onChange={(v) => update("keywords", v)}
                  placeholder="pendant, tanzanite, halo"
                  hint="Comma separated."
                />
                {keywordChips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {keywordChips.map((k, i) => (
                      <span
                        key={`${k}-${i}`}
                        className="rounded-full bg-[#F7F1E5] px-2.5 py-1 text-[12px] font-medium text-[#8A6E1F]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* mobile pe sidebar neeche hai, isliye ek aur save */}
      <div className="mt-6 xl:hidden">
        {error && (
          <div
            role="alert"
            className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13.5px] text-red-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4.5M12 16h.01" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <SaveButton className="py-3.5" />
      </div>
    </form>
  );
}
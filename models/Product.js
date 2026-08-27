import mongoose from "mongoose";

const SpecsSchema = new mongoose.Schema(
  {
    centerStone: String,
    accentStones: String,
    metal: String,
    totalCarats: String,
    totalWeight: String,
    size: String,
    certificate: String,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    images: [{ type: String }],
    // Single alt text shared across all of this product's images.
    imagesAlt: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: { type: String, default: "" },
    specs: { type: SpecsSchema, default: () => ({}) },
    stock: { type: Number, default: 10 },
    collectionTag: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

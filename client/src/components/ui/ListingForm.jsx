import { useState } from "react";
import { ID } from "appwrite";
import { storage } from "../../appwrite/appwriteconfig.js";
import { compressImage } from "../../utils/imageUtils";
import {
  FaHome,
  FaDollarSign,
  FaParking,
  FaChair,
  FaTag,
  FaCloudUploadAlt,
  FaTrash,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";
import Button from "./Button";

const DEFAULT_DATA = {
  imageUrls: [],
  name: "",
  description: "",
  address: "",
  type: "rent",
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
  contact: "",
};

const TYPE_OPTIONS = [
  { id: "sale", label: "For Sale", icon: FaDollarSign },
  { id: "rent", label: "For Rent", icon: FaHome },
];

const FEATURE_OPTIONS = [
  { id: "parking", label: "Parking Spot", icon: FaParking },
  { id: "furnished", label: "Furnished", icon: FaChair },
  { id: "offer", label: "Special Offer", icon: FaTag },
];

const inputClass =
  "w-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-estate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-estate-50 dark:focus:ring-estate-900/30 transition-colors";

export default function ListingForm({
  title,
  subtitle,
  submitLabel,
  loadingLabel,
  initialData,
  onFormSubmit,
  loading,
  error,
}) {
  const [formData, setFormData] = useState(initialData || DEFAULT_DATA);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else if (["parking", "furnished", "offer"].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const storeImage = async (file) => {
    const compressed = await compressImage(file);
    const fileId = ID.unique();
    const response = await storage.createFile(
      "67fcceb30033ff389be2",
      fileId,
      compressed
    );
    return storage.getFileView("67fcceb30033ff389be2", response.$id);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      try {
        const promises = Array.from(files).map((f) => storeImage(f));
        const imageUrls = await Promise.all(promises);
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(imageUrls),
        });
        setImageUploadError(false);
      } catch {
        setImageUploadError("Image upload failed (2 MB max per image).");
      }
    } else {
      setImageUploadError("Upload between 1 and 6 images total.");
    }
    setUploading(false);
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {subtitle || "Fill in the details below to list your property."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* Left Column — Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Property Info */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <FaHome className="text-estate-600 h-4 w-4" aria-hidden="true" />
              Property Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Modern 3-Bedroom Apartment"
                  className={inputClass}
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the property, its features, and surroundings..."
                  className={`${inputClass} min-h-[120px] resize-y`}
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Full property address"
                  className={inputClass}
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Contact Info
                </label>
                <input
                  type="text"
                  id="contact"
                  placeholder="Phone, email, or social handle"
                  className={inputClass}
                  maxLength="120"
                  onChange={handleChange}
                  value={formData.contact}
                />
              </div>
            </div>
          </section>

          {/* Type & Features */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Type & Features
            </h2>

            <div className="mb-5">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Listing Type
              </p>
              <div className="flex gap-3">
                {TYPE_OPTIONS.map((t) => (
                  <label
                    key={t.id}
                    htmlFor={t.id}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      formData.type === t.id
                        ? "border-estate-500 bg-estate-50 dark:bg-estate-900/30 text-estate-700 dark:text-estate-300"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={t.id}
                      className="sr-only"
                      onChange={handleChange}
                      checked={formData.type === t.id}
                    />
                    <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Features
              </p>
              <div className="flex flex-wrap gap-3">
                {FEATURE_OPTIONS.map((f) => (
                  <label
                    key={f.id}
                    htmlFor={f.id}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      formData[f.id]
                        ? "border-estate-500 bg-estate-50 dark:bg-estate-900/30 text-estate-700 dark:text-estate-300"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={f.id}
                      className="sr-only"
                      onChange={handleChange}
                      checked={formData[f.id]}
                    />
                    <f.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Rooms & Pricing */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Rooms & Pricing
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className={inputClass}
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className={inputClass}
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
              <div>
                <label
                  htmlFor="regularPrice"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                >
                  Price {formData.type === "rent" ? "($/mo)" : "($)"}
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  min="0"
                  required
                  className={inputClass}
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
              </div>
              {formData.offer && (
                <div>
                  <label
                    htmlFor="discountPrice"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
                  >
                    Discount {formData.type === "rent" ? "($/mo)" : "($)"}
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    required
                    className={inputClass}
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column — Images & Submit */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
              <FaImage className="text-estate-600 h-4 w-4" aria-hidden="true" />
              Property Images
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              First image will be the cover (max 6)
            </p>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4 hover:border-estate-300 dark:hover:border-estate-500 transition-colors">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-estate-50 file:text-estate-700 hover:file:bg-estate-100 file:cursor-pointer cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading || files.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-estate-200 dark:border-estate-700 text-estate-700 dark:text-estate-300 font-medium text-sm hover:bg-estate-50 dark:hover:bg-estate-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaCloudUploadAlt className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Images"}
            </button>

            {imageUploadError && (
              <p className="text-sm text-rose-500 mt-3 flex items-center gap-1.5">
                <FaExclamationCircle
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                {imageUploadError}
              </p>
            )}

            {formData.imageUrls.length > 0 && (
              <div className="mt-4 space-y-3">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex items-center justify-between gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={url}
                        className="h-14 w-14 object-cover rounded-lg shrink-0"
                        alt={`Property image ${index + 1}`}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {index === 0 ? "Cover image" : `Image ${index + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && (
            <div
              className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 flex items-start gap-3"
              role="alert"
            >
              <FaExclamationCircle className="text-rose-500 h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={loading || uploading}
            disabled={loading || uploading}
          >
            {loading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </main>
  );
}

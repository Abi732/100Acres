"use client";

// frontend/app/properties/page.jsx
// Place this at: frontend/app/properties/page.jsx
// Accessible at: http://localhost:3000/properties

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/store/axios";
import Navbar from "@/components/custom/Navbar";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const TYPES    = ["apartment", "house", "villa", "plot", "commercial"];
const PURPOSES = ["sale", "rent"];
const BEDS     = [1, 2, 3, 4, 5];

const TYPE_ICONS = {
  apartment:  "🏢",
  house:      "🏠",
  villa:      "🏡",
  plot:       "🌿",
  commercial: "🏗️",
};

const PURPOSE_COLORS = {
  sale: { bg: "bg-blue-500/15",  text: "text-blue-400",  border: "border-blue-500/30"  },
  rent: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
};

const STATUS_COLORS = {
  available: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  sold:      { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/30"     },
  rented:    { bg: "bg-gray-500/15",    text: "text-gray-400",    border: "border-gray-500/30"    },
};

// ── SKELETON ──────────────────────────────────────────────────────────────────

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
      <Skeleton className="h-52 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

// ── PROPERTY CARD (GRID) ──────────────────────────────────────────────────────

function PropertyCardGrid({ property }) {
  const pc = PURPOSE_COLORS[property.purpose] ?? PURPOSE_COLORS.sale;
  const sc = STATUS_COLORS[property.status]   ?? STATUS_COLORS.available;

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="group bg-white/[0.03] border border-white/[0.07] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-white/[0.04]">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
              {TYPE_ICONS[property.type] ?? "🏠"}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
              {property.purpose}
            </span>
            {property.status !== "available" && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                {property.status}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-black text-xl font-serif">
              ₹{property.price?.toLocaleString("en-IN")}
              {property.purpose === "rent" && <span className="text-xs font-normal opacity-75">/mo</span>}
            </p>
          </div>

          {/* Type icon */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-base">
            {TYPE_ICONS[property.type] ?? "🏠"}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-bold text-gray-100 text-sm font-serif mb-1 truncate">{property.title}</h3>
          <p className="text-xs text-gray-500 mb-3 truncate">
            📍 {[property.location?.address, property.location?.city, property.location?.state].filter(Boolean).join(", ")}
          </p>

          {/* Specs */}
          <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
            {property.bedrooms   && <span>🛏 {property.bedrooms} Bed</span>}
            {property.bathrooms  && <span>🚿 {property.bathrooms} Bath</span>}
            {property.area?.value && <span>📐 {property.area.value} {property.area.unit ?? "sqft"}</span>}
          </div>

          {/* Type tag */}
          <div className="mt-3 pt-3 border-t border-white/[0.05] flex justify-between items-center">
            <span className="text-[10px] text-gray-600 capitalize">{property.type}</span>
            <span className="text-[10px] text-amber-500 font-semibold group-hover:underline">View Details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── PROPERTY CARD (LIST) ──────────────────────────────────────────────────────

function PropertyCardList({ property }) {
  const pc = PURPOSE_COLORS[property.purpose] ?? PURPOSE_COLORS.sale;

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="group flex gap-4 bg-white/[0.03] border border-white/[0.07] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:bg-white/[0.05] cursor-pointer p-0">
        {/* Image */}
        <div className="relative w-44 shrink-0 overflow-hidden bg-white/[0.04]">
          {property.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 min-h-[120px]">
              {TYPE_ICONS[property.type] ?? "🏠"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 py-4 pr-4 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-100 text-sm font-serif truncate">{property.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                📍 {[property.location?.address, property.location?.city, property.location?.state].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-amber-500 font-black text-lg font-serif">
                ₹{property.price?.toLocaleString("en-IN")}
              </p>
              {property.purpose === "rent" && <p className="text-[10px] text-gray-600">/month</p>}
            </div>
          </div>

          <div className="flex gap-3 text-xs text-gray-500 mb-3 flex-wrap">
            {property.bedrooms   && <span>🛏 {property.bedrooms} Bed</span>}
            {property.bathrooms  && <span>🚿 {property.bathrooms} Bath</span>}
            {property.area?.value && <span>📐 {property.area.value} {property.area.unit ?? "sqft"}</span>}
            <span className="capitalize">{TYPE_ICONS[property.type]} {property.type}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
              For {property.purpose}
            </span>
            {property.amenities?.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] text-gray-600 bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full capitalize">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Filter state — initialise from URL params
  const [search,   setSearch]   = useState(searchParams.get("q")       ?? "");
  const [type,     setType]     = useState(searchParams.get("type")    ?? "");
  const [purpose,  setPurpose]  = useState(searchParams.get("purpose") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [page,     setPage]     = useState(1);
  const [view,     setView]     = useState("grid"); // "grid" | "list"

  // Data state
  const [properties, setProperties] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);

  // ── FETCH ──────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};
      if (search)   params.q        = search;
      if (type)     params.type     = type;
      if (purpose)  params.purpose  = purpose;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bedrooms) params.bedrooms = bedrooms;
      params.page  = page;
      params.limit = 12;

      const res = await axiosInstance.get("/properties", { params });

      if (res.data.success) {
        setProperties(res.data.properties);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error("fetchProperties error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, type, purpose, minPrice, maxPrice, bedrooms, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, type, purpose, minPrice, maxPrice, bedrooms]);

  // ── CLEAR FILTERS ─────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch(""); setType(""); setPurpose("");
    setMinPrice(""); setMaxPrice(""); setBedrooms(""); setPage(1);
  };

  const hasFilters = search || type || purpose || minPrice || maxPrice || bedrooms;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      {/* ── HERO STRIP ── */}
      <div className="pt-16 bg-gradient-to-b from-[#111118] to-[#0a0a0f] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Browse</p>
          <h1 className="text-3xl md:text-4xl font-black font-serif mb-1">
            Property Listings
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? "Loading..." : `${total.toLocaleString()} propert${total === 1 ? "y" : "ies"} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* ── SIDEBAR FILTERS ── */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Search */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="City, keyword..."
                    className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-colors pl-9"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">🔍</span>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Purpose</label>
                <div className="flex gap-2">
                  {["", ...PURPOSES].map(p => (
                    <button
                      key={p || "all"}
                      onClick={() => setPurpose(p)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                        purpose === p
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "bg-white/[0.04] border-white/[0.07] text-gray-500 hover:border-white/20"
                      }`}
                    >
                      {p || "All"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Property Type</label>
                <div className="flex flex-col gap-1.5">
                  {["", ...TYPES].map(t => (
                    <button
                      key={t || "all"}
                      onClick={() => setType(t)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all border ${
                        type === t
                          ? "bg-amber-500/15 border-amber-500/35 text-amber-400"
                          : "bg-white/[0.03] border-white/[0.06] text-gray-500 hover:border-white/15 hover:text-gray-300"
                      }`}
                    >
                      <span>{t ? TYPE_ICONS[t] : "🏘️"}</span>
                      <span className="capitalize font-medium">{t || "All Types"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-colors"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-amber-500/50 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 block">Bedrooms</label>
                <div className="flex gap-1.5 flex-wrap">
                  {["", ...BEDS].map(b => (
                    <button
                      key={b === "" ? "any" : b}
                      onClick={() => setBedrooms(String(b))}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all border ${
                        bedrooms === String(b)
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "bg-white/[0.04] border-white/[0.07] text-gray-500 hover:border-white/20"
                      }`}
                    >
                      {b === "" ? "Any" : b === 5 ? "5+" : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 transition-all"
                >
                  × Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Searching..."
                  : total === 0
                  ? "No properties found"
                  : `Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, total)} of ${total}`}
              </p>

              {/* View toggle */}
              <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${view === "grid" ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${view === "list" ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  ☰ List
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex gap-2 flex-wrap mb-5">
                {search   && <FilterChip label={`"${search}"`}       onRemove={() => setSearch("")}   />}
                {purpose  && <FilterChip label={`For ${purpose}`}    onRemove={() => setPurpose("")}  />}
                {type     && <FilterChip label={type}                onRemove={() => setType("")}     />}
                {bedrooms && <FilterChip label={`${bedrooms}+ beds`} onRemove={() => setBedrooms("")} />}
                {(minPrice || maxPrice) && (
                  <FilterChip
                    label={`₹${minPrice || 0} – ₹${maxPrice || "∞"}`}
                    onRemove={() => { setMinPrice(""); setMaxPrice(""); }}
                  />
                )}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className={view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col gap-4"}>
                {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4 opacity-20">🏘️</div>
                <h3 className="text-lg font-bold text-gray-400 font-serif mb-2">No properties found</h3>
                <p className="text-sm text-gray-600 mb-5">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="text-sm font-semibold text-amber-400 border border-amber-500/30 px-5 py-2.5 rounded-xl hover:bg-amber-500/10 transition-all">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                : "flex flex-col gap-4"}>
                {properties.map(p =>
                  view === "grid"
                    ? <PropertyCardGrid key={p._id} property={p} />
                    : <PropertyCardList key={p._id} property={p} />
                )}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && !loading && (
              <div className="flex justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/[0.07] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-600 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all border ${
                          page === p
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                            : "bg-white/[0.04] border-white/[0.07] text-gray-500 hover:border-white/20"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/[0.07] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FILTER CHIP ───────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold rounded-full">
      <span className="capitalize">{label}</span>
      <button onClick={onRemove} className="hover:text-amber-200 transition-colors text-base leading-none">×</button>
    </div>
  );
}
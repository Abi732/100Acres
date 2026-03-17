"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import logo from "@/assets/transparentlogo.png";
import Navbar from "@/components/custom/Navbar";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: "1",
    title: "Skyline Residency",
    type: "2 BHK Flat",
    city: "Mumbai",
    locality: "Bandra West",
    address: "Plot 14, Turner Road, Bandra West, Mumbai - 400050",
    price: 45000,
    deposit: 90000,
    maintenance: 2000,
    available: "Immediately",
    furnishing: "Semi-Furnished",
    floor: "5th of 12",
    facing: "Sea Facing",
    age: "3 Years",
    beds: 2, baths: 2, sqft: 980, parking: 1,
    amenities: ["Swimming Pool", "Gym", "24/7 Security", "Power Backup", "Parking", "Lift", "Club House", "CCTV"],
    highlights: ["Sea view from living room", "Walking distance to Bandra Station", "Pet-friendly society"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85",
    ],
    broker: { name: "Rajesh Kumar", agency: "Kumar Realty", phone: "+91 98765 43210", since: "2015", deals: 142, rating: 4.8, reviews: 32, avatar: "RK" },
    tag: "Premium", tagColor: "bg-amber-500",
    rating: 4.8, reviews: 32,
    description: "A stunning 2 BHK apartment on the 5th floor of the prestigious Skyline Residency tower. This beautifully appointed home offers sweeping sea views from the living room and master bedroom. The apartment is semi-furnished with modular kitchen, wardrobes, and air conditioning in all rooms. Bandra West's most sought-after address — walkable to restaurants, cafes, and Bandra station.",
    similar: [
      { id: "2", title: "Green Valley Homes", locality: "Whitefield",    city: "Bengaluru", price: 38000,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", type: "3 BHK" },
      { id: "4", title: "Lotus Grand Studio", locality: "Koregaon Park", city: "Pune",      price: 21000,  img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", type: "1 BHK" },
      { id: "5", title: "Emerald Towers",     locality: "Vasant Kunj",   city: "Delhi",     price: 120000, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", type: "4 BHK" },
    ],
  },
  {
    id: "2",
    title: "Green Valley Homes",
    type: "3 BHK Apartment",
    city: "Bengaluru",
    locality: "Whitefield",
    address: "Block C, Green Valley Society, ITPL Road, Whitefield, Bengaluru - 560066",
    price: 38000,
    deposit: 114000,
    maintenance: 3500,
    available: "1st July 2025",
    furnishing: "Fully Furnished",
    floor: "3rd of 8",
    facing: "Garden Facing",
    age: "5 Years",
    beds: 3, baths: 2, sqft: 1350, parking: 2,
    amenities: ["Garden", "Club House", "CCTV", "Power Backup", "Gym", "Children Play Area", "Jogging Track", "Lift"],
    highlights: ["5 min from ITPL Tech Park", "Fully furnished with premium appliances", "Gated community"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85",
    ],
    broker: { name: "Sunita Rao", agency: "Rao Properties", phone: "+91 87654 32109", since: "2012", deals: 218, rating: 4.6, reviews: 58, avatar: "SR" },
    tag: "Hot Deal", tagColor: "bg-red-500",
    rating: 4.6, reviews: 58,
    description: "Spacious 3 BHK in the well-maintained Green Valley Society, perfectly located for IT professionals working in Whitefield. The apartment is fully furnished with high-quality furniture, a fully equipped modular kitchen, and 2 covered parking spots. The society features lush gardens, a clubhouse, and 24/7 security.",
    similar: [
      { id: "1", title: "Skyline Residency", locality: "Bandra West", city: "Mumbai",    price: 45000, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", type: "2 BHK" },
      { id: "3", title: "The Urban Nest",    locality: "Gachibowli",  city: "Hyderabad", price: 9500,  img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", type: "PG" },
    ],
  },
  {
    id: "3",
    title: "The Urban Nest",
    type: "PG / Co-living",
    city: "Hyderabad",
    locality: "Gachibowli",
    address: "Plot 22, Gachibowli Main Road, Hyderabad - 500032",
    price: 9500,
    deposit: 9500,
    maintenance: 0,
    available: "Immediately",
    furnishing: "Fully Furnished",
    floor: "2nd of 4",
    facing: "East Facing",
    age: "2 Years",
    beds: 1, baths: 1, sqft: 220, parking: 0,
    amenities: ["WiFi", "Meals Included", "Laundry", "AC", "CCTV", "Power Backup"],
    highlights: ["Walking distance to Gachibowli IT hub", "Meals included (breakfast & dinner)", "High-speed WiFi"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85",
    ],
    broker: { name: "Anil Verma", agency: "Verma PG Homes", phone: "+91 76543 21098", since: "2018", deals: 87, rating: 4.5, reviews: 91, avatar: "AV" },
    tag: "PG Pick", tagColor: "bg-violet-500",
    rating: 4.5, reviews: 91,
    description: "A premium co-living space designed for young professionals and students near the Gachibowli IT corridor. Fully furnished rooms with AC, high-speed WiFi, and meals included. The property is clean, secure, and managed by a dedicated team.",
    similar: [
      { id: "1", title: "Skyline Residency",  locality: "Bandra West", city: "Mumbai",    price: 45000, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", type: "2 BHK" },
      { id: "4", title: "Lotus Grand Studio", locality: "Koregaon Park",city: "Pune",     price: 21000, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", type: "1 BHK" },
    ],
  },
  {
    id: "4",
    title: "Lotus Grand Studio",
    type: "1 BHK Studio",
    city: "Pune",
    locality: "Koregaon Park",
    address: "Lotus Society, Lane 5, Koregaon Park, Pune - 411001",
    price: 21000,
    deposit: 42000,
    maintenance: 1500,
    available: "15th July 2025",
    furnishing: "Semi-Furnished",
    floor: "1st of 6",
    facing: "West Facing",
    age: "1 Year",
    beds: 1, baths: 1, sqft: 550, parking: 1,
    amenities: ["Gym", "Security", "Lift", "Parking", "Power Backup"],
    highlights: ["Brand new building", "Prime Koregaon Park location", "Near restaurants & cafes"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
    ],
    broker: { name: "Priya Nair", agency: "Nair Properties", phone: "+91 65432 10987", since: "2019", deals: 64, rating: 4.7, reviews: 14, avatar: "PN" },
    tag: "New", tagColor: "bg-emerald-500",
    rating: 4.7, reviews: 14,
    description: "A brand-new 1 BHK studio in the heart of Koregaon Park, Pune's most vibrant neighbourhood. Perfect for a single professional or couple. Semi-furnished with wardrobe and modular kitchen. Easy access to restaurants, pubs, and IT parks.",
    similar: [
      { id: "2", title: "Green Valley Homes", locality: "Whitefield",  city: "Bengaluru", price: 38000, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", type: "3 BHK" },
      { id: "6", title: "Saffron Heights",    locality: "Anna Nagar",  city: "Chennai",   price: 28000, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80", type: "2 BHK" },
    ],
  },
  {
    id: "5",
    title: "Emerald Towers",
    type: "4 BHK Penthouse",
    city: "Delhi",
    locality: "Vasant Kunj",
    address: "Tower A, Emerald Enclave, Vasant Kunj, New Delhi - 110070",
    price: 120000,
    deposit: 360000,
    maintenance: 8000,
    available: "Immediately",
    furnishing: "Fully Furnished",
    floor: "12th of 12",
    facing: "North Facing",
    age: "4 Years",
    beds: 4, baths: 3, sqft: 2800, parking: 2,
    amenities: ["Terrace", "Pool", "Gym", "Concierge", "24/7 Security", "Club House", "Lift", "CCTV"],
    highlights: ["Exclusive penthouse with private terrace", "Panoramic city views", "Concierge service"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85",
    ],
    broker: { name: "Vikram Singh", agency: "Singh Luxury Realty", phone: "+91 54321 09876", since: "2010", deals: 312, rating: 4.9, reviews: 7, avatar: "VS" },
    tag: "Luxury", tagColor: "bg-amber-500",
    rating: 4.9, reviews: 7,
    description: "An extraordinary penthouse atop the prestigious Emerald Towers in Vasant Kunj. Spanning 2800 sqft across the entire top floor, this fully furnished 4 BHK offers unmatched luxury — private rooftop terrace, panoramic Delhi views, premium furnishings and concierge service.",
    similar: [
      { id: "1", title: "Skyline Residency",  locality: "Bandra West",   city: "Mumbai",    price: 45000, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", type: "2 BHK" },
      { id: "6", title: "Saffron Heights",    locality: "Anna Nagar",    city: "Chennai",   price: 28000, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80", type: "2 BHK" },
    ],
  },
  {
    id: "6",
    title: "Saffron Heights",
    type: "2 BHK Flat",
    city: "Chennai",
    locality: "Anna Nagar",
    address: "Door No. 8, 3rd Main Road, Anna Nagar West, Chennai - 600040",
    price: 28000,
    deposit: 56000,
    maintenance: 2000,
    available: "1st August 2025",
    furnishing: "Semi-Furnished",
    floor: "4th of 7",
    facing: "South Facing",
    age: "6 Years",
    beds: 2, baths: 2, sqft: 1050, parking: 1,
    amenities: ["Security", "Parking", "Lift", "Power Backup", "CCTV"],
    highlights: ["Prime Anna Nagar location", "Good connectivity to all parts of Chennai", "Quiet residential street"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
    ],
    broker: { name: "Deepa Krishnan", agency: "Krishnan Realty", phone: "+91 43210 98765", since: "2016", deals: 95, rating: 4.4, reviews: 43, avatar: "DK" },
    tag: "Popular", tagColor: "bg-blue-500",
    rating: 4.4, reviews: 43,
    description: "A well-maintained 2 BHK flat in the heart of Anna Nagar, one of Chennai's most desirable residential areas. Semi-furnished with modular kitchen and wardrobes. Close to schools, hospitals, shopping malls, and metro stations.",
    similar: [
      { id: "4", title: "Lotus Grand Studio", locality: "Koregaon Park", city: "Pune",      price: 21000, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", type: "1 BHK" },
      { id: "2", title: "Green Valley Homes", locality: "Whitefield",    city: "Bengaluru", price: 38000, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", type: "3 BHK" },
    ],
  },
];

// ── PAGE ───────────────────────────────────────────────────────────────────────

export default function PropertyDetail() {
  const { customerid } = useParams();

  // ✅ CORRECT ORDER: isLoaded check FIRST, then isSignedIn
  const { isLoaded, isSignedIn, user } = useUser();

  const property = PROPERTIES.find(p => p.id === String(customerid)) || PROPERTIES[0];

  const [activeImg, setActiveImg] = useState(0);
  const [saved,     setSaved]     = useState(false);
  const [tab,       setTab]       = useState("overview");
  const [msgOpen,   setMsgOpen]   = useState(false);
  const [msgText,   setMsgText]   = useState("");
  const [msgSent,   setMsgSent]   = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitSent, setVisitSent] = useState(false);

  // ✅ Step 1: wait for Clerk to finish loading
  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ✅ Step 2: page is PUBLIC — guests can browse, no redirect needed.
  // CTAs will prompt sign-in only when clicked.

  const handleSendMsg = () => {
    if (!msgText.trim()) return;
    setMsgSent(true);
    setTimeout(() => { setMsgSent(false); setMsgOpen(false); setMsgText(""); }, 2000);
  };

  const handleVisit = () => {
    if (!visitDate || !visitTime) return;
    setVisitSent(true);
    setTimeout(() => { setVisitSent(false); setVisitOpen(false); setVisitDate(""); setVisitTime(""); }, 2000);
  };

  // Show sign-in prompt inside modal instead of redirect
  const requireAuth = (cb) => {
    if (!isSignedIn) {
      setMsgText(""); 
      setMsgOpen(true); // reuse modal with sign-in state
      return;
    }
    cb();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-16">

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 flex-wrap">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/customer" className="hover:text-amber-400 transition-colors">Listings</Link>
          <span>/</span>
          <span className="text-gray-400">{property.title}</span>
        </div>

        <div className="flex gap-8 flex-col xl:flex-row">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0">

            {/* IMAGE GALLERY */}
            <div className="mb-6">
              <div className="relative h-[360px] md:h-[480px] rounded-2xl overflow-hidden mb-3 group">
                <img
                  src={property.images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-4 left-4 ${property.tagColor} text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
                  {property.tag}
                </span>
                <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImg + 1} / {property.images.length}
                </span>
                {activeImg > 0 && (
                  <button onClick={() => setActiveImg(i => i - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all opacity-0 group-hover:opacity-100">
                    ‹
                  </button>
                )}
                {activeImg < property.images.length - 1 && (
                  <button onClick={() => setActiveImg(i => i + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all opacity-0 group-hover:opacity-100">
                    ›
                  </button>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-amber-500 opacity-100" : "border-transparent opacity-50 hover:opacity-75"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* TITLE ROW */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-serif text-gray-100 mb-1">{property.title}</h1>
                <p className="text-gray-400 text-sm">📍 {property.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSaved(s => !s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${saved ? "bg-red-500/15 border-red-500/40 text-red-400" : "bg-white/[0.05] border-white/10 text-gray-400 hover:border-red-400/40 hover:text-red-400"}`}>
                  {saved ? "♥ Saved" : "♡ Save"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.05] text-gray-400 text-sm font-semibold hover:bg-white/10 transition-all">
                  ↗ Share
                </button>
              </div>
            </div>

            {/* KEY SPECS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: "🛏", label: "Bedrooms",   val: `${property.beds} BHK` },
                { icon: "🚿", label: "Bathrooms",  val: `${property.baths} Bath` },
                { icon: "📐", label: "Area",       val: `${property.sqft} sqft` },
                { icon: "🚗", label: "Parking",    val: property.parking ? `${property.parking} Spot` : "None" },
                { icon: "🪑", label: "Furnishing", val: property.furnishing },
                { icon: "🏢", label: "Floor",      val: property.floor },
                { icon: "🧭", label: "Facing",     val: property.facing },
                { icon: "🏗️", label: "Age",        val: property.age },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5 hover:border-amber-500/25 transition-all">
                  <p className="text-lg mb-1">{s.icon}</p>
                  <p className="text-[11px] text-gray-600 uppercase tracking-wide mb-0.5">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-200">{s.val}</p>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-6">
              {[
                { id: "overview",  label: "Overview"  },
                { id: "amenities", label: "Amenities" },
                { id: "map",       label: "Location"  },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW */}
            {tab === "overview" && (
              <div className="space-y-5">
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                  <h3 className="text-base font-bold text-gray-200 font-serif mb-3">About this property</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{property.description}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                  <h3 className="text-base font-bold text-gray-200 font-serif mb-4">Highlights</h3>
                  <div className="flex flex-col gap-2.5">
                    {property.highlights.map(h => (
                      <div key={h} className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-xs shrink-0">✓</span>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                  <h3 className="text-base font-bold text-gray-200 font-serif mb-4">Rent Breakdown</h3>
                  <div className="space-y-0">
                    {[
                      { label: "Monthly Rent",     val: `₹${property.price.toLocaleString("en-IN")}` },
                      { label: "Security Deposit", val: `₹${property.deposit.toLocaleString("en-IN")}` },
                      { label: "Maintenance",      val: property.maintenance ? `₹${property.maintenance.toLocaleString("en-IN")}/mo` : "Included" },
                      { label: "Available From",   val: property.available },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center py-3 border-b border-white/[0.05] last:border-0">
                        <span className="text-sm text-gray-500">{r.label}</span>
                        <span className="text-sm font-semibold text-gray-200">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AMENITIES */}
            {tab === "amenities" && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <h3 className="text-base font-bold text-gray-200 font-serif mb-5">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/25 rounded-xl px-4 py-3 text-sm text-gray-400 transition-all">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MAP */}
            {tab === "map" && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                <h3 className="text-base font-bold text-gray-200 font-serif mb-2">Location</h3>
                <p className="text-sm text-gray-500 mb-4">📍 {property.address}</p>
                <div className="h-72 rounded-xl bg-white/[0.05] border border-white/[0.07] flex flex-col items-center justify-center gap-3 text-gray-600">
                  <span className="text-4xl">🗺️</span>
                  <p className="text-sm font-semibold text-gray-500">Map View</p>
                  <p className="text-xs text-gray-700 text-center max-w-xs">
                    Embed Google Maps using <code className="text-amber-600/60 text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code>
                  </p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
                    target="_blank" rel="noreferrer"
                    className="mt-1 text-xs font-semibold text-amber-500 border border-amber-500/30 px-4 py-2 rounded-xl hover:bg-amber-500/10 transition-all">
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            )}

            {/* SIMILAR PROPERTIES */}
            <div className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Similar Properties</p>
              <h3 className="text-xl font-bold font-serif text-gray-200 mb-5">You might also like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {property.similar.map(s => (
                  <Link key={s.id} href={`/customer/${s.id}`}>
                    <div className="group bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/35 rounded-2xl overflow-hidden transition-all hover:-translate-y-1">
                      <div className="relative h-36 overflow-hidden">
                        <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-white font-bold text-sm font-serif">
                          ₹{s.price.toLocaleString("en-IN")}<span className="text-xs font-normal opacity-75">/mo</span>
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-gray-200 font-serif truncate">{s.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.type} · {s.locality}, {s.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN — sticky ── */}
          <div className="xl:w-80 shrink-0">
            <div className="xl:sticky xl:top-24 flex flex-col gap-4">

              {/* Price card */}
              <div className="bg-[#0d0d14] border border-white/[0.08] rounded-2xl p-5">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-amber-500 font-serif">
                    ₹{property.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  {property.maintenance > 0 && `+ ₹${property.maintenance.toLocaleString("en-IN")}/mo maintenance  ·  `}
                  ₹{property.deposit.toLocaleString("en-IN")} deposit
                </p>

                <div className="flex items-center gap-2 mb-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">Available {property.available}</span>
                </div>

                <button
                  onClick={() => isSignedIn ? setVisitOpen(true) : null}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm mb-2 transition-all ${isSignedIn ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30" : "bg-amber-500/30 text-amber-200 cursor-not-allowed"}`}>
                  {isSignedIn ? "📅 Schedule a Visit" : "🔒 Sign in to Schedule Visit"}
                </button>
                <button
                  onClick={() => isSignedIn ? setMsgOpen(true) : null}
                  className={`w-full font-semibold py-3.5 rounded-xl text-sm transition-all ${isSignedIn ? "bg-white/[0.06] border border-white/10 text-gray-200 hover:bg-white/10" : "bg-white/[0.03] border border-white/[0.06] text-gray-600 cursor-not-allowed"}`}>
                  {isSignedIn ? "💬 Message Broker" : "🔒 Sign in to Message"}
                </button>

                {!isSignedIn && (
                  <p className="text-center text-xs text-gray-600 mt-3">
                    <Link href="/sign-in" className="text-amber-500 hover:text-amber-400 font-semibold">Sign in</Link> or <Link href="/sign-up" className="text-amber-500 hover:text-amber-400 font-semibold">create an account</Link> to contact the broker.
                  </p>
                )}
              </div>

              {/* Broker card */}
              <div className="bg-[#0d0d14] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Listed by</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 font-bold text-base flex items-center justify-center shrink-0">
                    {property.broker.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200">{property.broker.name}</p>
                    <p className="text-xs text-gray-500">{property.broker.agency}</p>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <p className="text-sm font-bold text-amber-400">★ {property.broker.rating}</p>
                    <p className="text-[10px] text-gray-600">{property.broker.reviews} reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Member since", val: property.broker.since },
                    { label: "Deals closed", val: `${property.broker.deals}+` },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-center">
                      <p className="text-base font-bold text-gray-200 font-serif">{s.val}</p>
                      <p className="text-[10px] text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>
                <a href={`tel:${property.broker.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-white/[0.05] border border-white/10 text-gray-300 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
                  📞 {property.broker.phone}
                </a>
              </div>

              {/* Trust badges */}
              <div className="bg-[#0d0d14] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">100ACRES Assurance</p>
                <div className="flex flex-col gap-2.5">
                  {["✅ Verified Listing", "🔒 Secure Payments", "📄 Legal Agreement Support", "🛡️ Fraud-Free Guarantee"].map(b => (
                    <div key={b} className="text-xs text-gray-400">{b}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── MESSAGE BROKER MODAL ── */}
      {msgOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setMsgOpen(false)}>
          <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            {msgSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-bold text-gray-100 font-serif mb-1">Message Sent!</h3>
                <p className="text-sm text-gray-500">{property.broker.name} will reply shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {property.broker.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-200 font-serif">Message {property.broker.name}</h3>
                    <p className="text-xs text-gray-500">{property.title}</p>
                  </div>
                </div>
                {/* Quick reply chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Is this still available?", "Can we schedule a visit?", "Is the rent negotiable?"].map(q => (
                    <button key={q} onClick={() => setMsgText(q)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-amber-400 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
                <textarea rows={4} value={msgText} onChange={e => setMsgText(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40 resize-none mb-4"
                  placeholder="Type your message to the broker..." />
                <div className="flex gap-3">
                  <button onClick={() => setMsgOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
                  <button onClick={handleSendMsg} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/30 transition-all">Send Message</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SCHEDULE VISIT MODAL ── */}
      {visitOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setVisitOpen(false)}>
          <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            {visitSent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-bold text-gray-100 font-serif mb-1">Visit Scheduled!</h3>
                <p className="text-sm text-gray-500">We'll confirm with {property.broker.name} and notify you.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-100 font-serif mb-1">Schedule a Visit</h3>
                <p className="text-sm text-gray-500 mb-5">{property.title} · {property.locality}, {property.city}</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Preferred Date</label>
                    <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-amber-500/40" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Preferred Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "7:00 PM"].map(t => (
                        <button key={t} onClick={() => setVisitTime(t)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${visitTime === t ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-white/[0.04] border-white/10 text-gray-500 hover:border-amber-500/30 hover:text-amber-400"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => setVisitOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
                    <button onClick={handleVisit} disabled={!visitDate || !visitTime}
                      className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                      Confirm Visit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
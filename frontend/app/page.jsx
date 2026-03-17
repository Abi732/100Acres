"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import hero from "../assets/Hero.jpg";
import logo from "../assets/transparentlogo.png";
import Navbar from "@/components/custom/Navbar";

// ── DATA ───────────────────────────────────────────────────────────────────────

const LISTINGS = [
  { id: 1, title: "Skyline Residency",  type: "2 BHK Flat",       city: "Mumbai",    locality: "Bandra West",   price: 45000,  beds: 2, baths: 2, sqft: 980,  tag: "Premium",  tagColor: "bg-amber-500",   img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80", rating: 4.8 },
  { id: 2, title: "Green Valley Homes", type: "3 BHK Apartment",   city: "Bengaluru", locality: "Whitefield",    price: 38000,  beds: 3, baths: 2, sqft: 1350, tag: "Hot Deal", tagColor: "bg-red-500",     img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80", rating: 4.6 },
  { id: 3, title: "The Urban Nest",     type: "PG / Co-living",    city: "Hyderabad", locality: "Gachibowli",    price: 9500,   beds: 1, baths: 1, sqft: 220,  tag: "PG Pick",  tagColor: "bg-violet-500",  img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=80", rating: 4.5 },
  { id: 4, title: "Lotus Grand Studio", type: "1 BHK Studio",      city: "Pune",      locality: "Koregaon Park", price: 21000,  beds: 1, baths: 1, sqft: 550,  tag: "New",      tagColor: "bg-emerald-500", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80", rating: 4.7 },
  { id: 5, title: "Emerald Towers",     type: "4 BHK Penthouse",   city: "Delhi",     locality: "Vasant Kunj",   price: 120000, beds: 4, baths: 3, sqft: 2800, tag: "Luxury",   tagColor: "bg-amber-500",   img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80", rating: 4.9 },
  { id: 6, title: "Saffron Heights",    type: "2 BHK Flat",        city: "Chennai",   locality: "Anna Nagar",    price: 28000,  beds: 2, baths: 2, sqft: 1050, tag: "Popular",  tagColor: "bg-blue-500",    img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80", rating: 4.4 },
];

const STEPS = [
  { step: "01", icon: "🔍", title: "Search & Discover",  desc: "Browse verified listings across 28 cities with powerful filters." },
  { step: "02", icon: "📞", title: "Connect with Broker", desc: "Reach verified brokers via our in-app messaging system." },
  { step: "03", icon: "🏠", title: "Schedule a Visit",   desc: "Book a property visit online using our calendar integration." },
  { step: "04", icon: "📝", title: "Sign & Move In",     desc: "Complete rental agreement digitally with e-sign and online payment." },
];

const CITIES = [
  { name: "Mumbai",    emoji: "🌊", count: "3,200+" },
  { name: "Delhi",     emoji: "🏛️", count: "2,800+" },
  { name: "Bengaluru", emoji: "🌿", count: "2,400+" },
  { name: "Hyderabad", emoji: "💎", count: "1,900+" },
  { name: "Pune",      emoji: "🎓", count: "1,400+" },
  { name: "Chennai",   emoji: "🌅", count: "1,200+" },
  { name: "Kolkata",   emoji: "🎨", count: "900+"   },
  { name: "Jaipur",    emoji: "🏰", count: "500+"   },
];

const STATS    = [{ value: "12,000+", label: "Active Listings" }, { value: "8,400+", label: "Happy Renters" }, { value: "320+", label: "Verified Brokers" }, { value: "28", label: "Cities Covered" }];
const TYPES    = ["Flat", "House", "PG / Hostel", "Plot", "Commercial"];
const CITYLIST = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Kochi"];

// ── CARD ───────────────────────────────────────────────────────────────────────

function PropertyCard({ p }) {
  return (
    <Link href={`/customer/${p.id}`}>
      <div className="group bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/50 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="relative h-48 overflow-hidden">
          <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className={`absolute top-3 left-3 ${p.tagColor} text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>{p.tag}</span>
          <span className="absolute bottom-3 left-3 text-white font-bold text-lg font-serif">
            ₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal opacity-80">/mo</span>
          </span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-100 font-serif">{p.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{p.type} · {p.locality}, {p.city}</p>
            </div>
            <span className="flex items-center gap-1 bg-amber-500/15 text-amber-400 text-xs px-2 py-1 rounded-lg shrink-0">★ {p.rating}</span>
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/[0.07] text-xs text-gray-500">
            <span>🛏 {p.beds} Bed</span><span>🚿 {p.baths} Bath</span><span>📐 {p.sqft} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isLoaded } = useUser();
  const router = useRouter();

  const [tab,      setTab]      = useState("Rent");
  const [city,     setCity]     = useState("");
  const [propType, setPropType] = useState("");
  const [query,    setQuery]    = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [filter,   setFilter]   = useState("All");

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filtered = LISTINGS.filter(p => {
    if (filter === "Flat")   return p.type.includes("BHK") || p.type.includes("Studio");
    if (filter === "PG")     return p.type.includes("PG");
    if (filter === "Luxury") return p.price > 80000;
    return true;
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query)    params.set("q", query);
    if (city)     params.set("city", city);
    if (propType) params.set("type", propType);
    params.set("tab", tab);
    router.push(`/customer?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">

      {/* ── HERO ── */}
      <section className="relative h-screen w-full">
        <Image src={hero} alt="Hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(245,158,11,0.18),transparent)]" />

        {/* Your existing Navbar component */}
        <Navbar />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 gap-5">
          {/* Logo */}
          {/* <Image src={logo} alt="100ACRES" width={130} height={44} className="drop-shadow-2xl" /> */}

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            India's Smartest Property Platform
          </span>

          {/* Headline — your original tagline, styled up */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] max-w-4xl font-serif">
            Managing {" "}
            <em className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent not-italic">hundred acres</em>
            <br />feel like a walk in the park
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-xl leading-relaxed">
            Precision at your fingertips, peace of mind for every property
          </p>

          {/* ── SEARCH BAR ── */}
          <div className="w-full max-w-4xl mt-1">
            {/* Tabs */}
            <div className="flex">
              {["Rent", "Buy", "PG / Hostel", "Commercial"].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2.5 text-sm font-semibold tracking-wide rounded-t-lg border transition-all ${
                    tab === t
                      ? "bg-white text-black border-amber-500 border-b-0 border-t-2"
                      : "bg-white/10 text-gray-400 border-white/10 hover:bg-white/15"
                  }`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex bg-white rounded-tr-xl rounded-b-xl shadow-2xl">
              {/* City dropdown */}
              <div className="relative flex-1 p-4 cursor-pointer border-r border-gray-200 min-w-0" onClick={() => { setCityOpen(v => !v); setTypeOpen(false); }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">📍 City</p>
                <p className={`text-sm truncate ${city ? "text-gray-800 font-semibold" : "text-gray-400"}`}>{city || "Select city..."}</p>
                {cityOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5">
                    {CITYLIST.map(c => (
                      <div key={c} className="px-3 py-2 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg cursor-pointer"
                        onClick={e => { e.stopPropagation(); setCity(c); setCityOpen(false); }}>{c}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Type dropdown */}
              <div className="relative flex-1 p-4 cursor-pointer border-r border-gray-200 min-w-0" onClick={() => { setTypeOpen(v => !v); setCityOpen(false); }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">🏠 Type</p>
                <p className={`text-sm truncate ${propType ? "text-gray-800 font-semibold" : "text-gray-400"}`}>{propType || "Property type..."}</p>
                {typeOpen && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5">
                    {TYPES.map(t => (
                      <div key={t} className="px-3 py-2 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg cursor-pointer"
                        onClick={e => { e.stopPropagation(); setPropType(t); setTypeOpen(false); }}>{t}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Keyword */}
              <div className="flex-[2] p-4 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">🔍 Search</p>
                <input className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                  placeholder="Locality, landmark, project..."
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>

              <div className="p-3 flex items-center shrink-0">
                <button onClick={handleSearch}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-6 py-3 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                  Search
                </button>
              </div>
            </div>

            {/* Quick city chips */}
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              <span className="text-xs text-gray-500 self-center">Popular:</span>
              {["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune"].map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    city === c ? "bg-amber-500/15 border-amber-500/50 text-amber-400" : "bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-amber-400"
                  }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-y border-amber-500/15 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-amber-500 mb-1 font-serif">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Featured Listings</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 font-serif">
              Handpicked Properties<br />
              <span className="text-gray-500 font-normal italic">Across India</span>
            </h2>
          </div>
          <Link href="/customer" className="text-amber-500 border border-amber-500/40 hover:bg-amber-500/10 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
            View All →
          </Link>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2.5 mb-8 flex-wrap">
          {["All", "Flat", "PG", "Luxury"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                filter === f ? "bg-amber-500/15 border-amber-500/50 text-amber-400" : "bg-white/[0.04] border-white/10 text-gray-500 hover:border-amber-500/30 hover:text-amber-400"
              }`}>{f}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-[#111118] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 font-serif">How 100ACRES Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(s => (
              <div key={s.step} className="p-6 bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/30 hover:bg-amber-500/[0.04] rounded-2xl transition-all">
                <p className="text-[10px] font-extrabold tracking-widest text-amber-500/40 mb-4">STEP {s.step}</p>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-base font-semibold text-gray-200 mb-2 font-serif">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CITY ── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-3">Pan-India Coverage</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 font-serif">Browse by City</h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {CITIES.map(({ name, emoji, count }) => (
            <Link key={name} href={`/customer?city=${name}`}>
              <div className="min-w-[140px] p-4 bg-white/[0.04] border border-white/[0.07] hover:bg-amber-500/[0.08] hover:border-amber-500/30 hover:-translate-y-1 rounded-xl text-center transition-all">
                <div className="text-2xl mb-2">{emoji}</div>
                <p className="text-sm font-semibold text-gray-200">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{count} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-4 md:mx-8 mb-20 p-10 md:p-14 rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/[0.06] to-violet-500/[0.08] border border-amber-500/20 flex flex-wrap justify-between items-center gap-8 relative overflow-hidden">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 font-serif">Have a property to list?</h2>
          <p className="text-gray-400 max-w-sm leading-relaxed text-sm">Join 320+ verified brokers and thousands of owners who trust 100ACRES.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/owner">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-7 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all text-sm">
              List as Owner
            </button>
          </Link>
          <Link href="/broker/broker">
            <button className="bg-white/[0.06] border border-white/15 text-gray-100 font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
              Join as Broker
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111118] border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Image src={logo} alt="100ACRES" width={90} height={30} className="mb-4 opacity-90" />
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">India's most trusted property platform. Connecting renters, owners and brokers seamlessly.</p>
            </div>
            {[
              { title: "For Renters", links: ["Browse Properties", "Search by City", "PG & Hostels", "My Dashboard"] },
              { title: "For Owners",  links: ["List Property", "Owner Dashboard", "Rental Agreements", "Maintenance"] },
              { title: "Company",     links: ["About Us", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">{col.title}</h4>
                {col.links.map(l => <a key={l} href="#" className="block mb-2.5 text-sm text-gray-500 hover:text-gray-200 transition-colors">{l}</a>)}
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/[0.06] flex flex-wrap justify-between items-center gap-3 text-xs text-gray-600">
            <p>© 2025 100ACRES. All rights reserved.</p>
            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => <a key={l} href="#" className="hover:text-gray-400 transition-colors">{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
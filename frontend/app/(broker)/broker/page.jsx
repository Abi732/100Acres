"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import logo from "@/assets/transparentlogo.png";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const BROKER = {
  name: "Rajesh Kumar", agency: "Kumar Realty",
  phone: "+91 98765 43210", email: "rajesh@kumarrealty.in",
  since: "2015", avatar: "RK", verified: true, plan: "Pro",
};

const LISTINGS = [
  { id: 1, title: "Skyline Residency",  type: "2 BHK Flat",     city: "Mumbai",    locality: "Bandra West",   price: 45000,  status: "active",   views: 342, inquiries: 12, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", posted: "Jun 01, 2025" },
  { id: 2, title: "Green Valley Homes", type: "3 BHK Apartment", city: "Bengaluru", locality: "Whitefield",    price: 38000,  status: "active",   views: 218, inquiries: 8,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", posted: "Jun 05, 2025" },
  { id: 3, title: "Lotus Grand Studio", type: "1 BHK Studio",    city: "Pune",      locality: "Koregaon Park", price: 21000,  status: "rented",   views: 189, inquiries: 15, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", posted: "May 20, 2025" },
  { id: 4, title: "Emerald Towers",     type: "4 BHK Penthouse", city: "Delhi",     locality: "Vasant Kunj",   price: 120000, status: "active",   views: 97,  inquiries: 4,  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", posted: "Jun 10, 2025" },
  { id: 5, title: "Saffron Heights",    type: "2 BHK Flat",      city: "Chennai",   locality: "Anna Nagar",    price: 28000,  status: "inactive", views: 54,  inquiries: 2,  img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80", posted: "Apr 15, 2025" },
  { id: 6, title: "The Urban Nest",     type: "PG / Co-living",  city: "Hyderabad", locality: "Gachibowli",    price: 9500,   status: "active",   views: 410, inquiries: 22, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", posted: "Jun 12, 2025" },
];

const INQUIRIES = [
  { id: 1, customer: "Priya Sharma",  avatar: "PS", property: "Skyline Residency",  msg: "Hi, is the flat still available? I'd like to schedule a visit this weekend.", time: "5 min ago",  status: "new",     unread: true  },
  { id: 2, customer: "Arjun Mehta",   avatar: "AM", property: "Green Valley Homes", msg: "Can you tell me more about the maintenance charges and parking?",             time: "1 hr ago",   status: "replied", unread: false },
  { id: 3, customer: "Sneha Reddy",   avatar: "SR", property: "The Urban Nest",     msg: "What are the meal timings? Is non-veg allowed?",                             time: "3 hrs ago",  status: "new",     unread: true  },
  { id: 4, customer: "Vikram Nair",   avatar: "VN", property: "Emerald Towers",     msg: "We're a family of 4. Is it pet-friendly? Also interested in long-term lease.",time: "Yesterday",  status: "replied", unread: false },
  { id: 5, customer: "Deepika Rao",   avatar: "DR", property: "Skyline Residency",  msg: "Is there a brokerage fee? And can we do a virtual tour first?",              time: "2 days ago", status: "closed",  unread: false },
  { id: 6, customer: "Karan Singh",   avatar: "KS", property: "Saffron Heights",    msg: "Looking to move in by August 1st. Is that possible?",                        time: "3 days ago", status: "new",     unread: true  },
];

const THREADS = {
  1: [{ from: "customer", text: "Hi, is the flat still available? I'd like to schedule a visit this weekend.", time: "5 min ago" }],
  2: [
    { from: "customer", text: "Can you tell me more about the maintenance charges and parking?", time: "1 hr ago" },
    { from: "broker",   text: "Hi Arjun! Maintenance is ₹2000/mo and there's 1 covered parking slot included.", time: "45 min ago" },
  ],
  3: [{ from: "customer", text: "What are the meal timings? Is non-veg allowed?", time: "3 hrs ago" }],
  4: [
    { from: "customer", text: "We're a family of 4. Is it pet-friendly? Also interested in long-term lease.", time: "Yesterday" },
    { from: "broker",   text: "Hello Vikram! Yes, the society is pet-friendly. We can discuss a long-term lease.", time: "Yesterday" },
  ],
  5: [
    { from: "customer", text: "Is there a brokerage fee? And can we do a virtual tour first?", time: "2 days ago" },
    { from: "broker",   text: "Yes, 1 month brokerage applies. I can arrange a video call tour anytime.", time: "2 days ago" },
  ],
  6: [{ from: "customer", text: "Looking to move in by August 1st. Is that possible?", time: "3 days ago" }],
};

const VISITS = [
  { id: 1, customer: "Priya Sharma", avatar: "PS", property: "Skyline Residency",  date: "2025-06-21", time: "11:00 AM", status: "confirmed", phone: "+91 99887 76655" },
  { id: 2, customer: "Arjun Mehta",  avatar: "AM", property: "Green Valley Homes", date: "2025-06-22", time: "3:00 PM",  status: "pending",   phone: "+91 88776 65544" },
  { id: 3, customer: "Sneha Reddy",  avatar: "SR", property: "The Urban Nest",     date: "2025-06-23", time: "10:30 AM", status: "confirmed", phone: "+91 77665 54433" },
  { id: 4, customer: "Vikram Nair",  avatar: "VN", property: "Emerald Towers",     date: "2025-06-28", time: "5:00 PM",  status: "pending",   phone: "+91 66554 43322" },
  { id: 5, customer: "Rahul Gupta",  avatar: "RG", property: "Saffron Heights",    date: "2025-06-18", time: "2:00 PM",  status: "completed", phone: "+91 55443 32211" },
];

const PAYMENTS = [
  { id: 1, customer: "Ravi Iyer",    property: "Lotus Grand Studio", amount: 21000, type: "Brokerage", date: "Jun 01, 2025", status: "received" },
  { id: 2, customer: "Meena Das",    property: "Skyline Residency",  amount: 45000, type: "Brokerage", date: "Jun 05, 2025", status: "received" },
  { id: 3, customer: "Arjun Mehta",  property: "Green Valley Homes", amount: 38000, type: "Brokerage", date: "Jul 01, 2025", status: "pending"  },
  { id: 4, customer: "Priya Sharma", property: "Skyline Residency",  amount: 5000,  type: "Visit Fee", date: "Jun 21, 2025", status: "pending"  },
  { id: 5, customer: "Deepika Rao",  property: "Saffron Heights",    amount: 28000, type: "Brokerage", date: "May 20, 2025", status: "received" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

const ss = {
  active:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rented:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  inactive: "bg-gray-500/15 text-gray-500 border-gray-500/25",
  new:      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  replied:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed:   "bg-gray-500/15 text-gray-400 border-gray-500/25",
  confirmed:"bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending:  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  completed:"bg-blue-500/15 text-blue-400 border-blue-500/30",
  received: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const NAV = [
  { id: "properties", icon: "🏠", label: "My Properties",  badge: LISTINGS.filter(l => l.status === "active").length },
  { id: "inquiries",  icon: "💬", label: "Inquiries",       badge: INQUIRIES.filter(i => i.unread).length },
  { id: "visits",     icon: "📅", label: "Visit Schedule",  badge: VISITS.filter(v => v.status === "confirmed").length },
  { id: "payments",   icon: "💰", label: "Payments",        badge: PAYMENTS.filter(p => p.status === "pending").length },
  { id: "overview",   icon: "📊", label: "Overview",        badge: 0 },
];

// ── PROPERTIES SECTION ────────────────────────────────────────────────────────

function PropertiesSection() {
  const [filter, setFilter]   = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [editId, setEditId]   = useState(null);
  const filtered = LISTINGS.filter(l => filter === "all" ? true : l.status === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Manage</p>
          <h2 className="text-2xl font-bold text-gray-100 font-serif">My Properties</h2>
        </div>
        <button onClick={() => setAddModal(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all">
          + Add New Listing
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-6">
        {[
          { id: "all",      label: `All (${LISTINGS.length})` },
          { id: "active",   label: `Active (${LISTINGS.filter(l=>l.status==="active").length})` },
          { id: "rented",   label: `Rented (${LISTINGS.filter(l=>l.status==="rented").length})` },
          { id: "inactive", label: `Inactive (${LISTINGS.filter(l=>l.status==="inactive").length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f.id ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(l => (
          <div key={l.id} className="flex gap-4 items-center p-4 bg-white/[0.04] border border-white/[0.07] hover:border-amber-500/25 rounded-2xl transition-all group">
            <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
              <img src={l.img} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-gray-200 font-serif">{l.title}</h3>
                <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ss[l.status]}`}>{l.status}</span>
              </div>
              <p className="text-xs text-gray-500">{l.type} · {l.locality}, {l.city}</p>
              <p className="text-xs text-gray-600 mt-0.5">Posted {l.posted}</p>
            </div>
            <div className="hidden sm:flex items-center gap-6 shrink-0">
              <div className="text-center">
                <p className="text-sm font-bold text-amber-500 font-serif">₹{(l.price/1000).toFixed(0)}k</p>
                <p className="text-[10px] text-gray-600">/month</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-300">{l.views}</p>
                <p className="text-[10px] text-gray-600">views</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-400">{l.inquiries}</p>
                <p className="text-[10px] text-gray-600">inquiries</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditId(l.id)}
                className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-3 py-2 rounded-lg transition-all">Edit</button>
              <Link href={`/customer/${l.id}`}>
                <button className="text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-3 py-2 rounded-lg transition-all">View ↗</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Listing Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto" onClick={() => setAddModal(false)}>
          <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-100 font-serif mb-5">Add New Listing</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Property Title",   placeholder: "e.g. Skyline Residency", full: true  },
                { label: "City",             placeholder: "e.g. Mumbai",            full: false },
                { label: "Locality",         placeholder: "e.g. Bandra West",       full: false },
                { label: "Monthly Rent (₹)", placeholder: "e.g. 45000",            full: false },
                { label: "Deposit (₹)",      placeholder: "e.g. 90000",            full: false },
              ].map(f => (
                <div key={f.label} className={f.full ? "col-span-2" : ""}>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">{f.label}</label>
                  <input className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Type</label>
                <select className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-amber-500/40 appearance-none">
                  {["1 BHK", "2 BHK", "3 BHK", "4 BHK+", "PG / Hostel", "Studio", "Commercial"].map(t => (
                    <option key={t} className="bg-[#111]">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Furnishing</label>
                <select className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-amber-500/40 appearance-none">
                  {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map(t => (
                    <option key={t} className="bg-[#111]">{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Description</label>
                <textarea rows={3} className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40 resize-none" placeholder="Describe the property..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Photos</label>
                <div className="border-2 border-dashed border-white/10 hover:border-amber-500/30 rounded-xl p-6 text-center cursor-pointer transition-all">
                  <p className="text-2xl mb-2">📷</p>
                  <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-700 mt-1">PNG, JPG up to 10MB each</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => setAddModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/30 transition-all">Publish Listing</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setEditId(null)}>
          <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-100 font-serif mb-1">Edit Listing</h3>
            <p className="text-sm text-gray-500 mb-5">{LISTINGS.find(l => l.id === editId)?.title}</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Status</label>
                <div className="flex gap-2">
                  {["active", "inactive", "rented"].map(s => (
                    <button key={s} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border capitalize transition-all ${ss[s]}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">Monthly Rent (₹)</label>
                <input defaultValue={LISTINGS.find(l => l.id === editId)?.price}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-amber-500/40" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditId(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={() => setEditId(null)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black transition-all">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── INQUIRIES SECTION ─────────────────────────────────────────────────────────

function InquiriesSection() {
  const [active, setActive]     = useState(INQUIRIES[0].id);
  const [replyText, setReplyText] = useState("");
  const [sent, setSent]         = useState(false);
  const chat = INQUIRIES.find(i => i.id === active);

  const handleSend = () => {
    if (!replyText.trim()) return;
    setSent(true);
    setReplyText("");
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Manage</p>
        <h2 className="text-2xl font-bold text-gray-100 font-serif">Customer Inquiries</h2>
      </div>

      <div className="flex gap-4 h-[560px]">
        {/* List */}
        <div className="w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {INQUIRIES.map(i => (
            <button key={i.id} onClick={() => setActive(i.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${active === i.id ? "bg-amber-500/10 border-amber-500/40" : "bg-white/[0.03] border-white/[0.07] hover:border-white/15"}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{i.avatar}</div>
                <span className="text-sm font-semibold text-gray-200 truncate flex-1">{i.customer}</span>
                {i.unread && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
              </div>
              <p className="text-xs text-gray-600 mb-1">{i.property}</p>
              <p className="text-xs text-gray-500 truncate">{i.msg}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ss[i.status]}`}>{i.status}</span>
                <span className="text-[10px] text-gray-600">{i.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{chat.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-200">{chat.customer}</p>
              <p className="text-xs text-gray-500">Re: {chat.property}</p>
            </div>
            <span className={`text-[10px] border px-2.5 py-1 rounded-full ${ss[chat.status]}`}>{chat.status}</span>
            <button className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-lg transition-all">Close</button>
          </div>

          {/* Property context */}
          <div className="px-5 py-2.5 bg-amber-500/[0.06] border-b border-amber-500/15 flex items-center gap-2">
            <span className="text-xs text-amber-400/80">🏠 Inquiry about <span className="font-semibold">{chat.property}</span></span>
            <Link href={`/customer/${LISTINGS.find(l => l.title === chat.property)?.id || 1}`}
              className="ml-auto text-[10px] text-amber-500 hover:text-amber-400 transition-colors">View listing ↗</Link>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {(THREADS[active] || []).map((m, i) => (
              <div key={i} className={`flex ${m.from === "broker" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "broker" ? "bg-amber-500/20 text-amber-100 rounded-br-sm" : "bg-white/[0.07] text-gray-300 rounded-bl-sm"}`}>
                  <p>{m.text}</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">{m.time}</p>
                </div>
              </div>
            ))}
            {sent && (
              <div className="flex justify-end">
                <div className="bg-amber-500/20 text-amber-100 px-4 py-2.5 rounded-2xl rounded-br-sm text-sm max-w-[72%]">
                  <p>Reply sent ✓</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">Just now</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-4 pt-3 flex gap-2 flex-wrap border-t border-white/[0.07]">
            {["Sure, let's schedule a visit!", "Please call me at your convenience.", "Yes, it's still available."].map(q => (
              <button key={q} onClick={() => setReplyText(q)}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-gray-500 hover:border-amber-500/30 hover:text-amber-400 transition-all">{q}</button>
            ))}
          </div>
          <div className="px-4 py-3 flex gap-2">
            <input value={replyText} onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-amber-500/40"
              placeholder="Type your reply..." />
            <button onClick={handleSend} className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VISITS SECTION ────────────────────────────────────────────────────────────

function VisitsSection() {
  const upcoming = VISITS.filter(v => v.status !== "completed");
  const past     = VISITS.filter(v => v.status === "completed");

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Schedule</p>
        <h2 className="text-2xl font-bold text-gray-100 font-serif">Visit Schedule</h2>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-amber-500/70 mb-4">Upcoming</p>
      <div className="flex flex-col gap-3 mb-8">
        {upcoming.map(v => (
          <div key={v.id} className="flex flex-wrap gap-4 items-center p-5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/25 rounded-2xl transition-all group">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold flex items-center justify-center shrink-0">{v.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-gray-200">{v.customer}</p>
                <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ss[v.status]}`}>{v.status}</span>
              </div>
              <p className="text-xs text-gray-500">{v.property}</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-gray-400 shrink-0">
              <span>📅 {new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              <span>🕐 {v.time}</span>
              <a href={`tel:${v.phone}`} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">📞 Call</a>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button className="text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 px-3 py-2 rounded-lg transition-all">Confirm</button>
              <button className="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg transition-all">Cancel</button>
            </div>
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Completed</p>
          <div className="flex flex-col gap-3">
            {past.map(v => (
              <div key={v.id} className="flex flex-wrap gap-4 items-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl opacity-60">
                <div className="w-10 h-10 rounded-full bg-gray-500/20 text-gray-500 text-sm font-bold flex items-center justify-center shrink-0">{v.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-400">{v.customer}</p>
                  <p className="text-xs text-gray-600">{v.property}</p>
                </div>
                <div className="flex items-center gap-5 text-xs text-gray-600 shrink-0">
                  <span>📅 {new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <span>🕐 {v.time}</span>
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ss[v.status]}`}>{v.status}</span>
                </div>
                <button className="text-xs font-semibold bg-white/[0.06] text-gray-500 px-3 py-2 rounded-lg shrink-0">Follow Up</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── PAYMENTS SECTION ──────────────────────────────────────────────────────────

function PaymentsSection() {
  const received = PAYMENTS.filter(p => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const pending  = PAYMENTS.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Finance</p>
        <h2 className="text-2xl font-bold text-gray-100 font-serif">Payments</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Received", val: `₹${received.toLocaleString("en-IN")}`, icon: "✅", border: "border-emerald-500/20 bg-emerald-500/[0.06]", text: "text-emerald-400" },
          { label: "Pending",        val: `₹${pending.toLocaleString("en-IN")}`,  icon: "⏳", border: "border-amber-500/20  bg-amber-500/[0.06]",  text: "text-amber-400"   },
          { label: "This Month",     val: "₹83,000",                               icon: "📅", border: "border-blue-500/20   bg-blue-500/[0.06]",    text: "text-blue-400"    },
        ].map(c => (
          <div key={c.label} className={`p-5 rounded-2xl border ${c.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <span>{c.icon}</span>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{c.label}</p>
            </div>
            <p className={`text-2xl font-bold font-serif ${c.text}`}>{c.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex justify-between items-center">
          <p className="text-sm font-bold text-gray-300">Transaction History</p>
          <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">Export CSV</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Customer", "Property", "Type", "Amount", "Date", "Status"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p, i) => (
              <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === PAYMENTS.length-1 ? "border-b-0":""}`}>
                <td className="px-5 py-4 text-gray-300 font-medium">{p.customer}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{p.property}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{p.type}</td>
                <td className="px-5 py-4 text-gray-200 font-bold font-serif">₹{p.amount.toLocaleString("en-IN")}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{p.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] border px-2.5 py-1 rounded-full ${ss[p.status]}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── OVERVIEW SECTION ──────────────────────────────────────────────────────────

function OverviewSection() {
  const STATS = [
    { label: "Active Listings",  value: 4,       icon: "🏠", delta: "+1 this month",    color: "text-amber-400"   },
    { label: "Total Inquiries",  value: 48,       icon: "💬", delta: "+12 this week",    color: "text-blue-400"    },
    { label: "Visits Scheduled", value: 9,        icon: "📅", delta: "4 confirmed",      color: "text-emerald-400" },
    { label: "Revenue (₹)",      value: "1.32L",  icon: "💰", delta: "+₹38k this month", color: "text-amber-400"   },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">Summary</p>
        <h2 className="text-2xl font-bold text-gray-100 font-serif">Overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="p-5 bg-white/[0.04] border border-white/[0.07] hover:border-amber-500/20 rounded-2xl transition-all">
            <div className="text-2xl mb-3">{s.icon}</div>
            <p className={`text-2xl font-bold font-serif mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-[11px] text-gray-700">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-sm font-bold text-gray-300 mb-4">Top Performing Listings</p>
          <div className="flex flex-col gap-3">
            {[...LISTINGS].sort((a, b) => b.views - a.views).slice(0, 4).map(l => (
              <div key={l.id} className="flex items-center gap-3">
                <img src={l.img} alt={l.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-300 truncate">{l.title}</p>
                  <p className="text-xs text-gray-600">{l.locality}, {l.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-300">{l.views}</p>
                  <p className="text-[10px] text-gray-600">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <p className="text-sm font-bold text-gray-300 mb-4">Recent Inquiries</p>
          <div className="flex flex-col gap-3">
            {INQUIRIES.slice(0, 4).map(i => (
              <div key={i.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{i.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-300 truncate">{i.customer}</p>
                  <p className="text-xs text-gray-600 truncate">{i.property}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] border px-2 py-0.5 rounded-full ${ss[i.status]}`}>{i.status}</span>
                  <span className="text-[10px] text-gray-700">{i.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broker profile */}
      <div className="mt-6 p-6 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex flex-wrap gap-5 items-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center font-serif shrink-0">{BROKER.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold text-gray-200 font-serif">{BROKER.name}</h3>
            {BROKER.verified && <span className="text-[10px] bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full font-bold">✓ Verified</span>}
            <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-bold">{BROKER.plan} Plan</span>
          </div>
          <p className="text-sm text-gray-500">{BROKER.agency} · Member since {BROKER.since}</p>
          <p className="text-xs text-gray-600 mt-0.5">{BROKER.email} · {BROKER.phone}</p>
        </div>
        <button className="text-sm font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-5 py-2.5 rounded-xl transition-all shrink-0">Edit Profile</button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function BrokerDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [section, setSection] = useState("properties");

  // ✅ isLoaded FIRST, then isSignedIn
  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isSignedIn) { router.push("/"); return null; }

  const newInquiries = INQUIRIES.filter(i => i.unread).length;

  const SECTION_MAP = {
    properties: <PropertiesSection />,
    inquiries:  <InquiriesSection />,
    visits:     <VisitsSection />,
    payments:   <PaymentsSection />,
    overview:   <OverviewSection />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 shrink-0 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/"><Image src={logo} alt="100ACRES" width={100} height={34} className="opacity-90" /></Link>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-200 truncate">{user?.firstName} {user?.lastName}</p>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold shrink-0">PRO</span>
            </div>
            <p className="text-xs text-gray-600 truncate">{BROKER.agency}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px m-4 bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.06]">
          {[
            { val: LISTINGS.filter(l => l.status === "active").length, label: "Active" },
            { val: newInquiries,                                         label: "New"    },
            { val: VISITS.filter(v => v.status === "confirmed").length,  label: "Visits" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d14] text-center py-3">
              <p className="text-base font-bold text-amber-500 font-serif">{s.val}</p>
              <p className="text-[10px] text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 px-2 mb-2">Broker Tools</p>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-all ${section === item.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]"}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${section === item.id ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-5 pt-4 border-t border-white/[0.06] flex flex-col gap-1">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5">← Back to Home</Link>
          <a href="#" className="text-xs text-gray-600 hover:text-amber-400 transition-colors px-3 py-1.5">Help & Support</a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.05] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-200 font-serif">{NAV.find(n => n.id === section)?.label}</h1>
            <p className="text-xs text-gray-600">
              {BROKER.agency} · {newInquiries > 0 ? `${newInquiries} new inquir${newInquiries > 1 ? "ies" : "y"} waiting` : "All caught up ✓"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {newInquiries > 0 && (
              <button onClick={() => setSection("inquiries")}
                className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-500/15 transition-all">
                💬 {newInquiries} new
              </button>
            )}
            <button onClick={() => setSection("properties")}
              className="text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 transition-all">
              + Add Listing
            </button>
          </div>
        </header>

        <div className="p-8">{SECTION_MAP[section]}</div>
      </main>
    </div>
  );
}
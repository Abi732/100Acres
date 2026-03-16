"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import logo from "@/assets/transparentlogo.png";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const SAVED = [
  { id: 1, title: "Skyline Residency",  type: "2 BHK Flat",     city: "Mumbai",    locality: "Bandra West",   price: 45000,  img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", tag: "Premium",  tagColor: "bg-amber-500",  saved: true },
  { id: 2, title: "Green Valley Homes", type: "3 BHK Apartment", city: "Bengaluru", locality: "Whitefield",    price: 38000,  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", tag: "Hot Deal", tagColor: "bg-red-500",    saved: true },
  { id: 3, title: "Lotus Grand Studio", type: "1 BHK Studio",    city: "Pune",      locality: "Koregaon Park", price: 21000,  img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", tag: "New",      tagColor: "bg-emerald-500",saved: true },
  { id: 4, title: "Emerald Towers",     type: "4 BHK Penthouse", city: "Delhi",     locality: "Vasant Kunj",   price: 120000, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", tag: "Luxury",   tagColor: "bg-amber-500",  saved: true },
];

const INQUIRIES = [
  { id: 1, property: "Skyline Residency", broker: "Rajesh Kumar", brokerAvatar: "RK", lastMsg: "Sure, I can schedule a visit for this Saturday at 11am. Does that work for you?", time: "2 min ago",  status: "active",  unread: 2 },
  { id: 2, property: "Green Valley Homes",broker: "Sunita Rao",   brokerAvatar: "SR", lastMsg: "The owner has agreed to a 10% discount on deposit. Let me know if you'd like to proceed.", time: "1 hr ago",  status: "active",  unread: 1 },
  { id: 3, property: "Lotus Grand Studio",broker: "Anil Verma",   brokerAvatar: "AV", lastMsg: "Thank you for your interest! The property is still available.", time: "Yesterday", status: "pending", unread: 0 },
  { id: 4, property: "Saffron Heights",   broker: "Deepa Krishnan",brokerAvatar:"DK", lastMsg: "We've received your inquiry. We'll get back to you within 24 hours.",  time: "2 days ago",status: "closed",  unread: 0 },
];

const VISITS = [
  { id: 1, property: "Skyline Residency",  date: "2025-06-21", time: "11:00 AM", broker: "Rajesh Kumar",  status: "confirmed", city: "Mumbai",    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&q=80" },
  { id: 2, property: "Green Valley Homes", date: "2025-06-24", time: "3:00 PM",  broker: "Sunita Rao",    status: "pending",   city: "Bengaluru", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80" },
  { id: 3, property: "Lotus Grand Studio", date: "2025-06-18", time: "10:30 AM", broker: "Anil Verma",    status: "completed", city: "Pune",      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=80" },
  { id: 4, property: "Emerald Towers",     date: "2025-06-28", time: "5:00 PM",  broker: "Vikram Singh",  status: "confirmed", city: "Delhi",     img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80" },
];

const ISSUES = [
  { id: 1, title: "AC not working in bedroom",     property: "Skyline Residency",  raised: "Jun 10, 2025", status: "in-progress", priority: "high",   category: "Electrical", updates: 3 },
  { id: 2, title: "Water leakage from bathroom tap",property: "Green Valley Homes", raised: "Jun 05, 2025", status: "resolved",    priority: "medium", category: "Plumbing",   updates: 5 },
  { id: 3, title: "Broken window latch in living room",property:"Lotus Grand Studio",raised:"Jun 14, 2025",status: "open",        priority: "low",    category: "Carpentry",  updates: 1 },
  { id: 4, title: "Elevator out of service",       property: "Emerald Towers",      raised: "Jun 16, 2025", status: "open",        priority: "high",   category: "Electrical", updates: 0 },
];

const AGREEMENTS = [
  { id: 1, property: "Skyline Residency",  type: "Rental Agreement", start: "Jan 01, 2025", end: "Dec 31, 2025", rent: 45000,  deposit: 90000,  status: "active",  nextDue: "Jul 01, 2025" },
  { id: 2, property: "Green Valley Homes", type: "Rental Agreement", start: "Mar 15, 2025", end: "Mar 14, 2026", rent: 38000,  deposit: 114000, status: "active",  nextDue: "Jul 15, 2025" },
  { id: 3, property: "Lotus Grand Studio", type: "Rental Agreement", start: "Aug 01, 2024", end: "Jul 31, 2025", rent: 21000,  deposit: 42000,  status: "expiring", nextDue: "Jul 01, 2025" },
];

const PAYMENTS = [
  { id: 1, desc: "Rent — Skyline Residency",   amount: 45000, date: "Jun 01, 2025", status: "paid",    mode: "UPI" },
  { id: 2, desc: "Rent — Green Valley Homes",  amount: 38000, date: "Jun 15, 2025", status: "paid",    mode: "NEFT" },
  { id: 3, desc: "Rent — Skyline Residency",   amount: 45000, date: "Jul 01, 2025", status: "due",     mode: "—" },
  { id: 4, desc: "Maintenance — Skyline Residency", amount: 2500, date: "Jun 10, 2025", status: "paid", mode: "UPI" },
  { id: 5, desc: "Rent — Lotus Grand Studio",  amount: 21000, date: "Jul 01, 2025", status: "overdue", mode: "—" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────

const statusStyles = {
  active:      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  closed:      "bg-gray-500/15 text-gray-400 border-gray-500/30",
  confirmed:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  completed:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "in-progress":"bg-amber-500/15 text-amber-400 border-amber-500/30",
  resolved:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  open:        "bg-red-500/15 text-red-400 border-red-500/30",
  paid:        "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  due:         "bg-amber-500/15 text-amber-400 border-amber-500/30",
  overdue:     "bg-red-500/15 text-red-400 border-red-500/30",
  expiring:    "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const priorityDot = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-emerald-500" };

const NAV = [
  { id: "saved",      icon: "♥", label: "Saved Properties",  badge: SAVED.length },
  { id: "inquiries",  icon: "💬", label: "Inquiries",         badge: INQUIRIES.filter(i => i.unread > 0).length },
  { id: "visits",     icon: "📅", label: "Scheduled Visits",  badge: VISITS.filter(v => v.status === "confirmed").length },
  { id: "issues",     icon: "🔧", label: "Maintenance Issues",badge: ISSUES.filter(i => i.status === "open").length },
  { id: "agreements", icon: "📄", label: "Agreements & Payments", badge: 0 },
];

// ── SUB-SECTIONS ───────────────────────────────────────────────────────────────

function SavedSection() {
  const [saved, setSaved] = useState(SAVED.map(p => p.id));
  const toggle = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div>
      <SectionHeader title="Saved Properties" sub={`${saved.length} properties in your wishlist`} />
      {saved.length === 0 ? (
        <Empty icon="♥" msg="No saved properties yet." cta="Browse Listings" href="/" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {SAVED.filter(p => saved.includes(p.id)).map(p => (
            <div key={p.id} className="group bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <div className="relative h-44 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-3 left-3 ${p.tagColor} text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>{p.tag}</span>
                <button onClick={() => toggle(p.id)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-red-500/80 rounded-full flex items-center justify-center text-sm transition-all">♥</button>
                <span className="absolute bottom-3 left-3 text-white font-bold text-base font-serif">₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal opacity-75">/mo</span></span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-100 text-sm font-serif mb-0.5">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.type} · {p.locality}, {p.city}</p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/customer/${p.id}`} className="flex-1 text-center text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 py-2 rounded-lg transition-all">View Details</Link>
                  <button className="flex-1 text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-300 py-2 rounded-lg transition-all">Contact Broker</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InquiriesSection() {
  const [active, setActive] = useState(INQUIRIES[0].id);
  const chat = INQUIRIES.find(i => i.id === active);

  const MOCK_MESSAGES = {
    1: [
      { from: "me",     text: "Hi, I'm interested in Skyline Residency. Is it still available?", time: "10:02 AM" },
      { from: "broker", text: "Yes it is! It's a beautiful 2BHK on the 5th floor with sea view.", time: "10:05 AM" },
      { from: "me",     text: "Can we schedule a visit this weekend?", time: "10:08 AM" },
      { from: "broker", text: "Sure, I can schedule a visit for this Saturday at 11am. Does that work for you?", time: "10:10 AM" },
    ],
    2: [
      { from: "me",     text: "Is there any flexibility on the deposit amount?", time: "9:00 AM" },
      { from: "broker", text: "Let me check with the owner.", time: "9:05 AM" },
      { from: "broker", text: "The owner has agreed to a 10% discount on deposit. Let me know if you'd like to proceed.", time: "9:45 AM" },
    ],
    3: [{ from: "broker", text: "Thank you for your interest! The property is still available.", time: "Yesterday" }],
    4: [{ from: "broker", text: "We've received your inquiry. We'll get back to you within 24 hours.", time: "2 days ago" }],
  };

  return (
    <div>
      <SectionHeader title="Active Inquiries" sub="Your conversations with brokers" />
      <div className="flex gap-4 h-[520px]">
        {/* List */}
        <div className="w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {INQUIRIES.map(i => (
            <button key={i.id} onClick={() => setActive(i.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${active === i.id ? "bg-amber-500/10 border-amber-500/40" : "bg-white/[0.03] border-white/[0.07] hover:border-white/15"}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-semibold text-gray-200 truncate pr-2">{i.property}</span>
                {i.unread > 0 && <span className="bg-amber-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">{i.unread}</span>}
              </div>
              <p className="text-xs text-gray-500 mb-1.5">{i.broker}</p>
              <p className="text-xs text-gray-500 truncate">{i.lastMsg}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-[10px] border px-2 py-0.5 rounded-full ${statusStyles[i.status]}`}>{i.status}</span>
                <span className="text-[10px] text-gray-600">{i.time}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">{chat.brokerAvatar}</div>
            <div>
              <p className="text-sm font-semibold text-gray-200">{chat.broker}</p>
              <p className="text-xs text-gray-500">{chat.property}</p>
            </div>
            <span className={`ml-auto text-[10px] border px-2.5 py-1 rounded-full ${statusStyles[chat.status]}`}>{chat.status}</span>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {(MOCK_MESSAGES[active] || []).map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-amber-500/20 text-amber-100 rounded-br-sm" : "bg-white/[0.07] text-gray-300 rounded-bl-sm"}`}>
                  <p>{m.text}</p>
                  <p className="text-[10px] opacity-50 mt-1 text-right">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.07] flex gap-2">
            <input className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-amber-500/40" placeholder="Type a message..." />
            <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitsSection() {
  const statusLabel = { confirmed: "Confirmed", pending: "Pending", completed: "Completed" };
  const upcoming = VISITS.filter(v => v.status !== "completed");
  const past = VISITS.filter(v => v.status === "completed");

  return (
    <div>
      <SectionHeader title="Scheduled Visits" sub="Upcoming and past property visits" />

      <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Upcoming</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {upcoming.map(v => (
          <div key={v.id} className="flex gap-4 p-4 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl transition-all group">
            <img src={v.img} alt={v.property} className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-gray-200 font-serif truncate pr-2">{v.property}</h3>
                <span className={`text-[10px] border px-2 py-0.5 rounded-full shrink-0 ${statusStyles[v.status]}`}>{statusLabel[v.status]}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{v.city} · {v.broker}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">📅 {new Date(v.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="flex items-center gap-1">🕐 {v.time}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-[11px] font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-3 py-1.5 rounded-lg transition-all">Reschedule</button>
                <button className="text-[11px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-all">Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Completed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {past.map(v => (
              <div key={v.id} className="flex gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl opacity-70">
                <img src={v.img} alt={v.property} className="w-20 h-20 rounded-xl object-cover shrink-0 grayscale" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold text-gray-400 font-serif truncate pr-2">{v.property}</h3>
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full shrink-0 ${statusStyles[v.status]}`}>{statusLabel[v.status]}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{v.city} · {v.broker}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-[11px] font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded-lg transition-all">Write Review</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function IssuesSection() {
  const [modal, setModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <SectionHeader title="Maintenance Issues" sub="Track and raise property issues" nomb />
        <button onClick={() => setModal(true)} className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all shrink-0">
          + Raise Issue
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {ISSUES.map(issue => (
          <div key={issue.id} className="flex gap-4 items-start p-5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/25 rounded-2xl transition-all group">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${priorityDot[issue.priority]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-200">{issue.title}</h3>
                <span className={`text-[10px] border px-2.5 py-0.5 rounded-full ${statusStyles[issue.status]}`}>{issue.status.replace("-", " ")}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{issue.property} · <span className="text-gray-600">{issue.category}</span></p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>📅 Raised {issue.raised}</span>
                <span>💬 {issue.updates} update{issue.updates !== 1 ? "s" : ""}</span>
                <span className={`font-semibold capitalize ${issue.priority === "high" ? "text-red-400" : issue.priority === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                  {issue.priority} priority
                </span>
              </div>
            </div>
            <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">View →</button>
          </div>
        ))}
      </div>

      {/* New Issue Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setModal(false)}>
          <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-100 font-serif mb-5">Raise a New Issue</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Property</label>
                <select className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-amber-500/40 appearance-none">
                  {SAVED.map(p => <option key={p.id} value={p.id} className="bg-[#111]">{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Category</label>
                <select className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-amber-500/40 appearance-none">
                  {["Plumbing", "Electrical", "Carpentry", "Pest Control", "Housekeeping", "Other"].map(c => <option key={c} className="bg-[#111]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Issue Title</label>
                <input className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40" placeholder="Brief description of the issue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Details</label>
                <textarea rows={3} className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40 resize-none" placeholder="Describe the issue in detail..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Priority</label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map(p => (
                    <button key={p} className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${p === "High" ? "border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20" : p === "Medium" ? "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20" : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-1">
                <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 transition-all">Cancel</button>
                <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/30 transition-all">Submit Issue</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgreementsSection() {
  const [tab, setTab] = useState("agreements");

  return (
    <div>
      <SectionHeader title="Agreements & Payments" sub="Your rental agreements and payment history" />

      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-6">
        {[{ id: "agreements", label: "📄 Agreements" }, { id: "payments", label: "💳 Payments" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "agreements" && (
        <div className="flex flex-col gap-4">
          {AGREEMENTS.map(a => (
            <div key={a.id} className="p-5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/25 rounded-2xl transition-all">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 font-serif">{a.property}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{a.type}</p>
                </div>
                <span className={`text-[10px] border px-2.5 py-1 rounded-full h-fit ${statusStyles[a.status]}`}>{a.status}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { label: "Start Date", val: a.start },
                  { label: "End Date",   val: a.end },
                  { label: "Monthly Rent", val: `₹${a.rent.toLocaleString("en-IN")}` },
                  { label: "Deposit",    val: `₹${a.deposit.toLocaleString("en-IN")}` },
                ].map(f => (
                  <div key={f.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-gray-600 mb-1">{f.label}</p>
                    <p className="text-gray-300 font-semibold">{f.val}</p>
                  </div>
                ))}
              </div>
              {a.status === "expiring" && (
                <div className="mt-3 flex items-center gap-2 text-xs bg-orange-500/10 border border-orange-500/25 text-orange-400 px-4 py-2.5 rounded-xl">
                  ⚠️ Agreement expiring on {a.end} — consider renewing soon.
                  <button className="ml-auto font-bold hover:text-orange-300 transition-colors">Renew →</button>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-4 py-2 rounded-lg transition-all">📥 Download PDF</button>
                <button className="text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-4 py-2 rounded-lg transition-all">Pay Rent — Next due {a.nextDue}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["Description", "Date", "Amount", "Mode", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p, i) => (
                <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === PAYMENTS.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-5 py-4 text-gray-300 font-medium">{p.desc}</td>
                  <td className="px-5 py-4 text-gray-500">{p.date}</td>
                  <td className="px-5 py-4 text-gray-200 font-semibold font-serif">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-gray-500">{p.mode}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] border px-2.5 py-1 rounded-full ${statusStyles[p.status]}`}>{p.status}</span>
                    {p.status !== "paid" && (
                      <button className="ml-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors">Pay Now</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────────

function SectionHeader({ title, sub, nomb = false }) {
  return (
    <div className={nomb ? "" : "mb-6"}>
      <h2 className="text-2xl font-bold text-gray-100 font-serif">{title}</h2>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function Empty({ icon, msg, cta, href }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-30">{icon}</div>
      <p className="text-gray-500 mb-5">{msg}</p>
      <Link href={href} className="bg-amber-500/15 border border-amber-500/30 text-amber-400 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-500/25 transition-all">{cta}</Link>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [section, setSection] = useState("saved");

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isSignedIn) {
    router.push("/");
    return null;
  }

  const SECTION_MAP = { saved: <SavedSection />, inquiries: <InquiriesSection />, visits: <VisitsSection />, issues: <IssuesSection />, agreements: <AgreementsSection /> };

  const totalUnread = INQUIRIES.reduce((s, i) => s + i.unread, 0);
  const openIssues  = ISSUES.filter(i => i.status === "open").length;
  const upcomingVisits = VISITS.filter(v => v.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 shrink-0 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/">
            <Image src={logo} alt="100ACRES" width={100} height={34} className="opacity-90" />
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-200 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-600 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-px m-4 bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.06]">
          {[
            { val: SAVED.length,   label: "Saved" },
            { val: totalUnread,    label: "Unread" },
            { val: upcomingVisits, label: "Visits" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d14] text-center py-3">
              <p className="text-lg font-bold text-amber-500 font-serif">{s.val}</p>
              <p className="text-[10px] text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 px-2 mb-2">Dashboard</p>
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

        {/* Footer links */}
        <div className="px-4 pb-5 border-t border-white/[0.06] pt-4 flex flex-col gap-1">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5">← Back to Home</Link>
          <Link href={`/customer/${SAVED[0]?.id}`} className="text-xs text-gray-600 hover:text-amber-400 transition-colors px-3 py-1.5">Browse Listings</Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.05] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-200 font-serif">
              {NAV.find(n => n.id === section)?.label}
            </h1>
            <p className="text-xs text-gray-600">Welcome back, {user?.firstName || "there"} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            {openIssues > 0 && (
              <button onClick={() => setSection("issues")} className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-500/15 transition-all">
                🔧 {openIssues} open issue{openIssues > 1 ? "s" : ""}
              </button>
            )}
            <Link href="/" className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl transition-all">+ Browse More</Link>
          </div>
        </header>

        {/* Section content */}
        <div className="p-8">
          {SECTION_MAP[section]}
        </div>
      </main>

    </div>
  );
}
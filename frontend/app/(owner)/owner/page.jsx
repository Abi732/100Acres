"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import logo from "@/assets/transparentlogo.png";

// ── MOCK DATA ──────────────────────────────────────────────────────────────────

const PROPERTIES = [
  { id: 1, title: "Skyline Residency",  type: "2 BHK Flat",      city: "Mumbai",    locality: "Bandra West",   price: 45000,  status: "occupied",  tenant: "Arjun Mehta",   img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80", sqft: 980,  yield: "6.2%", value: "₹87L" },
  { id: 2, title: "Green Valley Homes", type: "3 BHK Apartment",  city: "Bengaluru", locality: "Whitefield",    price: 38000,  status: "occupied",  tenant: "Priya Sharma",  img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", sqft: 1350, yield: "5.8%", value: "₹79L" },
  { id: 3, title: "Lotus Grand Studio", type: "1 BHK Studio",     city: "Pune",      locality: "Koregaon Park", price: 21000,  status: "vacant",    tenant: null,            img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80", sqft: 550,  yield: "5.1%", value: "₹49L" },
  { id: 4, title: "Saffron Heights",    type: "2 BHK Flat",       city: "Chennai",   locality: "Anna Nagar",    price: 28000,  status: "occupied",  tenant: "Sneha Kapoor",  img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80", sqft: 1050, yield: "5.4%", value: "₹62L" },
];

const TENANTS = [
  { id: 1, name: "Arjun Mehta",   avatar: "AM", property: "Skyline Residency",  city: "Mumbai",    rent: 45000,  deposit: 90000,  leaseStart: "Jan 01, 2025", leaseEnd: "Dec 31, 2025", status: "active",   phone: "+91 98001 11222", email: "arjun@email.com",  paymentStatus: "paid",    nextDue: "Jul 01, 2025" },
  { id: 2, name: "Priya Sharma",  avatar: "PS", property: "Green Valley Homes", city: "Bengaluru", rent: 38000,  deposit: 114000, leaseStart: "Mar 15, 2025", leaseEnd: "Mar 14, 2026", status: "active",   phone: "+91 87002 22333", email: "priya@email.com",  paymentStatus: "paid",    nextDue: "Jul 15, 2025" },
  { id: 3, name: "Sneha Kapoor",  avatar: "SK", property: "Saffron Heights",    city: "Chennai",   rent: 28000,  deposit: 56000,  leaseStart: "Feb 01, 2025", leaseEnd: "Jan 31, 2026", status: "active",   phone: "+91 65004 44555", email: "sneha@email.com",  paymentStatus: "overdue", nextDue: "Jun 01, 2025" },
];

const PAYMENTS = [
  { id: 1, tenant: "Arjun Mehta",  property: "Skyline Residency",  amount: 45000, date: "Jun 01, 2025", status: "paid",    mode: "UPI",   month: "June 2025"  },
  { id: 2, tenant: "Priya Sharma", property: "Green Valley Homes", amount: 38000, date: "Jun 15, 2025", status: "paid",    mode: "NEFT",  month: "June 2025"  },
  { id: 3, tenant: "Sneha Kapoor", property: "Saffron Heights",    amount: 28000, date: "—",            status: "overdue", mode: "—",     month: "June 2025"  },
  { id: 4, tenant: "Arjun Mehta",  property: "Skyline Residency",  amount: 45000, date: "—",            status: "due",     mode: "—",     month: "July 2025"  },
  { id: 5, tenant: "Priya Sharma", property: "Green Valley Homes", amount: 38000, date: "—",            status: "due",     mode: "—",     month: "July 2025"  },
  { id: 6, tenant: "Arjun Mehta",  property: "Skyline Residency",  amount: 45000, date: "May 01, 2025", status: "paid",    mode: "UPI",   month: "May 2025"   },
  { id: 7, tenant: "Priya Sharma", property: "Green Valley Homes", amount: 38000, date: "May 15, 2025", status: "paid",    mode: "NEFT",  month: "May 2025"   },
  { id: 8, tenant: "Sneha Kapoor", property: "Saffron Heights",    amount: 28000, date: "May 03, 2025", status: "paid",    mode: "Cheque",month: "May 2025"   },
];

const ISSUES = [
  { id: 1, title: "AC not working in bedroom",      tenant: "Arjun Mehta",  avatar: "AM", property: "Skyline Residency",  raised: "Jun 10, 2025", status: "in-progress", priority: "high",   category: "Electrical", updates: 3, description: "The AC in master bedroom stopped working. Needs immediate attention as it's very hot." },
  { id: 2, title: "Water leakage from bathroom tap", tenant: "Priya Sharma", avatar: "PS", property: "Green Valley Homes", raised: "Jun 05, 2025", status: "resolved",    priority: "medium", category: "Plumbing",   updates: 5, description: "There is a persistent drip from the cold water tap in the main bathroom." },
  { id: 3, title: "Broken window latch",             tenant: "Sneha Kapoor", avatar: "SK", property: "Saffron Heights",    raised: "Jun 14, 2025", status: "open",        priority: "low",    category: "Carpentry",  updates: 1, description: "The window latch in the living room is broken and cannot be secured." },
  { id: 4, title: "Elevator out of service",         tenant: "Arjun Mehta",  avatar: "AM", property: "Skyline Residency",  raised: "Jun 16, 2025", status: "open",        priority: "high",   category: "Electrical", updates: 0, description: "The main elevator has been non-functional for 2 days. Society needs to fix urgently." },
];

const DOCUMENTS = [
  { id: 1, name: "Rental Agreement — Skyline Residency",  tenant: "Arjun Mehta",  type: "Agreement", date: "Jan 01, 2025", size: "1.2 MB", icon: "📄" },
  { id: 2, name: "Rental Agreement — Green Valley Homes", tenant: "Priya Sharma", type: "Agreement", date: "Mar 15, 2025", size: "1.1 MB", icon: "📄" },
  { id: 3, name: "Rental Agreement — Saffron Heights",    tenant: "Sneha Kapoor", type: "Agreement", date: "Feb 01, 2025", size: "0.9 MB", icon: "📄" },
  { id: 4, name: "Rent Receipt — Jun 2025 (Skyline)",     tenant: "Arjun Mehta",  type: "Receipt",   date: "Jun 01, 2025", size: "0.2 MB", icon: "🧾" },
  { id: 5, name: "Rent Receipt — Jun 2025 (Green Valley)",tenant: "Priya Sharma", type: "Receipt",   date: "Jun 15, 2025", size: "0.2 MB", icon: "🧾" },
  { id: 6, name: "NOC — Skyline Residency",               tenant: "—",            type: "Legal",     date: "Dec 10, 2024", size: "0.5 MB", icon: "⚖️" },
  { id: 7, name: "Property Tax Receipt 2024–25",          tenant: "—",            type: "Tax",       date: "Apr 01, 2025", size: "0.3 MB", icon: "🏛️" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────────

const SS = {
  occupied:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  vacant:       "bg-amber-500/15 text-amber-400 border-amber-500/30",
  active:       "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  paid:         "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  due:          "bg-amber-500/15 text-amber-400 border-amber-500/30",
  overdue:      "bg-red-500/15 text-red-400 border-red-500/30",
  open:         "bg-red-500/15 text-red-400 border-red-500/30",
  "in-progress":"bg-amber-500/15 text-amber-400 border-amber-500/30",
  resolved:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const PRIORITY_DOT = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-emerald-500" };

const NAV = [
  { id: "properties", icon: "🏠", label: "My Properties",       badge: PROPERTIES.filter(p => p.status === "vacant").length },
  { id: "tenants",    icon: "👤", label: "Renter Management",   badge: TENANTS.filter(t => t.paymentStatus === "overdue").length },
  { id: "payments",   icon: "💰", label: "Rent Collection",     badge: PAYMENTS.filter(p => p.status === "overdue").length },
  { id: "issues",     icon: "🔧", label: "Maintenance",         badge: ISSUES.filter(i => i.status === "open").length },
  { id: "documents",  icon: "📁", label: "Documents",           badge: 0 },
];

const inputCls = "w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 outline-none focus:border-amber-500/40 appearance-none";

// ── SHARED UI ──────────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-1">{eyebrow}</p>
      <h2 className="text-2xl font-bold text-gray-100 font-serif">{title}</h2>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#16161e] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-100 font-serif">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function ModalActions({ onClose, onSubmit, submitLabel, destructive = false }) {
  return (
    <div className="flex gap-3 mt-2">
      <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-white/[0.06] text-gray-400 hover:bg-white/10 transition-all">Cancel</button>
      <button onClick={onSubmit} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${destructive ? "bg-red-500/80 hover:bg-red-500 text-white" : "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/25"}`}>{submitLabel}</button>
    </div>
  );
}

// ── SECTIONS ───────────────────────────────────────────────────────────────────

function PropertiesSection() {
  const [addModal, setAddModal] = useState(false);
  const totalRent = PROPERTIES.filter(p => p.status === "occupied").reduce((s, p) => s + p.price, 0);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <SectionHeader eyebrow="Property Overview" title="My Properties" />
        <button onClick={() => setAddModal(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all">
          + Add Property
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Properties", val: PROPERTIES.length,                                        color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
          { label: "Occupied",         val: PROPERTIES.filter(p=>p.status==="occupied").length,       color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Vacant",           val: PROPERTIES.filter(p=>p.status==="vacant").length,         color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
          { label: "Monthly Income",   val: `₹${totalRent.toLocaleString("en-IN")}`,                  color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className={`text-2xl font-black font-serif ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Property cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROPERTIES.map(p => (
          <div key={p.id} className="group bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/35 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <div className="relative h-44 overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold border px-2.5 py-1 rounded-full ${SS[p.status]}`}>
                {p.status}
              </span>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="text-white font-bold text-lg font-serif">₹{p.price.toLocaleString("en-IN")}<span className="text-xs font-normal opacity-75">/mo</span></span>
                <span className="text-xs text-gray-300 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">Yield {p.yield}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-sm font-bold text-gray-200 font-serif">{p.title}</h3>
                  <p className="text-xs text-gray-500">{p.type} · {p.locality}, {p.city} · {p.sqft} sqft</p>
                </div>
                <p className="text-xs text-gray-500 shrink-0 ml-2">Est. {p.value}</p>
              </div>
              {p.tenant ? (
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-emerald-500/[0.07] border border-emerald-500/15 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {p.tenant.split(" ").map(n=>n[0]).join("")}
                  </span>
                  <p className="text-xs text-emerald-400 font-semibold">{p.tenant}</p>
                  <span className="ml-auto text-[10px] text-emerald-600">Current Tenant</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-amber-500/[0.07] border border-amber-500/15 rounded-xl">
                  <span className="text-xs text-amber-400 font-semibold">⚠️ Vacant — no tenant assigned</span>
                  <Link href="/broker/broker" className="ml-auto text-[10px] text-amber-500 hover:text-amber-400 font-bold transition-colors">Find Tenant →</Link>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Link href={`/customer/${p.id}`} target="_blank" className="flex-1 text-center text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 py-2 rounded-lg transition-all">View Listing</Link>
                <button className="flex-1 text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 py-2 rounded-lg transition-all">Edit Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {addModal && (
        <Modal title="Add New Property" onClose={() => setAddModal(false)}>
          <div className="flex flex-col gap-4">
            <FormRow label="Property Title"><input className={inputCls} placeholder="e.g. Skyline Residency" /></FormRow>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="City">
                <select className={inputCls}>{["Mumbai","Delhi","Bengaluru","Hyderabad","Pune","Chennai"].map(c=><option key={c} className="bg-[#111]">{c}</option>)}</select>
              </FormRow>
              <FormRow label="Locality"><input className={inputCls} placeholder="Locality / Area" /></FormRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Type">
                <select className={inputCls}>{["1 BHK","2 BHK","3 BHK","4 BHK","Studio","PG"].map(t=><option key={t} className="bg-[#111]">{t}</option>)}</select>
              </FormRow>
              <FormRow label="Area (sqft)"><input className={inputCls} type="number" placeholder="1000" /></FormRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Monthly Rent (₹)"><input className={inputCls} type="number" placeholder="30000" /></FormRow>
              <FormRow label="Deposit (₹)"><input className={inputCls} type="number" placeholder="60000" /></FormRow>
            </div>
            <ModalActions onClose={() => setAddModal(false)} onSubmit={() => setAddModal(false)} submitLabel="Add Property" />
          </div>
        </Modal>
      )}
    </div>
  );
}

function TenantsSection() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <SectionHeader eyebrow="Renter Management" title="Current Tenants" />

      <div className="flex flex-col gap-4">
        {TENANTS.map(t => (
          <div key={t.id} className="p-5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/25 rounded-2xl transition-all group">
            <div className="flex flex-wrap gap-4 items-start">
              {/* Avatar + info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 text-amber-400 font-bold text-base flex items-center justify-center shrink-0">
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-200 font-serif">{t.name}</h3>
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full ${SS[t.paymentStatus]}`}>{t.paymentStatus}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{t.property} · {t.city}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-600 flex-wrap">
                    <span>📞 {t.phone}</span>
                    <span>✉️ {t.email}</span>
                  </div>
                </div>
              </div>

              {/* Lease & rent info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                {[
                  { label: "Monthly Rent",  val: `₹${t.rent.toLocaleString("en-IN")}` },
                  { label: "Deposit Held",  val: `₹${t.deposit.toLocaleString("en-IN")}` },
                  { label: "Lease Start",   val: t.leaseStart },
                  { label: "Lease End",     val: t.leaseEnd },
                ].map(f => (
                  <div key={f.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-600 mb-1">{f.label}</p>
                    <p className="text-xs font-semibold text-gray-300">{f.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next due alert */}
            {t.paymentStatus === "overdue" && (
              <div className="mt-3 flex items-center gap-2 text-xs bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-2.5 rounded-xl">
                ⚠️ Rent overdue since {t.nextDue}
                <button className="ml-auto font-bold hover:text-red-300 transition-colors">Send Reminder →</button>
              </div>
            )}
            {t.paymentStatus === "paid" && (
              <div className="mt-3 flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2.5 rounded-xl">
                ✅ Rent paid — Next due {t.nextDue}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button onClick={() => setSelected(t)} className="text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-4 py-2 rounded-lg transition-all">View Details</button>
              <a href={`tel:${t.phone}`} className="text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 px-4 py-2 rounded-lg transition-all">📞 Call</a>
              <button className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-4 py-2 rounded-lg transition-all">Send Message</button>
              <button className="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all ml-auto">End Lease</button>
            </div>
          </div>
        ))}
      </div>

      {/* Tenant detail modal */}
      {selected && (
        <Modal title={`Tenant — ${selected.name}`} onClose={() => setSelected(null)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/[0.04] rounded-xl border border-white/[0.07]">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 font-bold text-lg flex items-center justify-center shrink-0">{selected.avatar}</div>
              <div>
                <p className="text-sm font-bold text-gray-200">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.email}</p>
                <p className="text-xs text-gray-500">{selected.phone}</p>
              </div>
              <span className={`ml-auto text-[10px] border px-2.5 py-1 rounded-full ${SS[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Property",     val: selected.property },
                { label: "City",         val: selected.city },
                { label: "Monthly Rent", val: `₹${selected.rent.toLocaleString("en-IN")}` },
                { label: "Deposit",      val: `₹${selected.deposit.toLocaleString("en-IN")}` },
                { label: "Lease Start",  val: selected.leaseStart },
                { label: "Lease End",    val: selected.leaseEnd },
              ].map(f => (
                <div key={f.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3">
                  <p className="text-[10px] text-gray-600 mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-300">{f.val}</p>
                </div>
              ))}
            </div>
            <ModalActions onClose={() => setSelected(null)} onSubmit={() => setSelected(null)} submitLabel="Send Message" />
          </div>
        </Modal>
      )}
    </div>
  );
}

function PaymentsSection() {
  const [filter, setFilter] = useState("all");
  const received = PAYMENTS.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const overdue  = PAYMENTS.filter(p => p.status === "overdue").reduce((s, p) => s + p.amount, 0);
  const due      = PAYMENTS.filter(p => p.status === "due").reduce((s, p) => s + p.amount, 0);

  const filtered = PAYMENTS.filter(p => filter === "all" ? true : p.status === filter);

  return (
    <div>
      <SectionHeader eyebrow="Rent Collection" title="Payment Tracker" />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {[
          { label: "Collected (June)",  val: `₹${received.toLocaleString("en-IN")}`, icon: "✅", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { label: "Overdue",           val: `₹${overdue.toLocaleString("en-IN")}`,  icon: "⚠️", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
          { label: "Upcoming (July)",   val: `₹${due.toLocaleString("en-IN")}`,      icon: "🗓️", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className={`text-2xl font-black font-serif ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-5">
        {[
          { id: "all",     label: "All" },
          { id: "paid",    label: "Paid" },
          { id: "due",     label: "Upcoming" },
          { id: "overdue", label: "Overdue" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f.id ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {["Tenant", "Property", "Month", "Amount", "Date", "Mode", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-600 first:pl-5 last:pr-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}>
                <td className="px-4 py-4 pl-5 text-gray-300 font-medium">{p.tenant}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{p.property}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{p.month}</td>
                <td className="px-4 py-4 text-gray-200 font-bold font-serif">₹{p.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{p.date}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{p.mode}</td>
                <td className="px-4 py-4 pr-5">
                  <span className={`text-[11px] border px-2.5 py-1 rounded-full ${SS[p.status]}`}>{p.status}</span>
                  {p.status === "overdue" && (
                    <button className="ml-2 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors">Remind</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IssuesSection() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  const filtered = ISSUES.filter(i => filter === "all" ? true : i.status === filter);

  const statusActions = {
    open:         { label: "Mark In Progress", next: "in-progress", color: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25" },
    "in-progress":{ label: "Mark Resolved",    next: "resolved",    color: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" },
    resolved:     { label: "Reopen Issue",     next: "open",        color: "bg-red-500/10 text-red-400 hover:bg-red-500/20" },
  };

  return (
    <div>
      <SectionHeader eyebrow="Maintenance" title="Issue Tracker" />

      {/* Stats */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: "Open",        count: ISSUES.filter(i=>i.status==="open").length,         color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
          { label: "In Progress", count: ISSUES.filter(i=>i.status==="in-progress").length,  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
          { label: "Resolved",    count: ISSUES.filter(i=>i.status==="resolved").length,     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl px-4 py-3 text-center min-w-[90px]`}>
            <p className={`text-xl font-black font-serif ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-5">
        {["all","open","in-progress","resolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
            {f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(issue => (
          <div key={issue.id} className="flex gap-4 items-start p-5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/25 rounded-2xl transition-all group">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${PRIORITY_DOT[issue.priority]}`} />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                {issue.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-gray-200">{issue.title}</h3>
                <span className={`text-[10px] border px-2.5 py-0.5 rounded-full ${SS[issue.status]}`}>
                  {issue.status.replace("-", " ")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                <span className="text-gray-400 font-semibold">{issue.tenant}</span> · {issue.property} · {issue.category}
              </p>
              <p className="text-xs text-gray-600 mb-2 line-clamp-1">{issue.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                <span>📅 Raised {issue.raised}</span>
                <span>💬 {issue.updates} update{issue.updates !== 1 ? "s" : ""}</span>
                <span className={`font-semibold capitalize ${issue.priority === "high" ? "text-red-400" : issue.priority === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                  {issue.priority} priority
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
              <button onClick={() => setSelected(issue)}
                className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-3 py-2 rounded-lg transition-all">
                Details
              </button>
              <button className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all ${statusActions[issue.status].color}`}>
                {statusActions[issue.status].label}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Issue detail modal */}
      {selected && (
        <Modal title="Issue Details" onClose={() => setSelected(null)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-white/[0.04] rounded-xl border border-white/[0.07]">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${PRIORITY_DOT[selected.priority]}`} />
              <div>
                <p className="text-sm font-bold text-gray-200">{selected.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.property} · {selected.category}</p>
              </div>
              <span className={`ml-auto text-[10px] border px-2.5 py-1 rounded-full shrink-0 ${SS[selected.status]}`}>
                {selected.status.replace("-"," ")}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1.5">Description</p>
              <p className="text-sm text-gray-400 leading-relaxed bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Raised by",  val: selected.tenant },
                { label: "Category",   val: selected.category },
                { label: "Date Raised",val: selected.raised },
                { label: "Priority",   val: selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1) },
              ].map(f => (
                <div key={f.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3">
                  <p className="text-[10px] text-gray-600 mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-300">{f.val}</p>
                </div>
              ))}
            </div>
            <FormRow label="Add Update / Note">
              <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Add a note or update for the tenant..." />
            </FormRow>
            <ModalActions onClose={() => setSelected(null)} onSubmit={() => setSelected(null)} submitLabel="Send Update to Tenant" />
          </div>
        </Modal>
      )}
    </div>
  );
}

function DocumentsSection() {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Agreement", "Receipt", "Legal", "Tax"];
  const filtered = DOCUMENTS.filter(d => filter === "All" ? true : d.type === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <SectionHeader eyebrow="Documents" title="Agreements & Receipts" />
        <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all">
          + Upload Document
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl w-fit mb-6 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === t ? "bg-amber-500/20 text-amber-400" : "text-gray-500 hover:text-gray-300"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(doc => (
          <div key={doc.id}
            className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-2xl shrink-0">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-200 truncate">{doc.name}</h3>
              <div className="flex gap-3 mt-0.5 text-xs text-gray-600 flex-wrap">
                <span>{doc.tenant !== "—" ? `👤 ${doc.tenant}` : "📋 General"}</span>
                <span>📅 {doc.date}</span>
                <span>💾 {doc.size}</span>
                <span className={`border px-2 py-0.5 rounded-full text-[10px] ${
                  doc.type === "Agreement" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  doc.type === "Receipt"   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  doc.type === "Legal"     ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                                             "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }`}>{doc.type}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 px-3 py-2 rounded-lg transition-all">View</button>
              <button className="text-xs font-semibold bg-white/[0.06] hover:bg-white/10 text-gray-400 px-3 py-2 rounded-lg transition-all">📥 Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function OwnerDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [section, setSection] = useState("properties");

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isSignedIn) { router.push("/"); return null; }

  const overdueCount = PAYMENTS.filter(p => p.status === "overdue").length;
  const openIssues   = ISSUES.filter(i => i.status === "open").length;
  const vacantCount  = PROPERTIES.filter(p => p.status === "vacant").length;

  const SECTION_MAP = {
    properties: <PropertiesSection />,
    tenants:    <TenantsSection />,
    payments:   <PaymentsSection />,
    issues:     <IssuesSection />,
    documents:  <DocumentsSection />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 shrink-0 bg-[#0d0d14] border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/"><Image src={logo} alt="100ACRES" width={100} height={34} className="opacity-90" /></Link>
          <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Owner Portal
          </span>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-200 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-600 truncate">Property Owner</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-px m-4 bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.06]">
          {[
            { val: PROPERTIES.length,                                           label: "Props"   },
            { val: TENANTS.length,                                              label: "Renters" },
            { val: `₹${(PROPERTIES.filter(p=>p.status==="occupied").reduce((s,p)=>s+p.price,0)/1000).toFixed(0)}k`, label: "Income" },
          ].map(s => (
            <div key={s.label} className="bg-[#0d0d14] text-center py-3">
              <p className="text-base font-bold text-amber-500 font-serif">{s.val}</p>
              <p className="text-[10px] text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 px-2 mb-2">Owner Tools</p>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-all ${
                section === item.id
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.05]"
              }`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${section === item.id ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-5 border-t border-white/[0.06] pt-4 flex flex-col gap-1">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5">← Back to Home</Link>
          <Link href="/broker/broker" className="text-xs text-gray-600 hover:text-amber-400 transition-colors px-3 py-1.5">Contact Broker</Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.05] px-8 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-200 font-serif">{NAV.find(n => n.id === section)?.label}</h1>
            <p className="text-xs text-gray-600">Welcome back, {user?.firstName || "Owner"} 👋</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {overdueCount > 0 && (
              <button onClick={() => setSection("payments")}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-500/15 transition-all">
                ⚠️ {overdueCount} overdue rent{overdueCount > 1 ? "s" : ""}
              </button>
            )}
            {openIssues > 0 && (
              <button onClick={() => setSection("issues")}
                className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-amber-500/15 transition-all">
                🔧 {openIssues} open issue{openIssues > 1 ? "s" : ""}
              </button>
            )}
            {vacantCount > 0 && (
              <button onClick={() => setSection("properties")}
                className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-500/15 transition-all">
                🏠 {vacantCount} vacant
              </button>
            )}
          </div>
        </header>

        <div className="p-8">
          {SECTION_MAP[section]}
        </div>
      </main>

    </div>
  );
}
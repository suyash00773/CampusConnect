import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Building2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.js';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    topic: 'Event Registration Query',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addToast('Thank you! Your message has been routed to the Student Welfare desk.', 'success');
      setForm({
        name: '',
        email: '',
        rollNo: '',
        topic: 'Event Registration Query',
        message: '',
      });
    }, 600);
  };

  return (
    <div className="bg-tech-bg text-tech-text pb-20">
      {/* Header */}
      <section className="border-b border-slate-800 bg-tech-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-tech-card border border-slate-700 text-xs font-semibold text-slate-300">
            <img src="/abes-logo.png" alt="ABES Engineering College" className="h-5 w-auto object-contain" />
            <span>Support & Inquiries Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact CampusConnect
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Need assistance with event gate passes, chapter charters, or venue reservations? Reach out to our campus desk.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white">Campus Information</h2>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Campus Address:</strong>
                    ABES Engineering College, 19th KM Stone, NH-09, Ghaziabad, Uttar Pradesh 201009
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Official Inquiries:</strong>
                    campusconnect@abes.ac.in
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Student Welfare Desk:</strong>
                    +91 (0120) 713-5112 (Ext. 240)
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Venues & Auditoriums:</strong>
                    Bhabha Auditorium, Ramanujan Seminar Hall & Kalpana Chawla Hall
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-tech-surface border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span>Student Ticket Support</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                If your registration ID was not generated or you cannot find your barcode pass, present your college ID card directly at Bhabha Auditorium reception.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-tech-surface border border-slate-800 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Send an Official Message</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fill out the form below and the appropriate student coordinator will respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-tech-card border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="Devansh Saxena"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-tech-card border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="devansh.22bcs104@abes.ac.in"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Roll / ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.rollNo}
                      onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-tech-card border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="2200320100088"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Topic / Subject
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-tech-card border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Event Registration Query">Event Registration Query</option>
                      <option value="Club Affiliation Request">Club Affiliation Request</option>
                      <option value="Hackathon Sponsorship">Hackathon Sponsorship</option>
                      <option value="Technical Bug / Pass Issue">Technical Bug / Pass Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-card border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Describe your inquiry or issue in detail..."
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Sending Message...' : 'Submit Inquiry'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

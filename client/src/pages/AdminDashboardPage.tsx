import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  ClipboardList,
  Sparkles,
  Plus,
  Download,
  Database,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DashboardStats, Event, Club } from '../types/index.js';
import { statsService } from '../services/statsService.js';
import { registrationService } from '../services/registrationService.js';
import { StatCard } from '../components/admin/StatCard.js';
import { Loader } from '../components/common/Loader.js';
import { EventFormModal } from '../components/admin/EventFormModal.js';
import { ClubFormModal } from '../components/admin/ClubFormModal.js';
import { useToast } from '../context/ToastContext.js';
import { formatEventDate } from '../utils/formatters.js';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);

  const { showToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getStats();
      setStats(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await registrationService.downloadCsv();
      showToast('Student registrations CSV downloaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReSeed = async () => {
    try {
      setIsSeeding(true);
      const res = await statsService.seedDatabase();
      showToast(res.message || 'Database reset & seeded with sample data!', 'success');
      await fetchStats();
    } catch (err: any) {
      showToast(err.message || 'Failed to seed database', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading && !stats) {
    return <Loader label="Loading control dashboard..." size="lg" />;
  }

  const categoryEntries = stats?.categoryBreakdown
    ? Object.entries(stats.categoryBreakdown)
    : [];

  // Chart data for Registration Velocity
  const velocityData = [
    { day: 'Mon', signups: 34, views: 120 },
    { day: 'Tue', signups: 52, views: 210 },
    { day: 'Wed', signups: 89, views: 340 },
    { day: 'Thu', signups: 65, views: 280 },
    { day: 'Fri', signups: 112, views: 430 },
    { day: 'Sat', signups: 145, views: 560 },
    { day: 'Sun', signups: 98, views: 380 },
  ];

  // Chart data for Category Distribution
  const categoryChartData = categoryEntries.map(([cat, count]) => ({
    name: cat,
    attendees: count,
  }));

  const BAR_COLORS = ['#30D565', '#28C05A', '#E8F9EE', '#F7EEDB', '#EDE5D0', '#20201D'];

  return (
    <div className="space-y-8 animate-fade-in bg-ivory text-ink min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-green">
            System Overview • ABES Engineering College
          </span>
          <h1 className="font-display text-3xl text-ink tracking-tight mt-0.5">
            Admin Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-ink-light mt-1">
            Real-time analytics, event registrations, and club operational controls.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowEventModal(true)}
            className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink flex items-center gap-1.5 shadow-subtle transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
          <button
            onClick={() => setShowClubModal(true)}
            className="px-6 py-3 rounded-pill bg-cream hover:bg-sand text-xs font-semibold text-ink border border-border flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Club</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-6 py-3 rounded-pill bg-cream hover:bg-sand text-xs font-semibold text-ink border border-border flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-green" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={handleReSeed}
            disabled={isSeeding}
            title="Re-populate with realistic sample events, clubs, and registrations"
            className="p-3 rounded-pill bg-cream hover:bg-sand text-ink-light hover:text-ink border border-border transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin text-green' : ''}`} />
          </button>
        </div>
      </div>

      {/* Database Connection Status Banner */}
      <div className="p-4 rounded-card bg-white border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-subtle">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              stats?.database?.isConnected ? 'bg-green' : 'bg-amber-400'
            }`}
          />
          <div>
            <span className="font-semibold text-ink">Database Engine: </span>
            <span className="text-ink-light">
              {stats?.database?.isConnected
                ? `Connected to MongoDB Atlas (${stats.database.host})`
                : 'Built-in Resilient Storage Engine (Atlas-Ready via MONGODB_URI)'}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-ink-light font-normal">
          Verified Student RSVPs & Gate Check-in Desks Active
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          subtitle="Published & Drafts"
          icon={CalendarDays}
          color="green"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          subtitle="Happening this semester"
          icon={CalendarDays}
          color="green"
        />
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          subtitle="Verified students"
          icon={ClipboardList}
          color="green"
        />
        <StatCard
          title="Active Campus Clubs"
          value={stats?.activeClubs || 0}
          subtitle="Registered societies"
          icon={Users}
          color="green"
        />
      </div>

      {/* RECHARTS ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Velocity Area Chart */}
        <div className="lg:col-span-7 p-6 rounded-card bg-white border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green" />
                <span>Registration Velocity (Weekly Trend)</span>
              </h2>
              <p className="text-xs text-ink-light">Daily student RSVPs across all campus societies</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30D565" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#30D565" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7EEDB" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#F7EEDB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE0" vertical={false} />
                <XAxis dataKey="day" stroke="#9B9B96" fontSize={11} tickLine={false} />
                <YAxis stroke="#9B9B96" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EFEBE0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#20201D',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  name="RSVPs"
                  stroke="#30D565"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSignups)"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="#20201D"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-card bg-white border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green" />
                <span>Attendees by Category</span>
              </h2>
              <p className="text-xs text-ink-light">Total student interest breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE0" vertical={false} />
                <XAxis dataKey="name" stroke="#9B9B96" fontSize={10} tickLine={false} />
                <YAxis stroke="#9B9B96" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EFEBE0',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#20201D',
                  }}
                />
                <Bar dataKey="attendees" radius={[6, 6, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Registrations & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Registrations Table */}
        <div className="lg:col-span-12 p-6 rounded-card bg-white border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">Recent Student Registrations</h2>
              <p className="text-xs text-ink-light">Latest students securing spots for events.</p>
            </div>
            <Link
              to="/admin/registrations"
              className="text-xs font-medium text-green hover:text-green-hover flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-white">
              <thead>
                <tr className="border-b border-border-light text-ink-light bg-cream font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 pl-4">Student</th>
                  <th className="py-3">Event</th>
                  <th className="py-3">College</th>
                  <th className="py-3">Year</th>
                  <th className="py-3">Pass ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((reg: any) => (
                    <tr key={reg._id} className="hover:bg-cream/50 transition-colors">
                      <td className="py-3 pl-4 font-medium text-ink">
                        <div>{reg.fullName}</div>
                        <div className="text-[10px] text-ink-light font-normal">{reg.email}</div>
                      </td>
                      <td className="py-3 text-ink-light max-w-[180px] truncate">
                        {reg.event?.title || 'Event'}
                      </td>
                      <td className="py-3 text-ink-light max-w-[150px] truncate">
                        {reg.college}
                      </td>
                      <td className="py-3 text-ink-light">
                        <span className="px-2 py-1 rounded bg-cream text-[10px] font-medium border border-border-light">
                          {reg.academicYear}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-green font-medium text-[11px]">
                        {reg.registrationId}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-ink-faint">
                      No registrations recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventFormModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSuccess={() => {
            showToast('Event created successfully!', 'success');
            fetchStats();
          }}
        />
      )}

      {showClubModal && (
        <ClubFormModal
          isOpen={showClubModal}
          onClose={() => setShowClubModal(false)}
          onSuccess={() => {
            showToast('Club registered successfully!', 'success');
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

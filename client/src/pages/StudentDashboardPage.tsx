import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Bell,
  User,
  LogOut,
  QrCode,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Edit3,
  Save,
  Sparkles,
} from 'lucide-react';
import {
  getStoredStudent,
  saveStoredStudent,
  StudentProfile,
  MOCK_CLUBS,
  MOCK_EVENTS,
  EventData,
  ClubData,
} from '../data/mockData.js';
import { useToast } from '../context/ToastContext.js';
import { RegistrationSuccessModal } from '../components/events/RegistrationSuccessModal.js';
import { RegistrationSuccessResponse } from '../services/registrationService.js';

type TabType = 'overview' | 'clubs' | 'events' | 'notifications' | 'profile';

export const StudentDashboardPage: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [student, setStudent] = useState<StudentProfile>(getStoredStudent());

  // Pass viewer modal
  const [activePassData, setActivePassData] = useState<RegistrationSuccessResponse['data'] | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: student.name,
    studentId: student.studentId,
    department: student.department,
    academicYear: student.academicYear,
    phone: student.phone,
    bio: student.bio,
    interests: student.interests.join(', '),
  });

  useEffect(() => {
    const current = getStoredStudent();
    setStudent(current);
    setProfileForm({
      name: current.name,
      studentId: current.studentId,
      department: current.department,
      academicYear: current.academicYear,
      phone: current.phone,
      bio: current.bio,
      interests: current.interests.join(', '),
    });
  }, [activeTab]);

  // Joined Clubs data
  const joinedClubs: ClubData[] = student.joinedClubIds
    .map((id) => MOCK_CLUBS.find((c) => c._id === id))
    .filter(Boolean) as ClubData[];

  // Registered Events data
  const registeredEventsList: { event: EventData; regId: string; date: string }[] = student.registeredEvents
    .map((item) => {
      const ev = MOCK_EVENTS.find((e) => e._id === item.eventId);
      if (!ev) return null;
      return {
        event: ev,
        regId: item.registrationId,
        date: item.registeredAt,
      };
    })
    .filter(Boolean) as { event: EventData; regId: string; date: string }[];

  const handleLeaveClub = (clubId: string, clubName: string) => {
    const updatedIds = student.joinedClubIds.filter((id) => id !== clubId);
    const updatedStudent = { ...student, joinedClubIds: updatedIds };
    setStudent(updatedStudent);
    saveStoredStudent(updatedStudent);
    addToast(`Left ${clubName}`, 'info');
  };

  const handleCancelRegistration = (eventId: string, eventTitle: string) => {
    const updatedRegs = student.registeredEvents.filter((r) => r.eventId !== eventId);
    const updatedStudent = { ...student, registeredEvents: updatedRegs };
    setStudent(updatedStudent);
    saveStoredStudent(updatedStudent);
    addToast(`Cancelled registration for ${eventTitle}`, 'info');
  };

  const handleMarkNotificationsRead = () => {
    const updatedNotifs = student.notifications.map((n) => ({ ...n, read: true }));
    const updatedStudent = { ...student, notifications: updatedNotifs };
    setStudent(updatedStudent);
    saveStoredStudent(updatedStudent);
    addToast('All notifications marked as read', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudent: StudentProfile = {
      ...student,
      name: profileForm.name,
      studentId: profileForm.studentId,
      department: profileForm.department,
      academicYear: profileForm.academicYear,
      phone: profileForm.phone,
      bio: profileForm.bio,
      interests: profileForm.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
    };
    setStudent(updatedStudent);
    saveStoredStudent(updatedStudent);
    addToast('Profile changes saved successfully!', 'success');
  };

  const openDigitalPass = (regId: string, ev: EventData) => {
    const passObj: RegistrationSuccessResponse['data'] = {
      registrationId: regId,
      studentName: student.name,
      email: student.email,
      college: student.college,
      academicYear: student.academicYear,
      phone: student.phone,
      status: 'Confirmed',
      registeredAt: new Date().toISOString(),
      event: {
        title: ev.title,
        date: ev.date,
        startTime: ev.startTime,
        venue: ev.venue,
        bannerUrl: ev.bannerUrl,
      },
    };
    setActivePassData(passObj);
  };

  const unreadNotifsCount = student.notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-ivory text-ink min-h-screen pb-20">
      {/* Top Banner / Student Greeting */}
      <div className="border-b border-border bg-white py-8 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl text-ink tracking-tight">
                    {student.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-pill text-[10px] font-semibold bg-green-light text-green border border-green">
                    Student
                  </span>
                </div>
                <p className="text-xs text-ink-light mt-0.5">
                  ID: <span className="font-mono text-ink">{student.studentId}</span> • {student.department} ({student.academicYear})
                </p>
                <p className="text-[11px] text-ink-light font-mono">
                  {student.college}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/events"
                className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-xs font-semibold text-ink shadow-subtle flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Explore Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'clubs', label: `My Clubs (${joinedClubs.length})`, icon: Users },
              { id: 'events', label: `My Events (${registeredEventsList.length})`, icon: Calendar },
              {
                id: 'notifications',
                label: `Notifications ${unreadNotifsCount > 0 ? `(${unreadNotifsCount})` : ''}`,
                icon: Bell,
                badge: unreadNotifsCount > 0,
              },
              { id: 'profile', label: 'My Profile', icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-pill text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cream text-ink border-l-4 border-green shadow-subtle'
                    : 'bg-transparent text-ink-light hover:text-ink hover:bg-cream border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-green' : 'text-ink-light'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-green" />
                )}
              </button>
            ))}

            <div className="pt-6 border-t border-border mt-6 text-[11px] text-ink-light p-2 space-y-1">
              <div className="font-semibold text-ink">Institutional Notice</div>
              <p>Admission passes are verified against your college registration ID at campus gates.</p>
            </div>
          </div>

          {/* Tab Panes */}
          <div className="lg:col-span-9 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-card bg-white border border-border shadow-subtle">
                    <div className="text-[11px] text-ink-light">Joined Clubs</div>
                    <div className="text-2xl font-bold text-ink mt-1">{joinedClubs.length}</div>
                    <div className="text-[10px] text-green mt-0.5">Active Member</div>
                  </div>

                  <div className="p-4 rounded-card bg-white border border-border shadow-subtle">
                    <div className="text-[11px] text-ink-light">Registered Passes</div>
                    <div className="text-2xl font-bold text-ink mt-1">{registeredEventsList.length}</div>
                    <div className="text-[10px] text-ink-light mt-0.5">Confirmed RSVPs</div>
                  </div>

                  <div className="p-4 rounded-card bg-white border border-border shadow-subtle">
                    <div className="text-[11px] text-ink-light">Notifications</div>
                    <div className="text-2xl font-bold text-ink mt-1">{unreadNotifsCount}</div>
                    <div className="text-[10px] text-ink-light mt-0.5">Unread Updates</div>
                  </div>
                </div>

                {/* Next Upcoming Event Spotlight Pass */}
                {registeredEventsList.length > 0 ? (
                  <div className="rounded-card bg-white border border-border shadow-subtle p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ink-light">
                        Next Upcoming Entry Pass
                      </span>
                      <span className="text-xs font-mono text-green flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-ink">
                          {registeredEventsList[0].event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-light mt-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-ink-light" />
                            <span>{registeredEventsList[0].event.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-ink-light" />
                            <span>{registeredEventsList[0].event.startTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-ink-light" />
                            <span>{registeredEventsList[0].event.venue}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        <button
                          onClick={() =>
                            openDigitalPass(registeredEventsList[0].regId, registeredEventsList[0].event)
                          }
                          className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink font-semibold text-xs flex items-center gap-2 shadow-subtle transition-colors"
                        >
                          <QrCode className="w-4 h-4 text-ink" />
                          <span>View Digital Pass</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-card bg-white border border-border shadow-subtle text-center space-y-3">
                    <Calendar className="w-8 h-8 text-ink-faint mx-auto" />
                    <h3 className="text-sm font-bold text-ink">No Upcoming Event Passes</h3>
                    <p className="text-xs text-ink-light max-w-md mx-auto">
                      You haven't reserved admission to any upcoming campus hackathons or sessions yet.
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink text-xs font-semibold transition-colors"
                    >
                      <span>Find Events</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Quick Chapters Roster */}
                <div className="rounded-card bg-white border border-border shadow-subtle p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                      Affiliated Societies ({joinedClubs.length})
                    </h3>
                    <Link to="/clubs" className="text-xs text-ink font-semibold">
                      Explore All Clubs &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {joinedClubs.map((club) => (
                      <Link
                        key={club._id}
                        to={`/clubs/${club.slug || club._id}`}
                        className="p-3 rounded-xl bg-cream border border-border hover:border-ink-light flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-ink truncate">{club.name}</div>
                          <div className="text-[10px] text-ink-light">{club.category}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MY CLUBS TAB */}
            {activeTab === 'clubs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="font-display text-2xl text-ink">Joined Campus Chapters</h2>
                  <Link
                    to="/clubs"
                    className="text-xs text-ink font-semibold flex items-center gap-1"
                  >
                    <span>Discover More Clubs &rarr;</span>
                  </Link>
                </div>

                {joinedClubs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {joinedClubs.map((club) => (
                      <div
                        key={club._id}
                        className="p-5 rounded-card bg-white border border-border shadow-subtle flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-12 h-12 rounded-xl object-cover border border-border"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase text-ink-light tracking-wider">
                              {club.category}
                            </span>
                            <h3 className="text-sm font-bold text-ink mt-0.5">{club.name}</h3>
                            <p className="text-xs text-ink-light line-clamp-2 mt-1">
                              {club.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border-light text-xs">
                          <Link
                            to={`/clubs/${club.slug || club._id}`}
                            className="text-ink font-semibold flex items-center gap-1"
                          >
                            <span>View Chapter &rarr;</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleLeaveClub(club._id, club.name)}
                            className="text-red-600 hover:text-red-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Leave Club</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-card bg-white border border-border shadow-subtle text-center space-y-3">
                    <Users className="w-8 h-8 text-ink-faint mx-auto" />
                    <h3 className="text-sm font-bold text-ink">No Clubs Joined Yet</h3>
                    <p className="text-xs text-ink-light">
                      Join competitive coding chapters, robotics teams, or web societies to collaborate on campus.
                    </p>
                    <Link
                      to="/clubs"
                      className="inline-flex items-center gap-1 px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink text-xs font-semibold"
                    >
                      Browse Chapters
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* MY EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="font-display text-2xl text-ink">My Registered Event Passes</h2>
                  <Link
                    to="/events"
                    className="text-xs text-ink font-semibold flex items-center gap-1"
                  >
                    <span>Browse All Events &rarr;</span>
                  </Link>
                </div>

                {registeredEventsList.length > 0 ? (
                  <div className="space-y-3">
                    {registeredEventsList.map(({ event, regId, date }) => (
                      <div
                        key={regId}
                        className="p-5 rounded-card bg-white border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wider bg-cream text-ink border border-border">
                              {event.category}
                            </span>
                            <span className="text-xs font-mono text-ink-light font-semibold">
                              Pass ID: {regId}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-ink">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-light">
                            <span className="flex items-center gap-1 text-ink-light">
                              <Calendar className="w-3.5 h-3.5" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {event.startTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.venue}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openDigitalPass(regId, event)}
                            className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink font-semibold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Digital Pass</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancelRegistration(event._id, event.title)}
                            className="p-3 rounded-full bg-cream hover:bg-red-50 hover:text-red-600 text-ink-light border border-border transition-colors"
                            title="Cancel Reservation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 rounded-card bg-white border border-border shadow-subtle text-center space-y-3">
                    <Calendar className="w-8 h-8 text-ink-faint mx-auto" />
                    <h3 className="text-sm font-bold text-ink">No Event Passes Reserved</h3>
                    <p className="text-xs text-ink-light">
                      Reserve entry passes to hackathons, bootcamps, and symposiums on campus.
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1 px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink text-xs font-semibold"
                    >
                      Find Events
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="font-display text-2xl text-ink">Collegiate Notifications</h2>
                  {unreadNotifsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkNotificationsRead}
                      className="text-xs text-ink font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {student.notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-card border transition-colors ${
                        notif.read
                          ? 'bg-white border-border text-ink-light'
                          : 'bg-cream border-green text-ink'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink">{notif.title}</span>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green" />
                            )}
                          </div>
                          <p className="text-xs text-ink-light">{notif.message}</p>
                        </div>
                        <span className="text-[10px] text-ink-faint font-mono shrink-0">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="rounded-card bg-white border border-border shadow-subtle p-6 sm:p-8 space-y-6">
                <div className="pb-4 border-b border-border">
                  <h2 className="font-display text-2xl text-ink">Student Profile & Credentials</h2>
                  <p className="text-xs text-ink-light mt-0.5">
                    Your institutional information is verified during gate check-ins and pass issuance.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Student University ID / Roll No.
                      </label>
                      <input
                        type="text"
                        value={profileForm.studentId}
                        onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={profileForm.academicYear}
                        onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-light mb-1">
                        Technical Interests (comma separated)
                      </label>
                      <input
                        type="text"
                        value={profileForm.interests}
                        onChange={(e) => setProfileForm({ ...profileForm, interests: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                        placeholder="Hackathons, AI/ML, WebDev"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-light mb-1">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-xs text-ink focus:outline-none focus:border-green focus:ring-1 focus:ring-green"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-pill bg-green hover:bg-green-hover text-ink font-semibold text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DIGITAL PASS MODAL (With ABES Logo, QR code, and Barcode) */}
      {activePassData && (
        <RegistrationSuccessModal
          data={activePassData}
          isOpen={!!activePassData}
          onClose={() => setActivePassData(null)}
        />
      )}
    </div>
  );
};

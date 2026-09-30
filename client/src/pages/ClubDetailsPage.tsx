import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Mail,
  ArrowLeft,
  Award,
  Globe,
  Code2,
  Share2,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  UserCheck,
  UserPlus,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { ClubData, MOCK_CLUBS, MOCK_EVENTS, EventData, getStoredStudent, saveStoredStudent } from '../data/mockData.js';
import { clubService } from '../services/clubService.js';
import { EventCard } from '../components/events/EventCard.js';
import { Event } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';
import { RegistrationModal } from '../components/events/RegistrationModal.js';
import { RegistrationSuccessModal } from '../components/events/RegistrationSuccessModal.js';
import { RegistrationSuccessResponse } from '../services/registrationService.js';

export const ClubDetailsPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [club, setClub] = useState<ClubData | null>(null);
  const [clubEvents, setClubEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  // Registration modal states
  const [selectedEventForReg, setSelectedEventForReg] = useState<Event | EventData | null>(null);
  const [regSuccessData, setRegSuccessData] = useState<RegistrationSuccessResponse['data'] | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        // Try finding in MOCK_CLUBS first or fallback to API
        const matchedMock = MOCK_CLUBS.find(
          (c) => c._id === idOrSlug || c.slug === idOrSlug
        );

        if (matchedMock) {
          setClub(matchedMock);
          // Match events hosted by this club
          const relatedEvents = MOCK_EVENTS.filter(
            (e) => e.club._id === matchedMock._id || e.club.slug === matchedMock.slug
          );
          setClubEvents(relatedEvents);
        } else {
          const apiClub = await clubService.getClubByIdOrSlug(idOrSlug || '');
          if (apiClub) {
            setClub(apiClub as unknown as ClubData);
          }
        }
      } catch (err) {
        console.error('Failed to load club details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [idOrSlug]);

  useEffect(() => {
    if (club) {
      const student = getStoredStudent();
      setIsJoined(student.joinedClubIds?.includes(club._id) || false);
    }
  }, [club]);

  const handleToggleJoin = () => {
    if (!club) return;
    const student = getStoredStudent();
    const current = student.joinedClubIds || [];
    let updated: string[];

    if (isJoined) {
      updated = current.filter((id) => id !== club._id);
      setIsJoined(false);
      addToast(`Left ${club.name}`, 'info');
    } else {
      updated = [...current, club._id];
      setIsJoined(true);
      addToast(`🎉 Successfully joined ${club.name}! Check your dashboard.`, 'success');
    }

    saveStoredStudent({
      ...student,
      joinedClubIds: updated,
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading club profile...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Club Not Found</h2>
        <p className="text-slate-400 text-sm">
          The requested collegiate society or chapter does not exist in the ABES directory.
        </p>
        <Link
          to="/clubs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clubs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-tech-bg text-tech-text pb-20">
      {/* Back Navigation Bar */}
      <div className="border-b border-slate-800 bg-tech-surface/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Clubs & Societies</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleJoin}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                isJoined
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800 hover:bg-rose-950/90 hover:text-rose-300 hover:border-rose-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              }`}
            >
              {isJoined ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Member Active</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Club</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
        <img
          src={club.bannerUrl}
          alt={club.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-bg via-tech-bg/40 to-transparent" />
      </div>

      {/* Club Identity Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <img
              src={club.logoUrl}
              alt={club.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-tech-bg shadow-2xl bg-tech-card"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {club.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {club.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                {club.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs">
            <div className="px-4 py-2 rounded-xl bg-tech-surface border border-slate-800 text-center min-w-[90px]">
              <div className="text-lg font-bold text-white">{club.memberCount}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Members</div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-tech-surface border border-slate-800 text-center min-w-[90px]">
              <div className="text-lg font-bold text-indigo-400">{clubEvents.length || 3}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Events</div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* About Chapter */}
            <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>About The Chapter</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {club.longDescription || club.description}
              </p>
            </div>

            {/* Key Achievements */}
            {club.achievements && club.achievements.length > 0 && (
              <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Key Achievements & Milestones</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {club.achievements.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-tech-card border border-slate-800 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leadership & Core Team */}
            {club.leadershipTeam && club.leadershipTeam.length > 0 && (
              <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Student Leadership Team</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {club.leadershipTeam.map((leader, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-tech-card border border-slate-800 text-center space-y-2"
                    >
                      <img
                        src={leader.avatar}
                        alt={leader.name}
                        className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{leader.name}</div>
                        <div className="text-[11px] text-slate-400">{leader.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Hosted Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Upcoming Hosted Events ({clubEvents.length})</span>
                </h2>
                <Link
                  to="/events"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View All Campus Events
                </Link>
              </div>

              {clubEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clubEvents.map((ev) => (
                    <EventCard
                      key={ev._id}
                      event={ev as unknown as Event}
                      onRegisterClick={(e) => setSelectedEventForReg(e)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-tech-surface border border-slate-800 text-center">
                  <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    No active upcoming events scheduled for this club right now.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Faculty & Lead Coordinator Card */}
            <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Chapter Mentorship
              </h3>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-tech-card border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-indigo-400">
                    Faculty Coordinator
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {club.facultyCoordinator || 'Faculty Coordinator'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-tech-card border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-cyan-400">
                    Student Lead
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {club.leadName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    <span>{club.leadEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Community Links */}
            <div className="p-6 rounded-2xl bg-tech-surface border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Connect & Discord
              </h3>

              <div className="space-y-2 pt-1 text-xs">
                {club.socialLinks?.github && (
                  <a
                    href={club.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-tech-card hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span>GitHub Organization</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {club.socialLinks?.linkedin && (
                  <a
                    href={club.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-tech-card hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-blue-400" />
                      <span>LinkedIn Page</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}

                {club.socialLinks?.discord && (
                  <a
                    href={club.socialLinks.discord}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-tech-card hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Discord Server</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {selectedEventForReg && (
        <RegistrationModal
          event={selectedEventForReg as unknown as Event}
          isOpen={!!selectedEventForReg}
          onClose={() => setSelectedEventForReg(null)}
          onSuccess={(data) => {
            setRegSuccessData(data);
          }}
        />
      )}

      {/* REGISTRATION SUCCESS MODAL */}
      {regSuccessData && (
        <RegistrationSuccessModal
          data={regSuccessData}
          isOpen={!!regSuccessData}
          onClose={() => setRegSuccessData(null)}
        />
      )}
    </div>
  );
};

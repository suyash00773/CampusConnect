import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, ArrowRight, Calendar, Award, Check, UserPlus } from 'lucide-react';
import { Club } from '../../types/index.js';
import { ClubData, getStoredStudent, saveStoredStudent } from '../../data/mockData.js';
import { useToast } from '../../context/ToastContext.js';

interface ClubCardProps {
  club: Club | ClubData;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  const { addToast } = useToast();
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const student = getStoredStudent();
    const joined = student.joinedClubIds?.includes(club._id) || false;
    setIsJoined(joined);
  }, [club._id]);

  const handleToggleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const student = getStoredStudent();
    const currentJoined = student.joinedClubIds || [];
    let updated: string[];

    if (isJoined) {
      updated = currentJoined.filter((id) => id !== club._id);
      setIsJoined(false);
      addToast(`Left ${club.name}`, 'info');
    } else {
      updated = [...currentJoined, club._id];
      setIsJoined(true);
      addToast(`🎉 Welcome to ${club.name}! You are now an active member.`, 'success');
    }

    saveStoredStudent({
      ...student,
      joinedClubIds: updated,
    });
  };

  const clubSlug = club.slug || club._id;
  const eventCount = 'eventCount' in club ? club.eventCount : ('upcomingEventsCount' in club ? club.upcomingEventsCount : 0);

  return (
    <article className="group flex flex-col rounded-xl bg-tech-surface border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden">
      {/* Banner & Logo */}
      <div className="relative h-28 w-full bg-slate-950 overflow-hidden">
        <img
          src={club.bannerUrl}
          alt={club.name}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-surface via-transparent to-black/50" />

        {/* Club Logo Avatar */}
        <div className="absolute -bottom-3 left-4">
          <img
            src={club.logoUrl}
            alt={club.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-tech-surface shadow-lg bg-slate-900"
          />
        </div>

        {/* Featured / Category Tag */}
        {club.isFeatured && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white shadow-sm flex items-center gap-1">
            <Award className="w-3 h-3" />
            Chartered
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-6 p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {club.category}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              ABES EC
            </span>
          </div>

          <Link to={`/clubs/${clubSlug}`} className="block group/link">
            <h3 className="text-base font-bold text-white group-hover/link:text-indigo-400 transition-colors leading-snug line-clamp-1">
              {club.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          {/* Member & Event counts */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{club.memberCount} Members</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{eventCount} Events</span>
            </div>
          </div>

          {/* Lead Coordinator */}
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="truncate">
              <span className="text-slate-500">Lead:</span> {club.leadName}
            </div>
          </div>
        </div>

        {/* Actions: View Details + Join Club */}
        <div className="pt-1 grid grid-cols-2 gap-2">
          <Link
            to={`/clubs/${clubSlug}`}
            className="py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-colors text-center"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleToggleJoin}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isJoined
                ? 'bg-emerald-950/80 hover:bg-rose-950/80 text-emerald-300 hover:text-rose-300 border border-emerald-800/80 hover:border-rose-800/80'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            {isJoined ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Joined</span>
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
    </article>
  );
};

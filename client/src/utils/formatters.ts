export const formatEventDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr: string): { month: string; day: string } => {
  if (!dateStr) return { month: 'TBD', day: '--' };
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: String(day),
    };
  } catch {
    return { month: 'TBD', day: '--' };
  }
};

export const getDaysRemainingBadge = (dateStr: string): { text: string; urgent: boolean } => {
  if (!dateStr) return { text: 'Scheduled', urgent: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Concluded', urgent: false };
  if (diffDays === 0) return { text: 'Today', urgent: true };
  if (diffDays === 1) return { text: 'Tomorrow', urgent: true };
  if (diffDays <= 7) return { text: `In ${diffDays} days`, urgent: true };
  return { text: `In ${diffDays} days`, urgent: false };
};

export const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Hackathon':
      return {
        bg: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60',
        badge: 'bg-indigo-600 text-white',
        border: 'hover:border-indigo-600/50',
      };
    case 'Technical':
      return {
        bg: 'bg-blue-950/70 text-blue-300 border-blue-700/60',
        badge: 'bg-blue-600 text-white',
        border: 'hover:border-blue-600/50',
      };
    case 'Workshop':
      return {
        bg: 'bg-amber-950/70 text-amber-300 border-amber-700/60',
        badge: 'bg-amber-600 text-white',
        border: 'hover:border-amber-600/50',
      };
    case 'Cultural':
      return {
        bg: 'bg-rose-950/70 text-rose-300 border-rose-700/60',
        badge: 'bg-rose-600 text-white',
        border: 'hover:border-rose-600/50',
      };
    case 'Sports':
      return {
        bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60',
        badge: 'bg-emerald-600 text-white',
        border: 'hover:border-emerald-600/50',
      };
    case 'Seminar':
      return {
        bg: 'bg-sky-950/70 text-sky-300 border-sky-700/60',
        badge: 'bg-sky-600 text-white',
        border: 'hover:border-sky-600/50',
      };
    default:
      return {
        bg: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
        badge: 'bg-slate-700 text-white',
        border: 'hover:border-slate-600/50',
      };
  }
};

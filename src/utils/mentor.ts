import {IMAGE_DOMAIN} from '../config/env';
import {initials} from './helpers';

export type Category = {id: number; name: string; parent_id?: number | null; show_at_home?: number};

export type AppMentor = {
  id: string;
  slug: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  rating: number;
  sessions: number;
  price: number;
  languages: string[];
  expertise: string[];
  categories: Category[];
  bio: string;
  aboutMe?: string;
  image: string; // initials fallback for Avatar
  imageUrl?: string;
  availability: string[];
  nextAvailableSlot?: string | null;
  introVideo?: string | null;
  country?: string | null;
  city?: string | null;
  linkedinUrl?: string | null;
  experiences?: any[];
  reviews?: any[];
};

export const imageUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return IMAGE_DOMAIN + path.replace(/^\//, '');
};

const yearsOfExperience = (experiences: any[] = []) => {
  if (!experiences.length) return '';
  const starts = experiences
    .map(e => new Date(e.start_date || e.from || e.start || '').getFullYear())
    .filter(y => !isNaN(y));
  if (!starts.length) return '';
  const years = new Date().getFullYear() - Math.min(...starts);
  return years > 0 ? `${years}+ years` : '';
};

// Maps both /home/mentors list items and /mentor/profile/:slug detail into one UI shape.
export const normalizeMentor = (m: any): AppMentor => {
  const categories: Category[] = Array.isArray(m?.categories) ? m.categories : [];
  const experiences = Array.isArray(m?.experiences) ? m.experiences : [];
  const current = experiences[0];
  return {
    id: String(m?.id ?? m?.profile_slug),
    slug: m?.profile_slug,
    name: m?.full_name || 'Mentor',
    role: m?.expertise_area || current?.title || current?.designation || 'Mentor',
    company: current?.company || current?.company_name || '',
    experience: yearsOfExperience(experiences),
    rating: Number(m?.average_rating) || 0,
    sessions: Number(m?.review_count ?? m?.total_reviews) || 0,
    price: Math.ceil(Number(m?.hourly_rate) || 0),
    languages: Array.isArray(m?.languages) ? m.languages : [],
    expertise: categories.map(c => c.name),
    categories,
    bio: (m?.bio || '').trim(),
    aboutMe: m?.about_me,
    image: initials(m?.full_name || 'CM'),
    imageUrl: imageUrl(m?.profile_image),
    availability: [],
    nextAvailableSlot: m?.next_available_slot,
    introVideo: m?.intro_video,
    country: m?.country,
    city: m?.city,
    linkedinUrl: m?.linkedin_url,
    experiences,
    reviews: Array.isArray(m?.reviews) ? m.reviews : [],
  };
};

export type DaySlot = {id: number; start: string; end: string; label: string};
export type AvailableDay = {date: string; slots: DaySlot[]};

const pad = (n: number) => String(n).padStart(2, '0');
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const to12h = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(n => parseInt(n, 10) || 0);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${pad(hour)}:${pad(m)} ${suffix}`;
};

/**
 * Port of the web booking-form logic: the API returns weekdays (1=Mon..7=Sun)
 * and a list of slots; expand into concrete dates for the next 90 days,
 * dropping slots that already started today.
 */
export const buildAvailableDays = (api: any, lookahead = 90): AvailableDay[] => {
  if (!api) return [];
  const selectedDays: number[] = Array.isArray(api.selected_days) ? api.selected_days : [];
  const rawSlots: any[] = Array.isArray(api.slots) ? api.slots : [];
  const jsWeekdays = selectedDays.map(d => (d === 7 ? 0 : d));

  const mapped: DaySlot[] = rawSlots.map(s => {
    const start = (s.start_time || '').slice(0, 5);
    const end = (s.end_time || '').slice(0, 5);
    return {id: s.id, start, end, label: s.label || `${to12h(start)} - ${to12h(end)}`};
  });

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const results: AvailableDay[] = [];

  for (let i = 0; i < lookahead; i++) {
    const dt = new Date(now);
    dt.setDate(now.getDate() + i);
    if (!jsWeekdays.includes(dt.getDay())) continue;

    const slots = mapped
      .filter(slot => {
        const [sh, sm] = slot.start.split(':').map(n => parseInt(n, 10) || 0);
        const [eh, em] = slot.end.split(':').map(n => parseInt(n, 10) || 0);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;
        const crossesMidnight = endMin < startMin;
        if (!crossesMidnight && endMin <= startMin) return false;
        return i === 0 ? startMin >= nowMin : true;
      })
      .sort((a, b) => a.start.localeCompare(b.start));

    if (slots.length) results.push({date: toISODate(dt), slots});
  }
  return results;
};

export const slotDurationMinutes = (slot?: DaySlot | null) => {
  if (!slot) return 60;
  const [sh, sm] = slot.start.split(':').map(n => parseInt(n, 10) || 0);
  const [eh, em] = slot.end.split(':').map(n => parseInt(n, 10) || 0);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes || 60;
};

export const formatLongDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-IN', {weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'});
};

export const formatDateTime = (value?: string | number | null) => {
  if (!value) return '';
  const d = typeof value === 'number' ? new Date(value * (value < 1e12 ? 1000 : 1)) : new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

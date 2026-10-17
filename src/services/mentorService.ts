import {mentors} from '../data/mentors';
import {getHomeMentors, getPublicMentorProfile} from '../api/homeApi';
import type {Mentor} from '../types';

/** Helper to normalise API mentor responses to the UI Mentor interface */
export const normalizeMentor = (raw: any, fallbackId?: string): Mentor => {
  if (!raw) return mentors[0];
  return {
    id: String(raw.id || raw._id || fallbackId || Date.now()),
    name: raw.name || raw.full_name || 'Clarity Mentor',
    role: raw.role || raw.job_title || raw.expertise_area || 'Mentor',
    company: raw.company || raw.company_name || 'Tech',
    experience:
      raw.experience ||
      (raw.total_experience_years
        ? `${raw.total_experience_years}+ years`
        : '5+ years'),
    rating: Number(raw.rating || raw.average_rating || 4.9),
    sessions: Number(raw.sessions || raw.total_sessions || 50),
    price: Number(raw.price || raw.hourly_rate || 799),
    languages: Array.isArray(raw.languages)
      ? raw.languages
      : typeof raw.languages === 'string'
      ? raw.languages.split(',').map((l: string) => l.trim())
      : ['English', 'Hindi'],
    expertise: Array.isArray(raw.expertise)
      ? raw.expertise
      : raw.expertise_area
      ? [raw.expertise_area]
      : ['Career Growth'],
    bio: raw.bio || raw.about_me || 'Experienced mentor ready to help you navigate your decisions.',
    image: raw.image || raw.avatar_url || raw.full_name?.slice(0, 2)?.toUpperCase() || 'CM',
    availability: Array.isArray(raw.availability)
      ? raw.availability
      : ['10:00 AM', '02:00 PM', '06:00 PM'],
  };
};

export const getMentors = async (params?: {skip?: number; limit?: number}): Promise<Mentor[]> => {
  try {
    const res = await getHomeMentors(params);
    const data = res.data;
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.mentors)
      ? data.mentors
      : null;

    if (list && list.length > 0) {
      return list.map((item: any, idx: number) => normalizeMentor(item, String(idx + 1)));
    }
  } catch (err) {
    // If backend is not reached yet or returns error, use seeded mentors
    console.log('[mentorService] getMentors using fallback mentors:', err);
  }
  return mentors;
};

export const getMentorById = async (id: string): Promise<Mentor | undefined> => {
  try {
    const res = await getPublicMentorProfile(id);
    if (res.data) {
      return normalizeMentor(res.data.data || res.data, id);
    }
  } catch (err) {
    console.log('[mentorService] getMentorById fallback:', err);
  }
  return mentors.find(x => x.id === id);
};

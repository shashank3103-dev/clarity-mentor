export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  rating: number;
  sessions: number;
  price: number;
  languages: string[];
  expertise: string[];
  bio: string;
  image: string;
  availability: string[];
}

export interface Booking {
  id?: string;
  mentor: Mentor;
  date: string;
  time: string;
  duration: number;
  status?: 'upcoming' | 'completed';
}

export interface UserProfile {
  name: string;
  role: string;
  email?: string;
}

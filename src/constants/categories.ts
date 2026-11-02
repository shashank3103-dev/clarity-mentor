export interface CategoryItem {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  // Matched against API category names to filter /home/mentors.
  keywords: string[];
}

export const categories: CategoryItem[] = [
  {
    id: 'career',
    keywords: ['career', 'job', 'interview'],
    label: 'Career Growth',
    subtitle: 'Switches, promos & path',
    icon: require('../assets/icons/categories/career.png'),
  },
  {
    id: 'business',
    keywords: ['startup', 'business', 'fundrais', 'marketing'],
    label: 'Business & Startup',
    subtitle: 'From idea to traction',
    icon: require('../assets/icons/categories/business.png'),
  },
  {
    id: 'life',
    keywords: ['life', 'wellness', 'relationship', 'personal'],
    label: 'Life Decisions',
    subtitle: 'Crossroads & clarity',
    icon: require('../assets/icons/categories/decision.png'),
  },
  {
    id: 'leadership',
    keywords: ['leader', 'team', 'management'],
    label: 'Leadership',
    subtitle: 'Influence & managing',
    icon: require('../assets/icons/categories/leadership.png'),
  },
];

export interface CategoryItem {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
}

export const categories: CategoryItem[] = [
  {
    id: 'career',
    label: 'Career Growth',
    subtitle: 'Switches, promos & path',
    icon: require('../assets/icons/categories/career.png'),
  },
  {
    id: 'business',
    label: 'Business & Startup',
    subtitle: 'From idea to traction',
    icon: require('../assets/icons/categories/business.png'),
  },
  {
    id: 'life',
    label: 'Life Decisions',
    subtitle: 'Crossroads & clarity',
    icon: require('../assets/icons/categories/decision.png'),
  },
  {
    id: 'leadership',
    label: 'Leadership',
    subtitle: 'Influence & managing',
    icon: require('../assets/icons/categories/leadership.png'),
  },
];

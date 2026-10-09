import { mentors } from "../data/mentors";
export const getMentors = async () => mentors;
export const getMentorById = async (id) => mentors.find((x) => x.id === id);

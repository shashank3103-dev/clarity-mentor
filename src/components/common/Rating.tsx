import React from 'react';
import MentorRating from '../mentor/MentorRating';
export default function Rating({rating, sessions = 0}) { return <MentorRating rating={rating} sessions={sessions} />; }

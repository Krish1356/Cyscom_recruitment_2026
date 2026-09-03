export const INTERVIEW_SESSIONS = {
  FRI_PM: {
    id: "FRI_PM",
    label: "Friday, 4 September — 9:00 PM - 11:00 PM",
    date: "4 September 2026",
    time: "9:00 PM – 11:00 PM",
    capacity: 40,
  },
  SAT_AM: {
    id: "SAT_AM",
    label: "Saturday, 5 September — 10:00 AM - 12:30 PM",
    date: "5 September 2026",
    time: "10:00 AM – 12:30 PM",
    capacity: 60,
  },
  SAT_PM: {
    id: "SAT_PM",
    label: "Saturday, 5 September — 7:00 PM - 10:30 PM",
    date: "5 September 2026",
    time: "7:00 PM – 10:30 PM",
    capacity: 90,
  },
  SUN_AM: {
    id: "SUN_AM",
    label: "Sunday, 6 September — 10:00 AM - 12:00 PM",
    date: "6 September 2026",
    time: "10:00 AM – 12:00 PM",
    capacity: 45,
  },
  SUN_PM: {
    id: "SUN_PM",
    label: "Sunday, 6 September — 7:00 PM - 10:00 PM",
    date: "6 September 2026",
    time: "7:00 PM – 10:00 PM",
    capacity: 90,
  },
};

export type InterviewSessionId = keyof typeof INTERVIEW_SESSIONS;

// Store combinations alphabetically to normalize them
const ELIGIBILITY_RULES: Record<string, InterviewSessionId[]> = {
  "TECHNICAL_WEB_DEVELOPMENT": ["FRI_PM", "SAT_PM", "SUN_PM"],
  "EVENT_MANAGEMENT_TECHNICAL": ["FRI_PM", "SAT_PM", "SUN_PM"],
  "DESIGN_TECHNICAL": ["SAT_AM", "SUN_AM"],
  "SOCIAL_MEDIA_TECHNICAL": ["SAT_AM", "SUN_PM"],
  "OUTREACH_TECHNICAL": ["FRI_PM", "SUN_AM"],
  "EVENT_MANAGEMENT_WEB_DEVELOPMENT": ["FRI_PM", "SAT_PM"],
  "DESIGN_WEB_DEVELOPMENT": ["SAT_AM", "SUN_AM"],
  "SOCIAL_MEDIA_WEB_DEVELOPMENT": ["SAT_AM", "SUN_PM"],
  "OUTREACH_WEB_DEVELOPMENT": ["SUN_AM"],
  "DESIGN_EVENT_MANAGEMENT": ["SAT_AM", "SUN_AM"],
  "EVENT_MANAGEMENT_SOCIAL_MEDIA": ["SAT_PM", "SUN_PM"],
  "EVENT_MANAGEMENT_OUTREACH": ["FRI_PM", "SUN_AM"],
  "DESIGN_SOCIAL_MEDIA": ["SAT_AM"],
  "DESIGN_OUTREACH": ["SUN_AM"],
  "OUTREACH_SOCIAL_MEDIA": ["SUN_AM"],
};

export function getEligibleSessions(pref1: string, pref2: string): InterviewSessionId[] {
  // Normalize the strings
  const p1 = (pref1 || "").toUpperCase();
  const p2 = (pref2 || "").toUpperCase();
  
  // Sort alphabetically to ensure a consistent key
  const sorted = [p1, p2].sort();
  const key = `${sorted[0]}_${sorted[1]}`;
  
  return ELIGIBILITY_RULES[key] || [];
}

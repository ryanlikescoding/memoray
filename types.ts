export enum Screen {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  TIMETABLE = 'TIMETABLE',
  PERFORMANCE = 'PERFORMANCE',
  SETTINGS = 'SETTINGS',
}

export interface Course {
  id: string;
  name: string;
  details: string;
}

export interface Commitment {
  id: string;
  name: string;
  time: string;
}

export interface Score {
  id: string;
  subject: string;
  score: number;
  date: string;
  type: 'Quiz' | 'Test' | 'Midterm' | 'Final';
}

export interface RevisionItem {
  id: string;
  topic: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Revised';
  description: string;
}

export interface TimetableEntry {
  day: string;
  time: string;
  activity: string;
  type: 'Class' | 'Study' | 'Break' | 'Commitment';
}

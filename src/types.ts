export interface Student {
  name: string;
  loginTime: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LeaderboardEntry {
  studentName: string;
  pretestScore: number;
  posttestScore: number;
  development: number;
  qualityLevel: string;
  timestamp?: string;
}

export interface GameItem {
  id: string;
  type: 'code' | 'desc';
  text: string;
  pairId: string;
}

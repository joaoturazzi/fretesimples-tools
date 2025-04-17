
export interface Question {
  id: number;
  text: string;
  value: number;
}

export interface DiagnosticResults {
  score: number;
  level: string;
  recommendations: string[];
}

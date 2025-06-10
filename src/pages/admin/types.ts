
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  company: string;
  created_at: string;
  last_activity: string;
  lead_status: string;
}

export interface Diagnostic {
  id: string;
  tool_type: string;
  risk_level: string;
  viability: string;
  created_at: string;
  user_id: string;
  profile: Profile | null;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalCalculations: number;
  highRiskLeads: number;
}

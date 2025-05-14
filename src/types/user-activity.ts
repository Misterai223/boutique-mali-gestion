
export interface UserActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  details: Record<string, any>;
  created_at: string;
}

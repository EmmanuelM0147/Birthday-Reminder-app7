export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  dateOfBirth: string;
  created_at: string;
}

export interface CreateUserData {
  username: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface UpdateUserData {
  username?: string;
  name?: string;
  email?: string;
  dateOfBirth?: string;
}

export interface EmailLog {
  id: string;
  user_id: string;
  sent_at: string;
  status: 'success' | 'failed';
}
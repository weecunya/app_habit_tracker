export type Profile = {
  username: string;
  habits: number;
};

export type AuthResponse = Profile & {
  access_token: string;
  token_type: "Bearer";
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
};

export type Habit = {
  id: number;
  title: string;
  description: string;
  count: number;
  created_at: string;
  is_done: boolean;
  created_by: string;
};

export type CreateHabitRequest = {
  title: string;
  description: string;
  count: number;
  created_by: string;
};

export type UpdateHabitRequest = {
  id: number;
  title?: string;
  description?: string;
  count?: number;
  is_done?: boolean;
};

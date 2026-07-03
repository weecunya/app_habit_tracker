import { apiRequest } from "./client";
import type { CreateHabitRequest, Habit, UpdateHabitRequest } from "./types";

export async function getHabits() {
  try {
    return await apiRequest<Habit[]>("/api/habits/");
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return [];
    }

    throw error;
  }
}

export function createHabit(payload: CreateHabitRequest) {
  return apiRequest<Habit>("/api/habits/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateHabit(payload: UpdateHabitRequest) {
  return apiRequest<Habit>("/api/habits/update", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteHabit(habitId: number) {
  return apiRequest<void>(`/api/habits/delete?habit_id=${habitId}`, {
    method: "DELETE",
  });
}

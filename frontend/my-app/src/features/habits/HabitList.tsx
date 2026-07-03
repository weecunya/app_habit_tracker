import type { Habit, Profile } from "../../api/types";
import { HabitCard } from "./HabitCard";

type Props = {
  habits: Habit[];
  currentUser: Profile;
  onChange: () => Promise<void>;
};

export function HabitList({ habits, currentUser, onChange }: Props) {
  if (habits.length === 0) {
    return <p className="empty-state">No habits to show.</p>;
  }

  return (
    <section className="habit-grid" aria-label="Habit list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          currentUser={currentUser}
          onChange={onChange}
        />
      ))}
    </section>
  );
}

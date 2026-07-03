import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../api/errors";
import { getPartnerProfile } from "../../api/profile";
import { getHabits } from "../../api/habits";
import type { Habit, Profile } from "../../api/types";
import { useAuth } from "../../providers/useAuth";
import { HabitForm } from "./HabitForm";
import { HabitList } from "./HabitList";

type Filter = "all" | "mine" | "partner" | "done" | "active";

export function DashboardPage() {
  const { user, signOut, refreshUser } = useAuth();
  const [partner, setPartner] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const [loadedHabits, partnerProfile] = await Promise.all([
        getHabits(),
        getPartnerProfile().catch(() => null),
      ]);

      setHabits(loadedHabits);
      setPartner(partnerProfile);
      await refreshUser().catch(() => undefined);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const visibleHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (!user) return false;
      if (filter === "mine") return habit.created_by === user.username;
      if (filter === "partner") return habit.created_by !== user.username;
      if (filter === "done") return habit.is_done;
      if (filter === "active") return !habit.is_done;
      return true;
    });
  }, [filter, habits, user]);

  const stats = useMemo(() => {
    const total = habits.length;
    const done = habits.filter((habit) => habit.is_done).length;
    const mine = habits.filter((habit) => habit.created_by === user?.username).length;

    return {
      total,
      done,
      active: total - done,
      mine,
      partner: total - mine,
    };
  }, [habits, user?.username]);

  if (!user) {
    return null;
  }

  return (
    <main className="app-shell">
      <header className="dashboard-header">
        <div>
          <h1>Habit Tracker</h1>
          <p className="muted">Signed in as {user.username}</p>
          <p className="muted">
            Partner: {partner ? partner.username : "not connected yet"}
          </p>
        </div>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </header>

      <section className="stats-grid" aria-label="Habit statistics">
        <Stat label="Total" value={stats.total} />
        <Stat label="Done" value={stats.done} />
        <Stat label="Active" value={stats.active} />
        <Stat label="Mine" value={stats.mine} />
        <Stat label="Partner" value={stats.partner} />
      </section>

      <HabitForm user={user} onCreated={loadDashboard} />

      <section className="toolbar" aria-label="Habit filters">
        {(["all", "mine", "partner", "done", "active"] as const).map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            type="button"
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </section>

      {error ? <p className="error">{error}</p> : null}
      {isLoading ? (
        <p className="muted">Loading habits...</p>
      ) : (
        <HabitList habits={visibleHabits} currentUser={user} onChange={loadDashboard} />
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

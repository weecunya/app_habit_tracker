import { useState } from "react";
import { deleteHabit, updateHabit } from "../../api/habits";
import { getErrorMessage } from "../../api/errors";
import type { Habit, Profile } from "../../api/types";

type Props = {
  habit: Habit;
  currentUser: Profile;
  onChange: () => Promise<void>;
};

export function HabitCard({ habit, currentUser, onChange }: Props) {
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const isOwner = habit.created_by === currentUser.username;

  async function markDone() {
    setError("");
    setIsBusy(true);

    try {
      await updateHabit({
        id: habit.id,
        title: habit.title,
        description: habit.description,
        count: habit.count,
        is_done: true,
      });
      await onChange();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  async function removeHabit() {
    if (!window.confirm("Delete this habit?")) {
      return;
    }

    setError("");
    setIsBusy(true);

    try {
      await deleteHabit(habit.id);
      await onChange();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <article className="habit-card">
      <div className="habit-card-header">
        <h3>{habit.title}</h3>
        <span className={habit.is_done ? "badge done" : "badge"}>
          {habit.is_done ? "Выполнено" : "В процессе"}
        </span>
      </div>
      {habit.description ? <p>{habit.description}</p> : null}
      <dl>
        <div>
          <dt>Goal</dt>
          <dd>{habit.count}</dd>
        </div>
        <div>
          <dt>Author</dt>
          <dd>{habit.created_by}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{new Date(habit.created_at).toLocaleDateString()}</dd>
        </div>
      </dl>
      {error ? <p className="error">{error}</p> : null}
      <div className="card-actions">
        {!habit.is_done ? (
          <button type="button" onClick={markDone} disabled={isBusy}>
            Выполнить
          </button>
        ) : null}
        {isOwner ? (
          <button
            className="danger"
            type="button"
            onClick={removeHabit}
            disabled={isBusy}
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}

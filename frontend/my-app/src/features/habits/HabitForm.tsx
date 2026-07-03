import { FormEvent, useState } from "react";
import { createHabit } from "../../api/habits";
import { getErrorMessage } from "../../api/errors";
import type { Profile } from "../../api/types";

type Props = {
  user: Profile;
  onCreated: () => Promise<void>;
};

export function HabitForm({ user, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (title.length > 100) {
      setError("Title must be 100 characters or fewer.");
      return;
    }

    if (description.length > 500) {
      setError("Description must be 500 characters or fewer.");
      return;
    }

    if (count <= 0) {
      setError("Goal must be greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createHabit({
        title: title.trim(),
        description: description.trim(),
        count,
        created_by: user.username,
      });
      setTitle("");
      setDescription("");
      setCount(1);
      await onCreated();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Create habit</h2>
      <form className="habit-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          Goal
          <input
            value={count}
            min={1}
            type="number"
            onChange={(event) => setCount(Number(event.target.value))}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create habit"}
        </button>
      </form>
    </section>
  );
}

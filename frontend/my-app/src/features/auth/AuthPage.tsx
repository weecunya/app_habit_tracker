import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="app-shell auth-layout">
      <section className="auth-panel">
        <h1>Habit Tracker</h1>
        <div className="tabs" role="tablist" aria-label="Authentication mode">
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            type="button"
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}

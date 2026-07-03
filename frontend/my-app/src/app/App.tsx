import { AuthProvider } from "../providers/AuthProvider";
import { useAuth } from "../providers/useAuth";
import { AuthPage } from "../features/auth/AuthPage";
import { DashboardPage } from "../features/habits/DashboardPage";
import "../App.css";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="app-shell">
        <p className="muted">Loading...</p>
      </main>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

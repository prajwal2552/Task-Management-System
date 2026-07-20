import { useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("token");
        setUser(null);
      }}
    />
  );
}
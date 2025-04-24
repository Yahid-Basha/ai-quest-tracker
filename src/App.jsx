import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";
import Auth from "./components/Auth";
import QuestSetup from "./components/QuestSetup";
import TaskManager from "./components/TaskManager";
import Profile from "./components/Profile";

export default function App() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState("auth"); // 'auth' | 'setup' | 'tasks' | 'profile'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session?.user) {
      initUser(session.user);
    }
  }, [session]);

  const initUser = async (user) => {
    // Check if user exists in DB, if not insert with score = 0
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!data && !error) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        total_score: 0,
      });
    }

    setUserData({ id: user.id, email: user.email });
    setStep("setup"); // move to quest setup
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserData(null);
    setStep("auth");
  };

  if (!session) return <Auth onAuth={(session) => setSession(session)} />;

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">🧠 Quest Tracker</h1>
        <button
          onClick={() => setStep(step === "profile" ? "tasks" : "profile")}
          className="text-blue-600 underline"
        >
          {step === "profile" ? "Back to Tasks" : "Profile"}
        </button>
      </header>

      {step === "setup" && userData && (
        <QuestSetup user={userData} onSetupComplete={() => setStep("tasks")} />
      )}

      {step === "tasks" && userData && <TaskManager user={userData} />}

      {step === "profile" && userData && (
        <Profile user={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

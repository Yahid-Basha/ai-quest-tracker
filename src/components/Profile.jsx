// Profile page placeholder
import { supabase } from "../utils/supabaseClient";

export default function Profile({ user, onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🧑‍💼 Profile</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Log out
      </button>
    </div>
  );
}

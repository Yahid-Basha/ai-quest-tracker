// Signup/Login component placeholder
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else onAuth(data.session);
  };

  const handleSignup = async () => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else onAuth(data.session);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-4">Welcome back, Hero 🛡️</h1>
      <input
        className="border p-2 mb-2 rounded w-64"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 rounded w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function QuestSetup({ user, onSetupComplete }) {
  const [quests, setQuests] = useState({ main: "", side1: "", side2: "" });

  const getQuarter = () => {
    const month = new Date().getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${new Date().getFullYear()}`;
  };

  const saveQuests = async () => {
    const data = [
      { title: quests.main, is_main: true },
      { title: quests.side1, is_main: false },
      { title: quests.side2, is_main: false },
    ];

    for (const q of data) {
      await supabase.from("quests").insert({
        user_id: user.id,
        title: q.title,
        is_main: q.is_main,
        quarter: getQuarter(),
      });
    }

    onSetupComplete();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        🗓️ {getQuarter()} – Your Journey Begins
      </h1>
      <div className="space-y-4">
        {["main", "side1", "side2"].map((key, i) => (
          <input
            key={key}
            className={`w-full p-3 border rounded ${i === 0 ? "border-l-4 border-blue-500" : ""}`}
            placeholder={i === 0 ? "Main Quest" : `Side Quest ${i}`}
            value={quests[key]}
            onChange={(e) => setQuests({ ...quests, [key]: e.target.value })}
          />
        ))}
        <button
          onClick={saveQuests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save & Proceed
        </button>
      </div>
    </div>
  );
}

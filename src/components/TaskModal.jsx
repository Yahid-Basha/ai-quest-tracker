// Task completion modal placeholder
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function TaskModal({ task, user, onClose }) {
  const [proof, setProof] = useState(null);
  const [retryText, setRetryText] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const submitProof = async () => {
    const fileName = `${user.id}-${Date.now()}-${proof.name}`;
    const { data, error } = await supabase.storage
      .from("proofs")
      .upload(fileName, proof);
    const fileUrl = `https://jnuddaaruplcluuzsrbs.supabase.co/storage/v1/object/public/proofs/${fileName}`;

    const response = await fetch("/api/validate-proof", {
      method: "POST",
      body: JSON.stringify({
        image_url: fileUrl,
        text: retryCount > 0 ? retryText : null,
        task_id: task.id,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (result.valid) {
      await supabase
        .from("tasks")
        .update({
          status: "approved",
          proof_url: fileUrl,
          points_awarded: result.points,
        })
        .eq("id", task.id);

      const { data: userRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      await supabase
        .from("users")
        .update({
          total_score: (userRow.total_score || 0) + result.points,
        })
        .eq("id", user.id);
    } else {
      setRetryCount(retryCount + 1);
      if (retryCount >= 1) {
        await supabase
          .from("tasks")
          .update({ status: "rejected" })
          .eq("id", task.id);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">
          📸 Submit Proof for: {task.title}
        </h3>
        <input type="file" onChange={(e) => setProof(e.target.files[0])} />
        {retryCount > 0 && (
          <textarea
            className="w-full border mt-2 p-2 rounded"
            rows="3"
            placeholder="Explain your proof (2nd try only)"
            onChange={(e) => setRetryText(e.target.value)}
          />
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={submitProof}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

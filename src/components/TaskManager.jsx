// Task manager UI placeholder
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import TaskModal from "./TaskModal";

export default function TaskManager({ user }) {
  const [quests, setQuests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modalTask, setModalTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: questList } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", user.id);
      setQuests(questList || []);
    };
    fetchData();
  }, [user.id]);

  const loadTasks = useCallback(async () => {
    const { data: taskList } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);
    setTasks(taskList || []);
  }, [user.id]);

  useEffect(() => {
    loadTasks();
  }, [quests, loadTasks]);

  const addTask = async (questId) => {
    const title = prompt("Enter task title:");
    if (!title) return;
    await supabase.from("tasks").insert({
      user_id: user.id,
      quest_id: questId,
      title,
      status: "pending",
    });
    loadTasks();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">🎯 Manage Your Tasks</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div key={quest.id} className="p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{quest.title}</h3>
              <button
                onClick={() => addTask(quest.id)}
                className="text-blue-500 text-sm"
              >
                + Add
              </button>
            </div>
            <ul className="space-y-2">
              {tasks
                .filter((t) => t.quest_id === quest.id)
                .map((task) => (
                  <li
                    key={task.id}
                    className="border p-2 rounded flex justify-between items-center"
                  >
                    <span>{task.title}</span>
                    <button
                      className="bg-green-500 text-white px-2 rounded"
                      onClick={() => setModalTask(task)}
                      disabled={task.status !== "pending"}
                    >
                      {task.status === "pending" ? "Complete" : task.status}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {modalTask && (
        <TaskModal
          task={modalTask}
          user={user}
          onClose={() => {
            setModalTask(null);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

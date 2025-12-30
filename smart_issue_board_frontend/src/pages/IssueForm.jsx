import { useState } from "react";
import api from "../services/api";

export default function IssueForm({ onIssueCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.target;

    try {
      await api.post("/issues", {
        title: form.title.value,
        description: form.description.value,
        priority: form.priority.value,
        assignedTo: form.assignedTo.value,
      });

      form.reset();

      // notify dashboard
      onIssueCreated();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Similar issue already exists.");
      } else {
        setError("Failed to create issue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create New Issue</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Issue title" className="auth-input" required />
        <input name="assignedTo" placeholder="Assign to (email)" className="auth-input" required />

        <select name="priority" className="auth-input">
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <textarea
          name="description"
          placeholder="Issue description"
          className="auth-input md:col-span-2"
          rows="3"
          required
        />

        <button disabled={loading} className="auth-btn md:col-span-2">
          {loading ? "Creating..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
}

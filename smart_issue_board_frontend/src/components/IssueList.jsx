import { useEffect, useState } from "react";
import api from "../services/api";

export default function IssueList({ filters }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    const res = await api.get("/issues", {
      params: filters,
    });
    setIssues(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/issues/${id}/status`, { status });
      fetchIssues();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading issues...</p>;
  }

  if (issues.length === 0) {
    return <p className="text-gray-500">No issues found.</p>;
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white rounded-xl shadow p-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{issue.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {issue.description}
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium">Assigned:</span>{" "}
                {issue.assignedTo}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                issue.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : issue.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {issue.priority}
            </span>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm font-medium">
              Status: {issue.status}
            </p>

            <div className="space-x-2">
              {issue.status === "Open" && (
                <button
                  onClick={() => updateStatus(issue.id, "In Progress")}
                  className="btn-sm"
                >
                  Start
                </button>
              )}

              {issue.status === "In Progress" && (
                <button
                  onClick={() => updateStatus(issue.id, "Done")}
                  className="btn-sm"
                >
                  Mark Done
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

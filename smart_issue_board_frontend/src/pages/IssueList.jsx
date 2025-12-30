import { useEffect, useState } from "react";
import api from "../services/api";

export default function IssueList({ filters, refreshKey }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    const res = await api.get("/issues", { params: filters });
    setIssues(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, [filters, refreshKey]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/issues/${id}/status`, { status });
      fetchIssues();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (loading) return <p className="text-gray-500">Loading issues...</p>;
  if (issues.length === 0) return <p className="text-gray-500">No issues found.</p>;

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold">{issue.title}</h3>
          <p className="text-sm text-gray-600">{issue.description}</p>
        </div>
      ))}
    </div>
  );
}

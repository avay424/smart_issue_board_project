export default function Filters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4">
      <select
        className="auth-input w-48"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        className="auth-input w-48"
        value={filters.priority}
        onChange={(e) =>
          setFilters({ ...filters, priority: e.target.value })
        }
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}

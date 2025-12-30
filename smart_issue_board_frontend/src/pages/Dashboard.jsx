import { useState } from "react";
import IssueForm from "../components/IssueForm";
import IssueList from "../components/IssueList";
import Filters from "../components/Filters";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIssueCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold">Smart Issue Board</h1>
          <button onClick={logout} className="text-red-600 text-sm">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* pass callback */}
        <IssueForm onIssueCreated={handleIssueCreated} />
        <Filters filters={filters} setFilters={setFilters} />
        <IssueList filters={filters} refreshKey={refreshKey} />
      </main>
    </div>
  );
}

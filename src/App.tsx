import "./App.css";
import "./index.css";
import ListNotes from "./components/ListNotes";
import Login from "./components/Login";
import { useState, useEffect } from "react";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
        <p className="text-sm text-gray-700">
          Logged in as <span className="font-bold text-purple-700">{username}</span>
        </p>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          Logout
        </button>
      </div>

      <ListNotes />
    </div>
  );
}

export default App;

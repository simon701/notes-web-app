import "./index.css";
import ListNotes from "./components/ListNotes";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const username = localStorage.getItem("username");

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any=jwtDecode(token);
      return decoded.exp*1000<Date.now();
    } catch {
      return true;
    }
  };

  const autoLogout = (token: string) => {
    const decoded: any=jwtDecode(token);
    const expiryTime=decoded.exp*1000;
    const timeLeft=expiryTime-Date.now();

    setTimeout(() => {
      handleLogout();
      alert("Session expired. You have been logged out.");
    }, timeLeft);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      setAuthenticated(true);
      autoLogout(token);
    } else {
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => {
      setAuthenticated(true);
      const token = localStorage.getItem("token");
      if (token) autoLogout(token);
    }} />;
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

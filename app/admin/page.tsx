"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Copy, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [permissions, setPermissions] = useState({
    pre_primary: false,
    primary: false,
    jss: false,
    sss: false,
  });
  const [generatedPin, setGeneratedPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const generatePin = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 7; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setGeneratedPin("");

    if (!username) {
      setMessage("Please enter a username.");
      setLoading(false);
      return;
    }

    const newPin = generatePin();

    const { error } = await supabase.from("users").insert([
      {
        username: username,
        pin: newPin,
        can_access_pre_primary: permissions.pre_primary,
        can_access_primary: permissions.primary,
        can_access_jss: permissions.jss,
        can_access_sss: permissions.sss,
      },
    ]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setGeneratedPin(newPin);
      setMessage("User created successfully!");
      setUsername("");
      setPermissions({ pre_primary: false, primary: false, jss: false, sss: false });
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPin);
    alert("PIN copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Main Content Area */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Generate access PINs for new users.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., JohnDoe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Assign Access Levels</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.pre_primary}
                  onChange={(e) => setPermissions({ ...permissions, pre_primary: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Pre-Primary</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.primary}
                  onChange={(e) => setPermissions({ ...permissions, primary: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Primary</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.jss}
                  onChange={(e) => setPermissions({ ...permissions, jss: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Junior Secondary (JSS)</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.sss}
                  onChange={(e) => setPermissions({ ...permissions, sss: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Senior Secondary (SSS)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : "Generate User & PIN"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded ${generatedPin ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message}
            </div>
          )}

          {generatedPin && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col items-center">
              <span className="text-sm font-semibold text-yellow-800 mb-2">User PIN Generated:</span>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-mono font-bold tracking-widest text-gray-900">{generatedPin}</span>
                <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-blue-600">
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-yellow-700 mt-2 text-center">
                Send this PIN to <strong>{username || "the user"}</strong>. They will use it to log in.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Pushed to bottom */}
      <footer className="w-full bg-gray-200 text-center py-4 border-t border-gray-300">
        <p className="text-xs text-gray-600 font-semibold">
          © 2026 The Ideal Schools Ltd. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          Developed by The Ideal Schools Ltd | For: Raji Bashir (Nature Nurture Educational Consult)
        </p>
      </footer>
    </div>
  );
}
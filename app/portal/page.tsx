"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { BookOpen, LogOut, FileText, Download } from "lucide-react";

export default function UserPortal() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPermissions, setUserPermissions] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  // 1. Handle User Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if username and pin match a user in the database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("pin", pin)
      .single();

    if (userError || !user) {
      setError("Invalid Username or PIN. Please check and try again.");
      setLoading(false);
      return;
    }

    // User is valid! Save their permissions and log them in.
    setUserPermissions(user);
    setIsLoggedIn(true);
    fetchFiles(user);
  };

  // 2. Fetch files based on user permissions
  const fetchFiles = async (user: any) => {
    let allowedClasses: string[] = [];

    // Check which levels the admin assigned to this user
    if (user.can_access_pre_primary) allowedClasses.push("Pre-Nursery", "Nursery 1", "Nursery 2");
    if (user.can_access_primary) allowedClasses.push("Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6");
    if (user.can_access_jss) allowedClasses.push("JSS 1", "JSS 2", "JSS 3");
    if (user.can_access_sss) allowedClasses.push("SSS 1", "SSS 2", "SSS 3");

    // Fetch files that match the allowed classes
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .in("class_level", allowedClasses)
      .order("subject", { ascending: true });

    if (error) {
      console.error("Error fetching files:", error);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  // 3. Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPin("");
    setUserPermissions(null);
    setFiles([]);
  };

  // --- RENDER LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-4 text-blue-900">
            <BookOpen className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
            NERDC E-Lesson Portal
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to access your lesson notes.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">7-Digit PIN</label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                maxLength={7}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 tracking-widest font-mono"
                placeholder="e.g., A7B9X2Y"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Access Lesson Notes"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER USER DASHBOARD (After Login) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-bold">NERDC E-Lesson Portal</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {userPermissions?.username}</h2>
          <p className="text-gray-600">Here are your available lesson notes based on your access level.</p>
        </div>

        {files.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-500">
            No lesson notes have been uploaded for your access level yet. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div key={file.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-3 text-blue-600">
                    <FileText className="h-8 w-8" />
                    <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                      {file.class_level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{file.subject}</h3>
                  <p className="text-sm text-gray-500 mb-4">{file.term}</p>
                </div>
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> Open PDF Notes
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
       {/* Footer for User Portal */}
      <footer className="w-full bg-gray-200 text-center py-4 mt-10 border-t border-gray-300">
        <p className="text-xs text-gray-600 font-semibold">
          © 2026 The Ideal Schools Ltd. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          Developed by The Ideal Schools Ltd | For: Raji Bashir (Nature Nurture Educational Consult)
        </p>
      </footer>   </div>
  );
}
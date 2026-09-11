"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Upload, CheckCircle, RefreshCw } from "lucide-react";

export default function DeveloperUpload() {
  const [classLevel, setClassLevel] = useState("Primary 1");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState("1st Term");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  // Define the classes based on your images
  const classes = [
    "Pre-Nursery", "Nursery 1", "Nursery 2",
    "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
    "JSS 1", "JSS 2", "JSS 3",
    "SSS 1", "SSS 2", "SSS 3"
  ];

 const terms = ["All Terms (Combined)", "1st Term", "2nd Term", "3rd Term"];


  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!file || !subject) {
      setMessage("Please select a file and enter a subject name.");
      setLoading(false);
      return;
    }

    // 1. Upload the PDF to Supabase Storage
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("nerdc-pdfs")
      .upload(fileName, file);

    if (uploadError) {
      setMessage("Error uploading file: " + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from("nerdc-pdfs")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 3. Save the file details to the 'files' database table
    const { error: dbError } = await supabase.from("files").insert([
      {
        class_level: classLevel,
        subject: subject,
        term: term,
        file_url: publicUrl,
      },
    ]);

    if (dbError) {
      setMessage("Error saving to database: " + dbError.message);
    } else {
      setMessage("File uploaded successfully!");
      setSubject("");
      setFile(null);
      // Reset the file input visually
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6 flex items-center justify-center gap-2">
          <Upload className="h-6 w-6" /> Developer Upload Portal
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Upload PDF lesson notes for specific classes and subjects.
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Class Level</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {terms.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Subject Name</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Select PDF File</label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin h-5 w-5" /> : "Upload PDF to Database"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded text-center ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
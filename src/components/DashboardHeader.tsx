"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";

export function DashboardHeader() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Select an agent to view their performance analysis and coaching history.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <span>↑</span>
          Upload Transcripts
        </button>
      </div>

      {showUpload && <FileUpload onClose={() => setShowUpload(false)} />}
    </>
  );
}

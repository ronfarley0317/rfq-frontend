"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadQuote } from "@/app/actions/upload-quote";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <form action={uploadQuote} className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <UploadCloud className="w-16 h-16 text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">
            {file ? file.name : "Drop RFQ PDF, PNG, or Image here"}
          </p>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf,image/*"
          />
        </label>
        <button
          type="submit"
          disabled={!file}
          className="w-full px-4 py-2 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          Process Quote
        </button>
      </form>
    </div>
  );
}
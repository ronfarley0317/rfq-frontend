"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("rfqs")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      alert("Error uploading file.");
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("rfqs")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    const { error: insertError } = await supabase.from("rfqs").insert([
      {
        customer_name: "Pending Processing",
        status: "Pending",
        pdf_url: publicUrl,
      },
    ]);

    if (insertError) {
      console.error("Error inserting data:", insertError);
      alert("Error inserting data.");
      setIsUploading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <UploadCloud className="w-16 h-16 text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">
            {file ? file.name : "Drop RFQ PDF here"}
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full px-4 py-2 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {isUploading ? "Processing..." : "Process Quote"}
        </button>
      </div>
    </div>
  );
}
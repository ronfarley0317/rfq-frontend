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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("User not authenticated.");
      setIsUploading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const sanitizedFileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
    const cleanFileName = `${Date.now()}_${sanitizedFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("rfqs")
      .upload(cleanFileName, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      alert("Error uploading file.");
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("rfqs")
      .getPublicUrl(cleanFileName);

    const publicUrl = urlData.publicUrl;

    const { data: newRow, error: insertError } = await supabase.from("rfqs").insert([
      {
        customer_name: "Pending Processing",
        status: "Pending",
        file_url: publicUrl,
      },
    ]).select('id').single();

    if (insertError || !newRow) {
      console.error("Error inserting data:", insertError);
      alert("Error inserting data.");
      setIsUploading(false);
      return;
    }

    // Trigger n8n webhook (non-blocking)
    fetch("/api/process-rfq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_url: publicUrl,
        user_email: user.email,
        record_id: newRow.id,
      }),
    }).catch((error) => console.error("Error triggering webhook:", error));

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <label className="flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <UploadCloud className="w-16 h-16 text-gray-400" />
          <p className="mt-4 text-lg text-gray-600">
            {file ? file.name : "Drop RFQ PDF, PNG, or Image here"}
          </p>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="application/pdf,image/*"
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
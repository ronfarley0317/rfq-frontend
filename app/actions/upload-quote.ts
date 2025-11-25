"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadQuote(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const userEmail = user.data.user?.email;

  if (!userId || !userEmail) {
    throw new Error("User not found");
  }

  // Generate a unique filename to avoid conflicts
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFileName = `${timestamp}-${cleanFileName}`;

  // Upload file to Supabase storage
  const { data: fileData, error: fileError } = await supabase.storage
    .from("rfqs")
    .upload(`${userId}/${uniqueFileName}`, file);

  if (fileError) {
    console.error("Error uploading file:", fileError);
    throw new Error(`Error uploading file: ${fileError.message} (Code: ${fileError.name})`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("rfqs")
    .getPublicUrl(fileData.path);

  // Insert a new record into the 'rfqs' table
  const { data: quoteData, error: quoteError } = await supabase
    .from("rfqs")
    .insert([
      {
        user_id: userId,
        pdf_url: publicUrlData.publicUrl,
        status: "processing",
      },
    ])
    .select();

  if (quoteError) {
    console.error("Error inserting quote:", quoteError);
    throw new Error(`Error inserting quote: ${quoteError.message} (Code: ${quoteError.code})`);
  }

  const recordId = quoteData[0]?.id;

  if (recordId) {
    // Trigger n8n webhook
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/process-rfq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdf_url: publicUrlData.publicUrl,
          user_email: userEmail,
          record_id: recordId,
        }),
      });

      if (!response.ok) {
        console.error('Failed to trigger n8n webhook:', await response.text());
      }
    } catch (error) {
      console.error('Error triggering n8n webhook:', error);
      // Continue anyway - don't block the user flow
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

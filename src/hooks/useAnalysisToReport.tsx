"use client";
import { IClaudeResponse } from "@/types";
import { fileToBase64 } from "@/utils";
import { useState } from "react";

const useAnalysisToReport = () => {
  const [content, setContent] = useState<IClaudeResponse | null>(null);

  const submitFileToAnalysis = async (id: string, file: File) => {
    const base64 = await fileToBase64(file as File);

    await fetch("/api/aws/s3", {
      method: "POST",
      body: JSON.stringify({
        uploadParams: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
          Key: `${id}/document.pdf`, // e.g. 'reports/my-report.pdf'
          Body: "",
          ContentType: "application/pdf",
          ContentEncoding: "base64",
        },
        payload: base64,
        contentType: "application/pdf",
      }),
    });

    const resp = await fetch("/api/claude/sonnet4", {
      method: "POST",
      body: JSON.stringify({
        payload: base64,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const payload = await resp.json();
    setContent(payload as IClaudeResponse);
    console.log(payload);

    await fetch("/api/aws/s3", {
      method: "POST",
      body: JSON.stringify({
        uploadParams: {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
          Key: `${id}/content.json`,
          Body: "",
          ContentType: "application/json",
        },
        payload: JSON.stringify(payload),
        contentType: "application/json",
      }),
    });
  };
  return {
    content,
    submitFileToAnalysis,
  };
};

export { useAnalysisToReport };

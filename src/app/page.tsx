"use client";
import { IClaudeResponse } from "@/types";
import { fileToBase64 } from "@/utils";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-west-2", // replace with your region
  endpoint: "http://localhost:9000", // 👈 Your MinIO server URL
  forcePathStyle: true,
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
});

export async function uploadJsonToS3(
  payload: string,
  bucket: string,
  key: string,
) {
  const uploadParams = {
    Bucket: bucket,
    Key: key, // e.g. 'reports/my-report.pdf'
    Body: JSON.stringify(payload),
    ContentType: "application/json",
  };
  const command = new PutObjectCommand(uploadParams);
  try {
    const response = await s3.send(command);
    console.log("Upload successful:", response);
    return response;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

export async function uploadPdfToS3(
  base64Data: string,
  bucket: string,
  key: string,
) {
  // Convert to Buffer
  const pdfBuffer = Buffer.from(base64Data, "base64");

  const uploadParams = {
    Bucket: bucket,
    Key: key, // e.g. 'reports/my-report.pdf'
    Body: pdfBuffer,
    ContentType: "application/pdf",
    ContentEncoding: "base64",
  };

  const command = new PutObjectCommand(uploadParams);
  try {
    const response = await s3.send(command);
    console.log("Upload successful:", response);
    return response;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<IClaudeResponse | null>(null);
  const myuuid = uuidv4();

  return (
    <div
      className="w-screen h-screen 
      flex flex-col justify-center
      content-center items-center align-middle
      p-10"
    >
      <div className="flex flex-col space-y-2 w-7/12">
        <h2 className="self-start text-2xl w-full animate-pulse">
          Hello World, upload your bank statement here for scanning 😜
        </h2>
        <input
          type="file"
          id="file"
          className="flex p-3
            rounded-lg
            bg-emerald-400
            text-black font-bold
            file:bg-purple-500
            file:p-2
            file:rounded-md
            file:hover:bg-purple-600
            file:text-slate-300
            file:pointer-events-auto
            pointer-events-none
            file:cursor-pointer
            "
          onChange={(e) => {
            e.preventDefault();
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
            console.log(e.target.files);
          }}
        />
        <button
          className={`p-3 bg-sky-300 hover:bg-sky-500 
          rounded-lg w-1/2 self-end text-black
          font-bold transition origin-top cursor-pointer
          ${file !== null ? "scale-y-100" : "scale-y-0"}`}
          onClick={async (e) => {
            e.preventDefault();
            console.log(myuuid);
            const base64 = await fileToBase64(file as File);
            await uploadPdfToS3(
              base64 as string,
              "my-bucket",
              `${myuuid}/document.pdf`,
            );

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
            await uploadJsonToS3(
              payload,
              "my-bucket",
              `${myuuid}/content.json`,
            );
          }}
        >
          Submit
        </button>
        {content !== null && <div>{JSON.stringify(content)}</div>}
      </div>
    </div>
  );
}

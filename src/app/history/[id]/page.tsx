"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IClaudeResponse } from "@/types";

const s3 = new S3Client({
  region: "eu-west-2", // replace with your region
  endpoint: "http://localhost:9000", // 👈 Your MinIO server URL
  forcePathStyle: true,
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
});

export default function History({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState("");
  const [content, setContent] = useState<IClaudeResponse | null>(null);

  useEffect(() => {
    const getData = async () => {
      const command = new GetObjectCommand({
        Bucket: "my-bucket",
        Key: `${id}/document.pdf`,
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      console.log(url);
      setSignedUrl(url);

      const commandContent = new GetObjectCommand({
        Bucket: "my-bucket",
        Key: `${id}/content.json`,
      });
      const response = await s3.send(commandContent);
      const bodyText = await response.Body!.transformToString();
      console.log(bodyText);
      const jsonData = JSON.parse(bodyText);
      console.log(jsonData);
      setContent(jsonData);
    };
    getData();
  }, []);

  return (
    <div
      className="
    w-screen h-screen
    p-10 flex flex-col space-y-2"
    >
      <h1
        className="flex basis-1/12 self-start 
      text-2xl w-full align-middle items-center
      content-center"
      >
        Hello, Document {id}'s Details
      </h1>
      <div className="flex flex-row basis-11/12 space-x-2">
        <div className="w-full h-full relative">
          {signedUrl !== "" && (
            <iframe src={signedUrl} className="w-full h-full" />
          )}
        </div>

        <div className="w-full p-5 space-y-2">
          <h4
            className="bg-amber-500 
            text-black
            rounded-md px-2 py-1
            text-2xl"
          >
            Name: {content?.name}
          </h4>
          <h4
            className="bg-amber-500 
            text-black
            rounded-md px-2 py-1
            text-2xl"
          >
            Address: {content?.address}
          </h4>
          <h4
            className="bg-amber-500 
            text-black
            rounded-md px-2 py-1
            text-2xl"
          >
            Date: {content?.date}
          </h4>
          <h4
            className="bg-amber-500 
            text-black
            rounded-md px-2 py-1
            text-2xl"
          >
            Starting Balance: {content?.["starting-balance"]}
          </h4>
          <h4
            className="bg-amber-500 
            text-black
            rounded-md px-2 py-1
            text-2xl"
          >
            Ending Balance: {content?.["ending-balance"]}
          </h4>
        </div>
      </div>
    </div>
  );
}

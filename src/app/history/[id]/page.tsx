"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { IClaudeResponse } from "@/types";

export default function History({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [content, setContent] = useState<IClaudeResponse | null>(null);

  useEffect(() => {
    const getData = async () => {
      const resp = await fetch("/api/aws/s3", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'bucket-key': `${id}/content.json`
        }
      })
      const jsonData = await resp.json();
      console.log(jsonData);
      setContent(jsonData);
    };
    getData();
  }, []);

  return (
    <div
      className="
    w-screen h-screen
    p-2 sm:p-10 
    flex flex-col space-y-2
    "
    >
      <div className="flex flex-col justify-start">
        <h1
          className="flex basis-1/12 self-start 
      text-2xl w-full align-middle items-center
      content-center"
        >
          Hello, Document {id}&apos;s Details
        </h1>
        <button
          className="fit 
        bg-sky-400 hover:bg-sky-600 
        rounded-lg p-2 text-black
        font-bold self-start"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          Back
        </button>
      </div>

      <div
        className="flex basis-10/12
        flex-col sm:flex-row
        space-y-2 sm:space-y-0
        space-x-0 sm:space-x-2
        "
      >
        <div className="w-full h-full relative">
          <iframe 
            // src={signedUrl}
            // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            src={`/api/aws/file/${id}`} 
            className="w-full h-full" />
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
          <div
            className="flex flex-col space-y-2
            bg-amber-500 rounded-md px-2 py-1
            overflow-y-auto
            text-black text-2xl
            max-h-[33vh]
          "
          >
            <span className="">Transactions: </span>
            {content?.transactions.map((x, idx) => (
              <h4
                className="px-1 text-black text-xl
                  bg-amber-600 rounded-sm"
                key={`transaction-${idx}`}
              >
                {x}
              </h4>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { IClaudeResponse } from "@/types";
import { fileToBase64 } from "@/utils";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
          }}
        >
          Submit
        </button>
        {content !== null && <div>{JSON.stringify(content)}</div>}
      </div>
    </div>
  );
}

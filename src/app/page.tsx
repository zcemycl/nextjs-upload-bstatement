"use client";
import {useState} from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="w-screen h-screen 
      flex flex-col justify-center
      content-center items-center align-middle
      p-10">
        <div className="flex flex-col space-y-2 w-7/12">
        <h2 className="self-start text-2xl w-full animate-pulse">
          Hello World, upload your bank statement here for scanning 😜</h2>
        <input type="file" id="file"
          className="*flex p-3
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
        <button className={
          `p-3 bg-sky-300 hover:bg-sky-500 
          rounded-lg w-1/2 self-end text-black
          font-bold transition origin-top
          ${ file !== null ? 'scale-y-100' : 'scale-y-0'}`}>
            Submit
        </button>
        </div>
        
    </div>
  );
}

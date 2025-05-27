"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useReportHistory } from "@/hooks";

export default function History({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { content, isValidate, isLoading } = useReportHistory({ id });

  return (
    <div
      className={`
        w-screen h-screen
        p-2 sm:p-10 
        flex flex-col space-y-2
        ${isLoading ? "animate-pulse" : ""}
    `}
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
          className="fit cursor-pointer
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
            className="w-full h-full"
          />
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
            <span
              className="flex flex-row 
              content-center items-center
              space-x-2"
            >
              <p>Transactions: </p>
              <div
                className={`p-1 rounded-md ${isValidate ? "bg-emerald-300" : "bg-red-500"}`}
              >
                {isValidate ? "Verified" : "Not Valid"}
              </div>
            </span>
            {content?.transactions.map((x, idx) => (
              <span
                className="px-1 text-black text-sm
                  bg-amber-600 rounded-sm
                  flex flex-row justify-between
                  content-center items-center"
                key={`transaction-${idx}`}
              >
                <div className="basis-11/12">{x.title}</div>
                <div
                  className={`basis-1/12
                  rounded-md p-1
                  ${x.value > 0 ? "bg-emerald-300" : "bg-red-500"}
                  `}
                >
                  {x.value}
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { IClaudeResponse, ITransaction } from "@/types";
import { useEffect, useState } from "react";

const useReportHistory = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<IClaudeResponse | null>(null);
  const [isValidate, setIsValidate] = useState(false);

  useEffect(() => {
    if (content !== null) {
      setIsLoading(false);
    }
  }, [content]);

  useEffect(() => {
    const getData = async () => {
      const resp = await fetch("/api/aws/s3", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "bucket-key": `${id}/content.json`,
        },
      });
      const jsonData = await resp.json();
      console.log(jsonData);
      setContent(jsonData);
      const transactionsSum = jsonData.transactions
        .map((v: ITransaction) => v.value)
        .reduce((partialSum: number, a: number) => partialSum + a, 0);
      console.log(jsonData?.["starting-balance"] + transactionsSum);
      console.log(jsonData?.["ending-balance"]);
      setIsValidate(
        jsonData?.["starting-balance"] + transactionsSum ===
          jsonData?.["ending-balance"],
      );
    };
    // setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  return { isLoading, content, isValidate };
};

export { useReportHistory };

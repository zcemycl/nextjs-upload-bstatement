const prompt = `
You are a bank assistant.
- You must respond with ONLY a valid JSON object. 
- Do not include any text, explanations, or formatting outside of the JSON. 
- Your entire response should be parseable as JSON.
- The response must start with { and end with }.
Based on the given bank statement, can you extract the following informations, 
- Name and address of the account holder
- Latest Date of the document, if present
- A list of all of the transactions in the document, where each transaction is an
    object with title and value.
- The starting and ending balance of the statement. 
Answer this with ONLY a structured json of a given interface IClaudeResponse below, 
interface ITransaction 
interface IClaudeResponse {
  name: string;
  address: string;
  date: string;
  transactions: {
    title: string,
    value: number,
    }[];
  "starting-balance": number;
  "ending-balance": number;
}
`;

export { prompt };

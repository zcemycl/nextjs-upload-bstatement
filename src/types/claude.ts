interface IClaudeResponse {
  name: string;
  address: string;
  date: string;
  transactions: string[];
  "starting-balance": number;
  "ending-balance": number;
}

export type { IClaudeResponse };

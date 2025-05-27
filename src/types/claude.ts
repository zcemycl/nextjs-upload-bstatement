interface ITransaction {
  title: string,
  value: number,
}

interface IClaudeResponse {
  name: string;
  address: string;
  date: string;
  transactions: ITransaction[];
  "starting-balance": number;
  "ending-balance": number;
}

export type { IClaudeResponse, ITransaction };

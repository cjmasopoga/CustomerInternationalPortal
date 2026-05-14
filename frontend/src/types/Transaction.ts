export interface Transaction {
  id?: string;
  userId: string;
  recipientName: string;
  recipientEmail: string;
  recipientCountry: string;
  recipientBankName: string;
  accountNumber: string;
  swiftCode: string;
  amount: string;
  currency: string;
  purpose: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  transactionId: string;
}

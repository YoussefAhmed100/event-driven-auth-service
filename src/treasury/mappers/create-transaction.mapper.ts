import { Types } from 'mongoose';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

export const mapCreateTransaction = (
  dto: CreateTransactionDto,
  userId: string,
) => {
  return {
    type: dto.type,
    amount: dto.amount,
    category: dto.category,
    source: dto.source,
    linkedDeal: dto.linkedDeal
      ? new Types.ObjectId(dto.linkedDeal)
      : undefined,
    salesAgent: dto.salesAgent
      ? new Types.ObjectId(dto.salesAgent)
      : undefined,
    date: dto.date,
    notes: dto.notes,
    createdBy: new Types.ObjectId(userId),
  };
};
import { Types } from 'mongoose';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

export const mapUpdateTransaction = (dto: UpdateTransactionDto) => {
  const mapped: Partial<any> = { ...dto };

  if (dto.linkedDeal) mapped.linkedDeal = new Types.ObjectId(dto.linkedDeal);
  if (dto.salesAgent) mapped.salesAgent = new Types.ObjectId(dto.salesAgent);
  if (dto.date) mapped.date = new Date(dto.date);

 
  delete mapped.createdBy;

  return mapped;
};
import { EverydayCompletedDate, Task } from '@prisma/client';

export interface TaskWithDates extends Task {
  everydayCompletedDates: EverydayCompletedDate[];
}

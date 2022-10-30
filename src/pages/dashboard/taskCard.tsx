import { formatPrismaDate, numberToMonth } from '@/src/utils/dateHelper';
import { EverydayTask } from '@prisma/client';
import React from 'react';

function TaskCard({ task }: { task: EverydayTask }) {
  return (
    <div>
      <div className='flex flex-col items-start p-4 max-w-sm rounded-lg border shadow-md bg-slate-800 border-slate-700'>
        <h2 className='mx-0 py-0'>{task.name}</h2>
        <h3 className='mb-3 font-normal text-gray-400'>{task.description}</h3>
        <h3 className='mb-3 font-normal text-gray-400'>
          Created: {formatPrismaDate(task.createdAt)}
        </h3>
        <h3 className='mb-3 font-normal text-gray-400'>
          Updated: {formatPrismaDate(task.updatedAt)}
        </h3>

        <button className='btn w-20 mx-0'>
          Edit
          <svg
            aria-hidden='true'
            className='ml-2 -mr-1 w-4 h-4'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
              clipRule='evenodd'></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskCard;

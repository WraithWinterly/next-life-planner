import { formatPrismaDate } from '@utils/dateHelper';
import { Task, TaskType } from '@prisma/client';
import Router from 'next/router';
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Checkbox from '../ui-common/checkbox';

function TaskCard({ task }: { task: Task }) {
  const [checked, setChecked] = React.useState(task.completed);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <div>
      <div
        className={`flex flex-col items-start text-start p-4 max-w-sm rounded-lg border shadow-md bg-slate-800 border-slate-700 ${
          task.completed ? 'border-green-600' : 'border-yellow-600'
        }`}>
        <Checkbox label={task.name} value={checked} onChange={handleChange} />
        <h3 className='mb-3 font-normal break-words text-gray-400 w-full'>
          {task.description}
        </h3>
        <h3 className='mb-3 font-normal text-gray-400'>
          Created <b>{formatPrismaDate(task.createdAt)}</b>
        </h3>

        <div className='flex justify-start items-center'>
          <button
            className='btn w-20 mx-0'
            onClick={() => {
              Router.push(`/edit/${task.id}`);
            }}>
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
          <button className='btn'>
            <TrashIcon className='w-6 h-6 text-red-500' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;

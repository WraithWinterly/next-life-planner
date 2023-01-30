import { formatDate, FormatType } from '@utils/dateHelper';
import { TaskType } from '@prisma/client';
import Router from 'next/router';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Checkbox from '../ui-common/checkbox';
import { useUserContext } from '@/src/userContext/userContext';
import { TaskWithDates } from '@/src/types/types';

interface TaskCardProps {
  task: TaskWithDates;
  selectedDate: Date | undefined;
  setCurrentDeleteTask: Dispatch<SetStateAction<TaskWithDates | null>>;
  handleDeletePressed: () => void;
}

function TaskCard({
  task,
  selectedDate,
  setCurrentDeleteTask,
  handleDeletePressed,
}: TaskCardProps) {
  const ctx = useUserContext();

  const [taskChecked, setTaskChecked] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskChecked(e.target.checked);
    if (task.taskType === TaskType.TODAY) {
      task.completed = e.target.checked;
    }
    ctx.toggleCompletionTask(
      task.id,
      e.target.checked,
      task.taskType === TaskType.EVERYDAY ? selectedDate : undefined
    );
  };

  useEffect(() => {
    if (!selectedDate) return;

    setTaskChecked(
      task.taskType === TaskType.TODAY
        ? task.completed
        : task.taskType === TaskType.EVERYDAY
        ? task.everydayCompletedDates
            .map((date) => formatDate(date.date, FormatType.YEAR_MONTH_DAY))
            .includes(formatDate(selectedDate, FormatType.YEAR_MONTH_DAY))
        : false
    );
  }, [task, selectedDate]);

  return (
    <div>
      <div
        className={` slide-in-from-bottom-10 fade-in flex flex-col items-start text-start p-4 w-full rounded-lg border shadow-md bg-slate-800 border-slate-700 ${
          taskChecked ? 'border-green-600' : 'border-yellow-600'
        }`}>
        <Checkbox
          label={task.name}
          value={taskChecked}
          onChange={handleChange}
        />
        <h3 className='mb-3 font-normal break-words text-gray-400 w-full'>
          {task.description}
        </h3>

        {task.taskType === TaskType.TODAY && (
          <h3 className='mb-3 font-normal text-gray-400'>
            Due <b>{formatDate(task.todayTaskDate)}</b>
          </h3>
        )}

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
          <button
            className='btn'
            onClick={() => {
              setCurrentDeleteTask(task);
              handleDeletePressed();
            }}>
            <TrashIcon className='w-6 h-6 text-red-500' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;

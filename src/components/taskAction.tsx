import LoadingScreen from '@/src/components/ui-common/loadingScreen';
import {
  postEverydayTask,
  postDayTask,
  updateEverydayTaskById,
  updateDayTaskById,
} from '@/src/utils/apiHandler';
import { DayTask, EverydayTask } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

function TaskAction({
  action,
  type,
  editTaskData,
}: {
  action: 'create' | 'edit';
  type: 'day' | 'everyday';
  editTaskData?: DayTask | EverydayTask;
}) {
  const [taskData, setTaskData] = useState<EverydayTask | DayTask>({
    name: '',
    description: '',
  } as EverydayTask | DayTask);

  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (action == 'edit' && !!editTaskData?.name) {
      setTaskData(editTaskData as DayTask | EverydayTask);
    }
  }, [editTaskData]);

  const handleChange = (target: 'name' | 'description', e: any) => {
    setTaskData((data) => {
      const newData = data;
      newData[target] = e.target.value;
      return newData;
    });
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true);

      type === 'everyday'
        ? await postEverydayTask([taskData])
        : await postDayTask([taskData]);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    try {
      setLoading(true);

      type === 'everyday'
        ? await updateEverydayTaskById([taskData])
        : await updateDayTaskById([taskData]);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const InputField = ({
    name,
    target,
    error,
    maxLength,
    handleChange,
  }: {
    name: string;
    target: 'name' | 'description';
    error: boolean;
    maxLength: number;
    handleChange: (target: 'name' | 'description', e: any) => void;
  }) => {
    return (
      <div className='text-start'>
        <label htmlFor='taskDescription' className='input-label'>
          {name}
        </label>
        {error && <p className='text-red-600'>*This field is required.</p>}
        <input
          className='input-field'
          id={name}
          defaultValue={String(taskData[target])}
          maxLength={maxLength}
          autoComplete='off'
          onChange={(e) => {
            handleChange(target, e);
          }}
        />
      </div>
    );
  };

  return (
    <>
      {loading && (
        <LoadingScreen
          text={`${action == 'create' ? 'Creating Task' : 'Submitting Edit'}`}
        />
      )}

      <div className='flex flex-col items-center'>
        {type === 'everyday' ? (
          <>
            {action === 'create' ? (
              <h1>Create a new daily task</h1>
            ) : (
              <h1>Edit daily task</h1>
            )}

            <h2>
              This task will show up every day. You will set a goal to do this
              every day.
            </h2>
          </>
        ) : (
          <>
            {action === 'create' ? (
              <h1>Create task for Today</h1>
            ) : (
              <h1>Edit task for Today</h1>
            )}
            <h2>This task is for today only.</h2>
          </>
        )}

        <div className='flex flex-col gap-3 items-center justify-center w-80'>
          <div className='mt-4 flex flex-col gap-3 w-full'>
            <InputField
              name='Task Name'
              target='name'
              error={submitError}
              maxLength={50}
              handleChange={handleChange}
            />
            <InputField
              name='Task Description'
              target='description'
              error={submitError}
              maxLength={50}
              handleChange={handleChange}
            />
          </div>
          <div className='mt-4 flex gap-3'>
            <button
              type='button'
              className='btn mx-0 gap-2'
              onClick={() => router.push('/dashboard')}>
              <div className='tw-btn-icon'>
                <ArrowLeftIcon aria-hidden='false' />
              </div>
              Back
            </button>
            <button
              type='button'
              className='btn mx-0 gap-2'
              onClick={async () => {
                setSubmitError(false);
                if (taskData?.name == '' || taskData?.name == null) {
                  setSubmitError(true);
                  return;
                }
                setSubmitError(false);
                if (action === 'create') {
                  handleCreateTask();
                } else {
                  handleEditTask();
                }
              }}>
              {action === 'create' ? 'Create Daily Task' : 'Submit Edit'}
              <div className='tw-btn-icon'>
                <PlusIcon aria-hidden='false' />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskAction;

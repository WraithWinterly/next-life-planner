import LoadingScreen from '@components/ui-common/loadingScreen';

import { Task, TaskType } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import ListBox from './ui-common/listBox';
import { useUserContext } from '../userContext/userContext';
import { APICreateTask } from '../pages/api/v1/types';
import { formatDate, FormatType } from '../utils/dateHelper';

interface TaskActionProps {
  action: 'create' | 'edit';
  editTaskData?: Task;
}

function TaskAction({ action, editTaskData }: TaskActionProps) {
  const [taskData, setTaskData] = useState<Task>({
    name: '',
    description: '',
    taskType: TaskType.TODAY,
  } as Task);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const router = useRouter();
  const ctx = useUserContext();

  useEffect(() => {
    if (action == 'edit' && !!editTaskData?.name) {
      setTaskData(editTaskData as Task);
    }
  }, [editTaskData]);

  const { type } = router.query;

  const handleChange = (target: 'name' | 'description', e: any) => {
    setTaskData((data: any) => {
      const newData = data;
      newData[target] = e.target.value;
      return newData;
    });
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      await ctx.createTask(taskData as APICreateTask);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    try {
      setLoading(true);
      await ctx.updateTask(taskData);
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
    required,
    maxLength,
    handleChange,
  }: {
    name: string;
    target: 'name' | 'description';
    error: boolean;
    required: boolean;
    maxLength: number;
    handleChange: (target: 'name' | 'description', e: any) => void;
  }) => {
    return (
      <div className='text-start'>
        <label htmlFor='taskDescription' className='input-label'>
          {name}
        </label>
        {error && required && (
          <p className='text-red-600'>*This field is required.</p>
        )}
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
        {action === 'create' ? (
          <h1>Create Task</h1>
        ) : (
          <h1>
            {taskData.taskType === TaskType.EVERYDAY
              ? 'Edit Everyday Task'
              : 'Edit Task'}
          </h1>
        )}

        <div className='flex flex-col gap-3 items-center justify-center w-80'>
          <div className='mt-4 flex flex-col gap-3 w-full'>
            {action === 'create' && (
              <ListBox
                label='Task Type'
                defaultValueIndex={type === TaskType.TODAY ? 0 : 1}
                selections={[
                  'Create a task for only Today',
                  'Create a task for Everyday',
                ]}
                handleSelection={(value) => {
                  if (value === 'Create a task for only Today') {
                    taskData.taskType = TaskType.TODAY;
                  } else if (value === 'Create a task for Everyday') {
                    taskData.taskType = TaskType.EVERYDAY;
                  }
                }}
              />
            )}

            <InputField
              name='Task Name'
              target='name'
              error={submitError}
              required={true}
              maxLength={50}
              handleChange={handleChange}
            />
            <InputField
              name='Task Description'
              target='description'
              error={submitError}
              required={false}
              maxLength={50}
              handleChange={handleChange}
            />
            {taskData.taskType === TaskType.TODAY && action === 'edit' && (
              <div className='text-left'>
                <h3>Task Date</h3>
                <p>
                  {formatDate(
                    taskData.todayTaskDate,
                    FormatType.WITH_WEEKDAY_WITHOUT_TIME
                  )}
                </p>
              </div>
            )}
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

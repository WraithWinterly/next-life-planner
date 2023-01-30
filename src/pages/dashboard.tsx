import { useState, useEffect, useId } from 'react';
import Layout from '@components/layout';

import TaskCard from '@components/dashboard/taskCard';

import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui-common/loadingSpinner';
import { TaskType } from '@prisma/client';
import { useUserContext } from '../userContext/userContext';
import Modal from '../components/ui-common/modal';

import DatePickerModal from '../components/ui-common/datePickerModal';
import { formatDate, FormatType } from '../utils/dateHelper';
import { TaskWithDates } from '../types/types';
import { setDate } from 'date-fns';

export default function Dashboard() {
  const id = useId();

  const ctx = useUserContext();

  const session = useSession();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [currentDeleteTask, setCurrentDeleteTask] =
    useState<TaskWithDates | null>(null);

  const [dateModalOpen, setDateModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [displayedTasks, setDisplayedTasks] = useState<TaskWithDates[]>([]);

  useEffect(() => {
    if (!ctx.tasks || ctx.tasks?.length < 1) return;
    if (!selectedDate) return;

    localStorage.setItem('selectedDate', JSON.stringify(selectedDate) || '');

    setDisplayedTasks(() => {
      let todaysTasks = ctx.tasks?.filter(
        (task) => task.taskType === TaskType.TODAY
      );
      todaysTasks = todaysTasks?.filter(
        (task) => new Date(task.createdAt).getDate() === selectedDate?.getDate()
      );
      let everydayTasks = ctx.tasks?.filter(
        (task) => task.taskType === TaskType.EVERYDAY
      );

      return [...(todaysTasks || []), ...(everydayTasks || [])];
    });
  }, [ctx.tasks, selectedDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let date = localStorage.getItem('selectedDate');
      if (!!date) {
        setSelectedDate(new Date(JSON.parse(date)));
      } else {
        setSelectedDate(new Date());
      }
      // cleanup
      return () => clearTimeout(timeout);
    }, 100);
  }, []);

  const handleDeletePressed = () => {
    setDeleteModalOpen(true);
  };

  const DashboardSection = ({
    title,
    createButtonText,
    createButtonLink,
    taskType,
  }: {
    title: string;
    createButtonText: string;
    createButtonLink: string;
    taskType: TaskType;
  }) => {
    return (
      <div className='flex flex-col items-stretch w-[400px]'>
        <h2>{title}</h2>
        <button
          className='btn h-12 gap-2'
          onClick={() => Router.push(createButtonLink)}>
          <p>{createButtonText}</p>
          <div className='tw-btn-icon'>
            <PlusIcon />
          </div>
        </button>

        <div
          className={`p-6 from-slate-800 to-slate-900 bg-gradient-to-br rounded-lg flex flex-col ${
            !displayedTasks ? 'items-center' : 'items-left'
          } gap-3`}>
          {taskType === TaskType.TODAY &&
            displayedTasks.filter((task) => task.taskType === TaskType.TODAY)
              .length === 0 && (
              <p className='mt-0 pt-0 items-start align-top'>
                There are no tasks here.
              </p>
            )}

          {taskType === TaskType.EVERYDAY &&
            displayedTasks.filter((task) => task.taskType === TaskType.EVERYDAY)
              .length === 0 && <p className=''>There are no tasks here.</p>}
          {!ctx.tasks && <LoadingSpinner />}
          {!!displayedTasks && displayedTasks.length > 0 && (
            <ul className='flex flex-col gap-3'>
              {displayedTasks.map(
                (task, i) =>
                  task.taskType === taskType && (
                    <TaskCard
                      task={task}
                      selectedDate={selectedDate}
                      handleDeletePressed={handleDeletePressed}
                      setCurrentDeleteTask={setCurrentDeleteTask}
                      key={`${id}-${i}`}
                    />
                  )
              )}
            </ul>
          )}
        </div>
      </div>
    );
  };

  if (!ctx.signedIn && session.status != 'loading') {
    return (
      <Layout title='Dashboard'>
        <h1>You must be signed in to access this page.</h1>
        <div className='w-full flex justify-center'>
          <button
            className='btn btn-lg'
            onClick={() => {
              signIn();
            }}>
            Sign In Now
          </button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title='Dashboard'>
      <Modal
        title={`Delete ${currentDeleteTask?.name}?`}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}>
        <p>
          {!!currentDeleteTask?.description ? (
            `Description: ${currentDeleteTask?.description}`
          ) : (
            <em>No Description</em>
          )}
        </p>
        <p>Are you sure you want to delete this task?</p>
        <div className='flex mt-2 gap-2'>
          <button
            className='btn mx-0'
            onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </button>
          {!!currentDeleteTask && (
            <button
              className='btn btn-danger'
              onClick={async () => {
                await ctx.deleteTaskById(currentDeleteTask!.id);
                setDeleteModalOpen(false);
              }}>
              Delete
            </button>
          )}
        </div>
      </Modal>

      {/* Date Section */}
      <div>
        <div className='flex flex-col items-center'>
          {/* Top Section */}
          <div className='flex justify-center items-center'>
            {/* Left arrow */}
            <button
              className='btn'
              onClick={() => {
                if (!selectedDate) return;

                setSelectedDate(
                  (date) => new Date(date!.setDate(date!.getDate() - 1))
                );
              }}>
              <div className='tw-btn-icon'>
                <ArrowLeftIcon />
              </div>
            </button>
            <button
              className='btn w-72 h-10'
              onClick={() => {
                setDateModalOpen(true);
              }}>
              {/* {selectedDate && <h3>{selectedDate.toDateString()}</h3>} */}
              {selectedDate && (
                <h3>
                  {formatDate(
                    selectedDate,
                    FormatType.WITH_WEEKDAY_WITHOUT_TIME
                  )}
                </h3>
              )}
            </button>

            <button
              className='btn'
              onClick={() => {
                if (!selectedDate) return;

                setSelectedDate(
                  (date) => new Date(date!.setDate(date!.getDate() + 1))
                );
              }}>
              <div className='tw-btn-icon'>
                <ArrowRightIcon />
              </div>
            </button>
          </div>
          <div className='flex justify-center items-center'>
            <button
              className={`btn 
              ${
                selectedDate?.toDateString() ===
                  new Date(
                    new Date()!.setDate(new Date()!.getDate() - 1)
                  ).toDateString() && 'bg-green-700 hover:bg-green-600'
              }`}
              onClick={() => {
                setSelectedDate(() => {
                  const date = new Date();
                  date.setDate(date.getDate() - 1);
                  return date;
                });
              }}>
              Yesterday
            </button>
            <button
              className={`btn 
              ${
                selectedDate?.toDateString() === new Date().toDateString() &&
                'bg-green-700 hover:bg-green-600'
              }`}
              onClick={() => {
                setSelectedDate(new Date());
              }}>
              Today
            </button>
            <button
              className={`btn 
              ${
                selectedDate?.toDateString() ===
                  new Date(
                    new Date()!.setDate(new Date()!.getDate() + 1)
                  ).toDateString() && 'bg-green-700 hover:bg-green-600'
              }`}
              onClick={() => {
                setSelectedDate(() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 1);
                  return date;
                });
              }}>
              Tomorrow
            </button>
          </div>
        </div>

        <DatePickerModal
          open={dateModalOpen}
          setOpen={setDateModalOpen}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className='w-full flex justify-center page-anim'>
        <div className='flex justify-between w-[900px]'>
          {/* Daily Task Section */}
          <DashboardSection
            title='Daily Tasks'
            createButtonText='Create a new daily task'
            createButtonLink={`/create/?type=${TaskType.EVERYDAY}`}
            taskType={TaskType.EVERYDAY}
          />
          {/* Today Section */}
          <DashboardSection
            title="Today's Tasks"
            createButtonText='Create a new task for Today'
            createButtonLink={`/create/?type=${TaskType.TODAY}`}
            taskType={TaskType.TODAY}
          />
        </div>
      </div>
    </Layout>
  );
}

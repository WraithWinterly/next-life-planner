import { useState, useId } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Layout from '@components/layout';

import TaskCard from '@components/dashboard/taskCard';

import { signIn, useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui-common/loadingSpinner';
import { Task, TaskType } from '@prisma/client';
import { useUserContext } from '../userContext/userContext';
import Modal from '../components/ui-common/modal';

export default function Dashboard() {
  const [animator] = useAutoAnimate<HTMLDivElement>();

  const [loading, setLoading] = useState(true);

  const id = useId();

  const router = useRouter();

  const ctx = useUserContext();

  const session = useSession();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [currentDeleteTask, setCurrentDeleteTask] = useState<Task | null>(null);

  const handleDeletePressed = () => {
    if (currentDeleteTask != null) {
      setDeleteModalOpen(true);
    }
  }

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
            !ctx.tasks ? 'items-center' : 'items-left'
          } gap-3`}
          ref={animator}>
          {!ctx.tasks && <LoadingSpinner />}
          {!!ctx.tasks &&
            ctx.tasks.map(
              (task, i) =>
                task.taskType === taskType && (
                  <TaskCard
                    task={task}
                    handleDeletePressed={ handleDeletePressed }
                    setCurrentDeleteTask={setCurrentDeleteTask}
                    key={`${id}-${i}`}
                  />
                )
            )}
          {!!ctx.tasks && ctx.tasks.length == 0 && !loading && (
            <p>There are no tasks for every day.</p>
          )}
        </div>
      </div>
    );
  };

  if (!ctx.signedIn && session.status != 'loading') {
    return (
      <Layout>
        <h1>You must be signed in to access this page.</h1>
        <div className='w-full flex justify-center'>
          <button
            className='btn btn-lg'
            onClick={() => {
              setLoading(true);
              signIn();
            }}>
            Sign In Now
          </button>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
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
      <h1 className='text-center'>Dashboard</h1>
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

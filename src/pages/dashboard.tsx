import { useEffect, useState, useId } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Layout from '@components/layout';
import { getTasks } from '@utils/apiInterface';

import TaskCard from '@components/dashboard/taskCard';

import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import { PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui-common/loadingSpinner';
import { Task, TaskType } from '@prisma/client';

export default function Dashboard() {
  const [animator] = useAutoAnimate<HTMLDivElement>();
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[] | null>(null);

  const id = useId();

  const fetchData = async () => {
    try {
      const tasks = await getTasks();
      if (tasks == null) {
        throw new Error('No tasks found');
      }
      // tasks.sort((a, b) => {
      //   return a.createdAt > b.createdAt ? -1 : 1;
      // });
      setTasks(tasks);
    } catch (e) {
      console.error(e);
      setTasks(null);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!!session.data) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!session.data) return;
    setLoading(true);
    fetchData();
  }, [session.data]);

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
            loading ? 'items-center' : 'items-strerch'
          } gap-3`}
          ref={animator}>
          {(loading || !tasks) && <LoadingSpinner />}
          {tasks &&
            tasks.map(
              (task, i) =>
                task.taskType === taskType && (
                  <TaskCard task={task} key={`${id}-${i}`} />
                )
            )}
          {!!tasks && tasks.length == 0 && !loading && (
            <p>There are no tasks for every day.</p>
          )}
        </div>
      </div>
    );
  };

  if (!session.data && session.status != 'loading') {
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
      <h1 className='text-center'>Dashboard</h1>
      <div className='w-full flex justify-center page-anim'>
        <div className='flex justify-between w-[900px]'>
          {/* Daily Task Section */}
          <DashboardSection
            title='Daily Tasks'
            createButtonText='Create a new daily task'
            createButtonLink='/create/?type=everyday'
            taskType={TaskType.EVERYDAY}
          />
          {/* Today Section */}
          <DashboardSection
            title="Today's Tasks"
            createButtonText='Create a new task for Today'
            createButtonLink='/create/?type=today'
            taskType={TaskType.TODAY}
          />
        </div>
      </div>
    </Layout>
  );
}

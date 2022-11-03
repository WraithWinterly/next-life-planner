import { useEffect, useState, useId } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Layout from '@components/layout';
import { getDayTasks, getEveryDayTasks } from '@/src/utils/apiHandler';
import { DayTask, EverydayTask } from '@prisma/client';
import TaskCard from '@/src/components/dashboard/taskCard';

import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import { PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/ui-common/loadingSpinner';

export default function Dashboard() {
  const [animator] = useAutoAnimate<HTMLDivElement>();
  const session = useSession();
  const [loading, setLoading] = useState(true);

  const [everydayTasks, setEverydayTasks] = useState<EverydayTask[] | null>(
    null
  );
  const [dayTasks, setDayTasks] = useState<DayTask[] | null>(null);

  const id = useId();

  const fetchData = async () => {
    try {
      const everydayTasks = await getEveryDayTasks();
      everydayTasks.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
      setEverydayTasks(everydayTasks);
    } catch (e) {
      console.error(e);
      setEverydayTasks(null);
      setLoading(false);
    }
    try {
      const dayTasks = await getDayTasks();
      dayTasks.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
      setDayTasks(dayTasks);
    } catch (e) {
      console.error(e);
      setDayTasks(null);
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!session.data) return;
    setLoading(true);
    fetchData();
  }, [session.data]);

  const DashboardSection = ({
    title,
    createButtonText,
    createButtonLink,
    content,
  }: {
    title: string;
    createButtonText: string;
    createButtonLink: string;
    content: JSX.Element;
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
          {content}
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
            createButtonLink='/create/everyday'
            content={
              <>
                {(loading || !everydayTasks) && <LoadingSpinner />}
                {everydayTasks &&
                  everydayTasks.map((task, i) => (
                    <TaskCard
                      task={task}
                      key={`${id}-${i}`}
                      taskType='everydayTask'
                    />
                  ))}
                {!!everydayTasks && everydayTasks.length == 0 && !loading && (
                  <p>There are no tasks for every day.</p>
                )}
              </>
            }></DashboardSection>
          {/* Today Section */}
          <DashboardSection
            title="Today's Tasks"
            createButtonText='Create a new task for today'
            createButtonLink='/create/day'
            content={
              <>
                {(loading || !dayTasks) && <LoadingSpinner />}
                {dayTasks &&
                  dayTasks.map((task, i) => (
                    <TaskCard
                      task={task}
                      key={`${id}-${i}`}
                      taskType='dayTask'
                    />
                  ))}
                {!!dayTasks && dayTasks.length == 0 && !loading && (
                  <p>🎉 There are no tasks for today.</p>
                )}
              </>
            }></DashboardSection>
        </div>
      </div>
    </Layout>
  );
}

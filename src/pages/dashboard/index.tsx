import { useEffect, useState, useId } from 'react';

import Layout from '@components/layout';
import { getEveryDayTasks } from '@/src/utils/apiHandler';
import { EverydayTask } from '@prisma/client';
import TaskCard from '@/src/pages/dashboard/taskCard';
import ModalCreateEverydayTask from './modalCreateEverydayTask';
import { signIn, useSession } from 'next-auth/react';
import LoadingScreen from '@/src/components/ui-common/loadingScreen';

export default function Dashboard() {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [everydayTasks, setEverydayTasks] = useState<EverydayTask[] | null>(
    null
  );

  const id = useId();

  const fetchData = async () => {
    const tasks = await getEveryDayTasks();
    tasks.sort((a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1;
    });
    setEverydayTasks(tasks);
    setLoading(false);
  };

  useEffect(() => {
    if (!session.data) return;
    setLoading(true);
    fetchData();
  }, [session.data]);

  const handleTaskAdded = async () => {
    setLoading(true);
    fetchData();
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

        {loading && <LoadingScreen text={'Loading'} />}
      </Layout>
    );
  }
  return (
    <Layout>
      {loading && <LoadingScreen text={'Loading'} />}
      <ModalCreateEverydayTask
        open={open}
        setOpen={setOpen}
        handleTaskAdded={handleTaskAdded}
      />
      <h1 className='text-center'>Dashboard</h1>
      <div className='w-full flex justify-center'>
        <div className='flex justify-between w-[900px]'>
          {/* Daily Task Section */}
          <div className='flex flex-col items-stretch w-[400px]'>
            <h2>Daily Tasks</h2>
            <div className='p-6 from-slate-800 to-slate-900 bg-gradient-to-br rounded-lg flex flex-col gap-3'>
              <button className='btn h-12' onClick={() => setOpen(true)}>
                <p>Create a new daily task!</p>
              </button>
              {everydayTasks?.map((task, i) => (
                <TaskCard task={task} key={`${id}-${i}`} />
              ))}
            </div>
          </div>
          {/* Today Section */}
          <div>
            <h2>Today Only</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}

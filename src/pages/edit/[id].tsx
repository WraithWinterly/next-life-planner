import LoadingScreen from '@components/ui-common/loadingScreen';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@components/taskAction';
import { useState } from 'react';
import Layout from '@components/layout';
import { Task } from '@prisma/client';
import { useUserContext } from '@/src/userContext/userContext';

function Edit() {
  const router = useRouter();
  const { id } = router.query;
  const ctx = useUserContext();
  const [taskData, setTaskData] = useState<Task>();

  const fetchData = async (id: string) => {
    const data = await ctx.api.getTaskById(id);
    setTaskData(data);
  };

  useEffect(() => {
    if (!id) return;
    try {
      fetchData(id as string);
    } catch (error) {
      console.log(error);
      router.push('/');
    }
  }, [id]);

  return (
    <Layout>
      {!!taskData ? (
        <TaskAction action='edit' editTaskData={taskData}></TaskAction>
      ) : (
        <LoadingScreen text='Loading Task' />
      )}
    </Layout>
  );
}

export default Edit;

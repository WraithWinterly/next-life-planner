import LoadingScreen from '@/src/components/ui-common/loadingScreen';
import { getDayTaskById } from '@/src/utils/apiHandler';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@/src/components/taskAction';
import { DayTask } from '@prisma/client';
import { useState } from 'react';
import Layout from '@/src/components/layout';

function Edit() {
  const router = useRouter();
  const { id } = router.query;

  const [taskData, setTaskData] = useState<DayTask>();

  const fetchData = async (id: string) => {
    const data = await getDayTaskById(id);
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
        <TaskAction
          type={'day'}
          action='edit'
          editTaskData={taskData}></TaskAction>
      ) : (
        <LoadingScreen text='Loading Task' />
      )}
    </Layout>
  );
}

export default Edit;

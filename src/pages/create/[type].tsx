import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@/src/components/taskAction';
import Layout from '@/src/components/layout';

function Create() {
  const router = useRouter();
  const { type: routerType } = router.query;

  useEffect(() => {
    if (!routerType) return;
    if (!(routerType == 'everyday' || routerType == 'day')) {
      router.push('/create/day');
    }
  }, [routerType]);

  const type = routerType as 'everyday' | 'day';

  return (
    <Layout>
      <TaskAction type={type} action='create'></TaskAction>
    </Layout>
  );
}

export default Create;

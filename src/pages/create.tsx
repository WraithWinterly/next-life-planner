import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@components/taskAction';
import Layout from '@components/layout';
import { TaskType } from '@prisma/client';

function Create() {
  const router = useRouter();
  let { selectType } = router.query;

  const type = selectType as TaskType;
  useEffect(() => {
    if (!selectType) return;
    if (!(typeof selectType in TaskType)) {
      selectType = TaskType.TODAY;
    }
  }, []);

  return (
    <Layout>
      <TaskAction selectType={type} action='create'></TaskAction>
    </Layout>
  );
}

export default Create;

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@components/taskAction';
import Layout from '@components/layout';
import { TaskType } from '@prisma/client';

function Create() {
  return (
    <Layout title='Create Task'>
      <TaskAction action='create' />
    </Layout>
  );
}

export default Create;

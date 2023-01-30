import TaskAction from '@components/taskAction';
import Layout from '@components/layout';

function Create() {
  return (
    <Layout title='Create Task'>
      <TaskAction action='create' />
    </Layout>
  );
}

export default Create;

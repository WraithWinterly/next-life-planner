import CreateDailyTask from '@/src/components/dashboard/createDailyTask';
import Layout from '@components/layout';

export default function ClientPage() {
  return (
    <Layout>
      <h1 className='text-center'>Dashboard</h1>
      <div className='flex w-full justify-between px-12'>
        <div>
          <h2>Daily Tasks</h2>
          <CreateDailyTask />
        </div>
        <div>
          <h2>Today Only</h2>
        </div>
      </div>
    </Layout>
  );
}

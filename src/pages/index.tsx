import Layout from '../components/layout';

export default function IndexPage() {
  return (
    <Layout title='Home'>
      <div className='flex flex-col items-center justify-center'>
        <h1>Welcome to Daily Planner</h1>
        <h2>
          <i>This app is in preview and may not be feature complete.</i>
        </h2>
        <h2>Not a Todo-list. Much, much more.</h2>
      </div>
    </Layout>
  );
}

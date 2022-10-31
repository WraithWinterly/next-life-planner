import LoadingScreen from '@/src/components/ui-common/loadingScreen';
import { postEverydayTask, postDayTask } from '@/src/utils/apiHandler';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import TaskAction from '@/src/components/taskAction';

function Edit() {
  const router = useRouter();
  const { type: routerType } = router.query;

  useEffect(() => {
    if (!routerType) return;
    if (!(routerType == 'everyday' || routerType == 'day')) {
      router.push('/edit/day');
    }
  }, [routerType]);

  const type = routerType as 'everyday' | 'day';

  return <TaskAction type={type} action='edit'></TaskAction>;
}

export default Edit;

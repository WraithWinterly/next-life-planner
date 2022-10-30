import LoadingScreen from '@/src/components/ui-common/loadingScreen';
import { postEverydayTasks } from '@/src/utils/apiHandler';
import { Dialog, Transition } from '@headlessui/react';
import { EverydayTask } from '@prisma/client';
import { useEffect } from 'react';
import { Fragment, useState } from 'react';

interface MCETProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTaskAdded: () => void;
}

function ModalCreateEverydayTask({
  open,
  setOpen,
  handleTaskAdded,
}: MCETProps) {
  const [createdData, setCreatedData] = useState<EverydayTask>({
    name: '',
    description: '',
  } as EverydayTask);

  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState(false);

  function closeModal() {
    setSubmitError(false);
    setOpen(false);
  }

  useEffect(() => {
    console.log(createdData);
  }, [createdData]);

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      const data = await postEverydayTasks([createdData]);
      setCreatedData(data);
      handleTaskAdded();
      setLoading(false);
      setCreatedData({
        name: '',
        description: '',
      } as EverydayTask);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setCreatedData({
        name: '',
        description: '',
      } as EverydayTask);
    }
  };

  return (
    <>
      {loading && <LoadingScreen text='Adding new task' />}
      <Transition appear show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-50' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl to-gray-800 from-gray-900 bg-gradient-to-tr pt-6 pb-2 px-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-xl font-medium leading-6 text-gray-300'>
                    Create a new daily task
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-200'>
                      This task will show up every day. You will set a goal to
                      do this every day.
                    </p>
                  </div>

                  <div className='my-4 flex flex-col gap-3'>
                    <div>
                      <label htmlFor='taskName' className='input-label'>
                        Task Name
                        {submitError && (
                          <p className=' text-red-600'>
                            *This field is required.
                          </p>
                        )}
                      </label>

                      <input
                        className='input-field'
                        id='taskName'
                        autoComplete='off'
                        onChange={(e) => {
                          setCreatedData(
                            (data) =>
                              ({
                                ...data,
                                name: e.target.value.trim(),
                              } as EverydayTask)
                          );
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor='taskDescription' className='input-label'>
                        Task Description
                      </label>
                      <input
                        className='input-field'
                        id='taskDescription'
                        autoComplete='off'
                        onChange={(e) => {
                          setCreatedData(
                            (data) =>
                              ({
                                ...data,
                                description: e.target.value.trim(),
                              } as EverydayTask)
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className='mt-4 flex gap-3'>
                    <button
                      type='button'
                      className='btn mx-0'
                      onClick={async () => {
                        setSubmitError(false);
                        if (
                          createdData?.name == '' ||
                          createdData?.name == null
                        ) {
                          setSubmitError(true);
                          return;
                        }
                        closeModal();
                        handleCreateTask();
                      }}>
                      Create
                    </button>
                    <button
                      type='button'
                      className='btn mx-0'
                      onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ModalCreateEverydayTask;

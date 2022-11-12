import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { TaskType } from '@prisma/client';

interface ListBoxProps {
  label: string;
  selections: Array<string>;
  defaultValueIndex: number;
  handleSelection: (value: string) => void;
}

export default function ListBox({
  label,
  selections,
  defaultValueIndex,
  handleSelection,
}: ListBoxProps) {
  const [selected, setSelected] = useState<string>('No Default Value Selected');

  useEffect(() => {
    handleSelection(selected);
  }, [selected]);

  useEffect(() => {
    setSelected(selections[defaultValueIndex]);
    handleSelection(selections[defaultValueIndex]);
  }, []);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <label className='input-label text-left mb-0'>{label}</label>
      <div className='relative'>
        <Listbox.Button className='input-field text-left flex'>
          <span className='block truncate'>{selected}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <ChevronUpDownIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <Listbox.Options className='absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-indigo-500 bg-opacity-30 backdrop-blur-lg text-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {selections.map((selection, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 transition-colors ${
                    active ? 'bg-indigo-700 text-white' : 'text-white'
                  }`
                }
                value={selection}>
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}>
                      {selection}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-white'>
                        <CheckIcon className='h-5 w-5' aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

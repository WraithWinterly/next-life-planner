import { Dispatch, SetStateAction } from 'react';
import { DayPicker } from 'react-day-picker';
import Modal from './modal';

import style from './datePickerModal.module.css';

interface DatePickerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}

const DatePickerModal = ({
  open,
  setOpen,
  selectedDate,
  setSelectedDate,
}: DatePickerProps) => {
  return (
    <Modal open={open} setOpen={setOpen} title='Select Date'>
      <div className='flex justify-center w-full'>
        <div className='bg-slate-800 bg-opacity-50 m-2 rounded-md h-[345px]'>
          <DayPicker
            mode='single'
            modifiersClassNames={{
              selected: style.selected,
              today: style.today,
            }}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(false);
            }}
          />
        </div>
      </div>
      <button className='btn' onClick={() => setOpen(false)}>
        Cancel
      </button>
    </Modal>
  );
};

export default DatePickerModal;

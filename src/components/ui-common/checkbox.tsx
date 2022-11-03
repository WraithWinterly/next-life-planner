interface CheckboxProps {
  label: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox = ({ label, value, onChange }: CheckboxProps) => {
  return (
    <label className='flex gap-2 text-xl items-center'>
      <input
        className='w-6 h-6 mt-1 text-indigo-600 bg-indigo-300 rounded-lg border-indigo-300 focus:ring-blue-500 transition duration-500 ease-in-out'
        type='checkbox'
        checked={value}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default Checkbox;

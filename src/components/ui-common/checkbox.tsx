interface CheckboxProps {
  label: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canChange?: boolean;
  reason?: string;
}
const Checkbox = ({
  label,
  value,
  onChange,
  canChange,
  reason,
}: CheckboxProps) => {
  return (
    <label className='relative flex gap-2 text-xl items-center w-full group'>
      <input
        className={`w-6 h-6 mt-1 text-indigo-600 bg-indigo-300 rounded-lg border-indigo-300 focus:ring-blue-500 transition duration-500 ease-in-out ${
          !canChange && 'cursor-not-allowed'
        }`}
        disabled={!canChange}
        type='checkbox'
        checked={value}
        onChange={onChange}
      />
      {label}
      <div
        className={`absolute max-w-fit opacity-0 bg-slate-800 translate-x-10 -translate-y-10 px-2 py-1 bg-opacity-30 backdrop-blur-md border-solid border border-slate-900 transition-opacity ${
          !canChange && 'group-hover:opacity-100'
        }`}>
        <i>{reason}</i>
      </div>
    </label>
  );
};

export default Checkbox;

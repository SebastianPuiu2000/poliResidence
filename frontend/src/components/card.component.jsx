export default function Card({ label, value }) {
  return (
    <div className="flex flex-col p-4 rounded-2xl bg-white shadow-2xl shadow-gray-200 min-w-[320px] max-w-[320px] h-[100px] items-center justify-evenly font-logo">
      <span
        className="font-bold text-gray-900 text-lg text-center"
        title={label}
      >
        {label}
      </span>

      <span className="text-base font-medium text-gray-700 text-center">
        {value} lei
      </span>
    </div>
  );
}

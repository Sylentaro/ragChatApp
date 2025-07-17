export default function ChatEmpty() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-gray-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-20 w-20 text-gray-300 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 8h10M7 12h4m-7 8h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <div className="text-2xl font-semibold text-gray-500 mb-2">
        Nie wybrano rozmowy
      </div>
      <div className="text-gray-400">
        Wybierz rozmowę z listy lub rozpocznij nową, aby zacząć czatować.
      </div>
    </div>
  );
}

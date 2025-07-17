// src/app/conversation/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-500 mb-4"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
          />
        </svg>
        <span className="text-lg text-gray-500">Pobieranie wiadomości...</span>
      </div>
    </div>
  );
}

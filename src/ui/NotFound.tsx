import { useNavigate } from "react-router-dom";

export default function NotFound({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <div className={`p-4 flex items-center justify-center ${className}`}>
      <div className="max-w-xs p-4">
        <div className="">
          <img
            className="w-full object-contain"
            src="/assets/undraw_not_found.svg"
            alt="Page not found"
          />
        </div>
        <div className="px-4 flex flex-col gap-2">
          <h3>Sorry! The page you requested for was not found.</h3>
          <button
            onClick={() => navigate(-1)}
            className="text-sm self-end px-4 py-1 bg-teal-800 text-white rounded shadow hover:bg-teal-700 duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

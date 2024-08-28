import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="max-w-xs p-4">
        <div className="">
          <img
            className="w-full object-contain"
            src="assets/undraw_not_found.svg"
            alt="Page not found"
          />
        </div>
        <div className="px-4 flex flex-col gap-2">
          <h3>Sorry! The page you requested for was not found.</h3>
          <NavLink
            className="text-sm self-end px-4 py-1 bg-teal-800 text-white rounded shadow hover:bg-teal-700 duration-300"
            to="/"
          >
            Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}

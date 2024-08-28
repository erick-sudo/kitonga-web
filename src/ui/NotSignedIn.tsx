import { NavLink } from "react-router-dom";

export default function NotSignedIn() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xs flex flex-col gap-4 mx-auto">
        <div className="">
          <img className="w-full" src="/assets/undraw_fingerprint_login.svg" />
        </div>

        <div className="px-4">
          You are seeing this page because you are not signed in!
        </div>

        <NavLink className=" bg-teal-800 text-center px-4 mx-4 text-white rounded text-sm py-1 hover:bg-teal-700 duration-300" to="/sign-in">Sign In</NavLink>
      </div>
    </div>
  );
}

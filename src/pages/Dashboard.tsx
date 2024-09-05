import { Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";
import { useSpring, animated } from "@react-spring/web";
import { Analytics } from "./Analytics";
import {
  Bars4Icon,
  ChartPieIcon,
  ChevronLeftIcon,
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { capitalize } from "../lib/utils";
import { ReactStateSetter } from "../ui/definitions";
import { KitongaColorScheme } from "../lib/MUI_STYLES";
import { Cases } from "./cases/Cases";
import { Folder, Logout } from "@mui/icons-material";
import NotFound from "../ui/NotFound";
import { Clients } from "./clients/Clients";
import { DeepSearchModal } from "./DeepSearchModal";
import { Settings } from "./settings/Settings";

const navLinks = [
  {
    name: "Analytics",
    path: "/dashboard",
    icon: <ChartPieIcon height={20} />,
    activePattern: /^\/dashboard[\/]*$/,
  },
  {
    name: "Cases",
    path: "/dashboard/cases",
    icon: <Folder fontSize="small" />,
    activePattern: /^\/dashboard\/cases[\/]*/,
  },
  {
    name: "Clients",
    path: "/dashboard/clients",
    icon: <UsersIcon height={20} />,
    activePattern: /^\/dashboard\/clients[\/]*$/,
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: <UserPlusIcon height={20} />,
    activePattern: /^\/dashboard\/users[\/]*$/,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Cog8ToothIcon height={20} />,
    activePattern: /^\/dashboard\/settings[\/]*$/,
  },
];

function NavigationLinks({
  className,
  activeClassName,
}: {
  className?: string;
  activeClassName?: string;
}) {
  const { pathname } = useLocation();
  return (
    <>
      {navLinks.map((link, index) => (
        <NavLink
          key={`${index}#${link.name}}`}
          className={`flex items-center gap-2 hover:bg-teal-800 hover:ring-1 hover:ring-teal-900 hover:text-white duration-300 px-2 py-1 ${className} ${
            link.activePattern.test(pathname) && activeClassName
          }`}
          to={link.path}
        >
          {link.icon}
          <span>{link.name}</span>
        </NavLink>
      ))}
    </>
  );
}

const specialNavigationSegments: string[] = ["details"];

export function Dashboard() {
  const { logout } = React.useContext(DashboardContext);
  const [hide, setHide] = React.useState(true);
  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  const sideNavSprings = useSpring({
    width: isMdOrLarger && !hide ? 150 : 0,
    opacity: isMdOrLarger && !hide ? 1 : 0,
    display: isMdOrLarger && !hide ? "flex" : "none",
    config: { tension: 250, friction: 30 },
  });

  return (
    <div>
      <div className="fixed inset-0 flex flex-col">
        {/* ============ Top App Bar ============= */}
        <TopAppBar toggleDrawer={setHide} expandSideNav={hide} />

        <div className="flex flex-grow">
          {/* ============ Large Screen ============ */}
          <animated.div
            style={sideNavSprings}
            className={`flex flex-col border-r border-[rgb(229, 231, 235)]`}
          >
            {/* Nav Items */}
            <div className="border rounded bg-white shadow m-2 overflow-hidden">
              <NavigationLinks
                activeClassName="border-l-4 border-l-teal-800"
                className="border-b hover:border-b-teal-800 last:border-b-0 py-3"
              />
            </div>
            <div className="flex-grow p-2 flex flex-col justify-end">
              <button
                onClick={() => logout()}
                className="flex gap-2 py-3 px-3 duration-300 hover:bg-red-100 hover:text-red-800 rounded bg-white shadow"
              >
                <Logout fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </animated.div>

          {/* ============ Small Screen ============ */}
          <Drawer
            sx={{
              position: "relative",
              display: isMdOrLarger ? "none" : "block",
            }}
            onClose={() => setHide(true)}
            open={!hide}
          >
            <div className="flex justify-between items-center p-2">
              <h3 className="px-2 font-semibold">Kitonga</h3>
              <IconButton onClick={() => setHide(true)}>
                <XMarkIcon className="text-teal-600" height={20} />
              </IconButton>
            </div>

            <div
              onClick={() => setHide(true)}
              className="flex flex-col min-w-48"
            >
              {/* Nav Items */}
              <NavigationLinks
                activeClassName="border-l-4 border-l-teal-800"
                className="border-b hover:border-b-teal-800 last:border-b-0 py-3"
              />
            </div>
            <div className="flex-grow flex flex-col justify-end">
              <button
                onClick={() => logout()}
                className="flex gap-2 py-3 px-3 duration-300 hover:bg-red-100 hover:text-red-800 rounded bg-white shadow"
              >
                <Logout fontSize="small" />
                <span>Logout</span>
              </button>
            </div>
          </Drawer>
          <div className="flex-grow relative bg-gray-100">
            <div className="zero-size-vertical-scrollbar absolute inset-y-0 left-0 right-0 flex flex-col">
              <Routes>
                <Route path="" element={<Analytics />} />
                <Route path="cases/*" element={<Cases />} />
                <Route path="clients/*" element={<Clients />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TopAppBar: React.FC<{
  toggleDrawer: ReactStateSetter<boolean>;
  expandSideNav: boolean;
}> = ({ toggleDrawer, expandSideNav }) => {
  const { user } = React.useContext(DashboardContext);
  const { pathname } = useLocation();
  const segments = pathname.split("/").slice(1);

  const breadcrumbs = segments.map((segment, idx) =>
    idx === segments.length - 1 ||
    specialNavigationSegments.includes(segment) ? (
      <div className="text-teal-700 text-sm whitespace-nowrap" key={idx}>
        {capitalize(segment)}
      </div>
    ) : (
      <NavLink
        className="hover:underline text-sm whitespace-nowrap"
        color="inherit"
        to={`/${segments.slice(0, idx + 1).join("/")}`}
        key={idx}
      >
        {capitalize(segment)}
      </NavLink>
    )
  );
  return (
    <div className="border-b py-1">
      <div className="flex items-center px-2 gap-4">
        <div className="flex items-center border px-2 gap-2 py-1 rounded shadow bg-white">
          <IconButton
            size="small"
            aria-label="open drawer"
            onClick={() => toggleDrawer(!expandSideNav)}
            edge="start"
            sx={{
              color: KitongaColorScheme.teal800,
            }}
          >
            {expandSideNav ? (
              <Bars4Icon height={20} />
            ) : (
              <ChevronLeftIcon height={20} />
            )}
          </IconButton>
          <div className="flex">
            <div className="border-l flex items-center hover:text-teal-700 duration-300 cursor-pointer">
              <DeepSearchModal
                anchorClassName="px-2"
                anchorContent={<MagnifyingGlassIcon height={16} />}
              />
            </div>
            <div className="px-4 border-l font-semibold">Kitonga</div>
          </div>
        </div>
        <div className="px-4 py-1 bg-gray-100 zero-size-horizontal-scrollbar flex items-center gap-1">
          {/* <Breadcrumbs
            separator={
              <span className="h-1 w-1 bg-teal-800 rounded-full"></span>
            }
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs> */}
          {breadcrumbs.map((c, index) => (
            <div key={index} className="flex items-center gap-1">
              {index > 0 && (
                <div className="h-1 w-1 bg-teal-800 rounded-full"></div>
              )}
              {c}
            </div>
          ))}
        </div>
        <div className="flex flex-grow justify-end items-center gap-3">
          <span className="text-teal-700 hidden sm:block text-xs font-bold">
            {user?.principal.email}
          </span>
          <span className="bg-white shadow border text-teal-800 h-8 w-8 font-bold rounded-full text-sm flex items-center justify-center">
            {user?.principal?.username?.toUpperCase().slice(0, 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

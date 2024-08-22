import { Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";
import { useSpring, animated } from "@react-spring/web";
import { Analytics } from "./Analytics";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  Bars4Icon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { capitalize } from "../lib/utils";
import { ReactStateSetter } from "../ui/definitions";
import { KitongaColorScheme } from "../lib/MUI_STYLES";
import { Cases } from "./cases/Cases";

function NavigationLinks() {
  return <div></div>;
}

const specialNavigationSegments: string[] = [];

export function Dashboard() {
  const { user } = React.useContext(DashboardContext);
  const [hide, setHide] = React.useState(true);
  const theme = useTheme();
  const isMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));

  const { pathname } = useLocation();

  const sideNavSprings = useSpring({
    width: isMdOrLarger && !hide ? 260 : 0,
    opacity: isMdOrLarger && !hide ? 1 : 0,
    display: isMdOrLarger && !hide ? "flex" : "none",
    config: { tension: 250, friction: 30 },
  });

  const segments = pathname.split("/").slice(1);

  const breadcrumbs = segments.map((segment, idx) =>
    idx === segments.length - 1 ||
    specialNavigationSegments.includes(segment) ? (
      <div className="text-teal-700 text-sm" key={idx}>
        {capitalize(segment)}
      </div>
    ) : (
      <NavLink
        className="hover:underline text-sm"
        color="inherit"
        to={`/${segments.slice(0, idx + 1).join("/")}`}
        key={idx}
      >
        {capitalize(segment)}
      </NavLink>
    )
  );
  return (
    <div>
      <div className="fixed inset-0 flex flex-col">
        {/* ============ Top App Bar ============= */}
        <TopAppBar toggleDrawer={setHide} expandSideNav={hide} />

        <div className="flex flex-grow">
          {/* ============ Large Screen ============ */}
          <animated.div
            style={sideNavSprings}
            className={`flex flex-col p-2 border-r border-[rgb(229, 231, 235)]`}
          >
            {/* Nav Items */}
            <NavigationLinks />
            {/* <div className="flex-grow flex flex-col justify-end">
            <button
              onClick={() => logout()}
              className="flex gap-2 py-2 px-3 duration-300 hover:bg-teal-700/10 hover:text-teal-800 rounded"
            >
              <Logout />
              Logout
            </button>
          </div> */}
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
            <div className="flex justify-betweeen items-center gap-4 p-4">
              <IconButton onClick={() => setHide(true)}>
                <XMarkIcon className="text-teal-600" height={20} />
              </IconButton>
            </div>

            <div className="flex-grow flex flex-col p-2 dash-vertical-scrollbar">
              {/* Nav Items */}
              <NavigationLinks />
            </div>
          </Drawer>
          <div className="flex-grow relative bg-gray-100">
            <div className="zero-size-vertical-scrollbar absolute inset-y-0 left-0 right-0 flex flex-col">
              <div className="px-4 py-1 sticky top-0 z-50 bg-gray-100">
                <Breadcrumbs
                  separator={<span className="h-1 w-1 bg-teal-800 rounded-full"></span>}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </div>
              <Routes>
                <Route path="" element={<Analytics />} />
                <Route path="cases/*" element={<Cases />} />
                <Route path="clients/*" element={<div>Clients</div>} />
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
  return (
    <div className="border-b py-1">
      <div className="flex  items-center px-4 gap-4">
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
            <ChevronLeftIcon height={24} />
          )}
        </IconButton>
        <div>Kitonga</div>
        <div className="flex flex-grow justify-end">
          <span className="">{user?.principal.username}</span>
        </div>
      </div>
    </div>
  );
};

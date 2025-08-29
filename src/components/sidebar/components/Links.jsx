/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      const isActive = activeRoute(route.path);

      // 🔽 Dropdown menu (collapse)
      if (route.collapse && route.items) {
        const isOpen = openDropdown === index;

        return (
          <div key={index} className="mb-2">
            <div
              onClick={() => toggleDropdown(index)}
              className="flex cursor-pointer items-center px-8 py-2 hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              <span className="text-gray-600 dark:text-white">
                {route.icon || <DashIcon />}
              </span>
              <p className="ml-4 text-sm font-medium text-gray-700 dark:text-white">
                {route.name}
              </p>
            </div>

            {isOpen && (
              <ul className="ml-10 mt-1">
                {route.items.map((sub, subIndex) => (
                  <li key={subIndex} className="my-1">
                    <Link to={sub.layout + "/" + sub.path}>
                      <p
                        className={`rounded-md px-4 py-2 text-sm ${
                          activeRoute(sub.path)
                            ? "bg-brand-100 font-semibold text-brand-600 dark:text-white"
                            : "text-gray-500 hover:text-brand-600 dark:text-gray-300"
                        }`}
                      >
                        {sub.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      // 🟩 Simple route
      return (
        <Link key={index} to={route.layout + "/" + route.path}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  isActive
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.icon ? route.icon : <DashIcon />}{" "}
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  isActive
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.name}
              </p>
            </li>
            {isActive ? (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            ) : null}
          </div>
        </Link>
      );
    });
  };

  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;

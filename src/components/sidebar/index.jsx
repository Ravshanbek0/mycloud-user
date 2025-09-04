/* eslint-disable */
import { useState } from "react";
import { HiX, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdAnnouncement, MdAttachMoney, MdBook, MdDescription, MdHelpOutline, MdHome, MdPerson, MdQuestionMark, MdTrolley, MdShoppingCart, MdListAlt } from "react-icons/md";

const Sidebar = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const toggleSupport = () => setIsSupportOpen(!isSupportOpen);

  return (
    <div
      className={`sm:none duration-300 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"
        }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" />
      </span>

      <div className="mx-[56px] mt-[50px] flex items-center">
        <div className="ml-1 mt-1 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img
            src="/MCLogo.svg"
            alt="MyCloud Logo"
            className="w-[150px] h-auto object-contain"
          />
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />

      <ul className="mb-auto pt-1">
        <li className="px-4 py-2">
          <NavLink
            to="/admin/default"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdHome className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("dashboard")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdPerson className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("profile")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/cart"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0">
              <MdShoppingCart className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" />
            </span>
            {t("cart")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/order"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdTrolley className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("order")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/my-orders"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0">
              <MdListAlt className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" />
            </span>
            {t("my_orders")}
          </NavLink>
        </li>


        <li className="px-4 py-2">
          <NavLink
            to="/admin/invoices"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdDescription className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("invoices")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdAttachMoney className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("payments")}
          </NavLink>
        </li>
        <li className="px-4 py-2">
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white cursor-pointer transition-all duration-200"
            onClick={toggleSupport}
          >
            <span className="flex-shrink-0"><MdHelpOutline className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("support")}
            <span className="ml-auto">
              {isSupportOpen ? (
                <HiChevronUp className="h-5 w-5 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" />
              ) : (
                <HiChevronDown className="h-5 w-5 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" />
              )}
            </span>
          </div>
          {isSupportOpen && (
            <ul className="ml-6 mt-2 space-y-1 transition-all duration-300 ease-in-out">
              <li>
                <NavLink
                  to="/admin/support/help"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                      ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
                    }`
                  }
                >
                  <span className="flex-shrink-0"><MdHelpOutline className="h-5 w-5 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
                  {t("support_help")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/announcements"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                      ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
                    }`
                  }
                >
                  <span className="flex-shrink-0"><MdAnnouncement className="h-5 w-5 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
                  {t("announcements")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/knowledge"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                      ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
                    }`
                  }
                >
                  <span className="flex-shrink-0"><MdBook className="h-5 w-5 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
                  {t("knowledge")}
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li className="px-4 py-2">
          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${isActive
                ? "bg-navy-50 text-[#1B254B] dark:bg-navy-700 dark:text-white font-medium"
                : "text-gray-700 dark:text-gray-400 hover:bg-navy-50 dark:hover:bg-navy-700 hover:text-navy-700 dark:hover:text-white"
              }`
            }
          >
            <span className="flex-shrink-0"><MdQuestionMark className="h-6 w-6 text-[#422AFB] dark:text-gray-400 hover:text-[#422AFB] dark:hover:text-white" /></span>
            {t("services")}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
import React from "react";
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Order from "views/admin/order";
import Cart from "views/admin/Cart/index";
import Invoices from "views/admin/Invoices";
import Payments from "views/admin/payments";
import Support from "views/admin/support";
import Announcements from "views/admin/support/pages/announcements/announcements";
import Knowledge from "views/admin/support/pages/knowledge/knowledge";
import Services from "views/admin/services";
import {
  MdHome,
  MdPerson,
  MdTrolley,
  MdDescription,
  MdAttachMoney,
  MdHelpOutline,
  MdLock,
  MdQuestionMark,
  MdShoppingCart,
} from "react-icons/md";
import SignIn from "views/auth/SignIn";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Order",
    layout: "/admin",
    path: "order/:orderId?",
    icon: <MdTrolley className="h-6 w-6" />,
    component: <Order />,
  },
  {
    name: "Cart",
    layout: "/admin",
    path: "cart",
    icon: <MdShoppingCart className="h-6 w-6" />,
    component: <Cart />,
  },
  {
    name: "Invoices",
    layout: "/admin",
    path: "invoices",
    icon: <MdDescription className="h-6 w-6" />,
    component: <Invoices />,
  },
  {
    name: "Payments",
    layout: "/admin",
    path: "payments",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: <Payments />,
  },
  {
    name: "Support",
    layout: "/admin",
    path: "support",
    icon: <MdHelpOutline className="h-6 w-6" />,
    collapse: true,
    items: [
      {
        name: "Qo'llab-quvvatlash",
        layout: "/admin",
        path: "support/help",
        component: <Support />,
      },
      {
        name: "E'lonlar",
        layout: "/admin",
        path: "announcements",
        component: <Announcements />,
      },
      {
        name: "Bilimlar bazasi",
        layout: "/admin",
        path: "knowledge",
        component: <Knowledge />,
      },
    ],
  },
  {
    name: "Services",
    layout: "/admin",
    path: "services",
    icon: <MdQuestionMark className="h-6 w-6" />,
    component: <Services />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];

export default routes;
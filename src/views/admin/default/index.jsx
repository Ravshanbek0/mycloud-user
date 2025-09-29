import { useState } from "react";
import { MdAttachMoney, MdDescription, MdTrolley, MdEmail, MdArrowForward } from "react-icons/md";
import { FiTrendingUp, FiActivity, FiShoppingCart, FiDollarSign, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  
  // Mock data - in a real app this would come from API
  const statsData = {
    orders: { total: 12, active: 8, expiring: 2 },
    invoices: { total: 8, paid: 5, unpaid: 3 },
    tickets: { total: 15, open: 4, pending: 3 }
  };

  const recentOrders = [
    { id: 'ORD-001', product: 'Web Hosting - Business', date: '2023-10-15', status: 'active', amount: 299.99 },
    { id: 'ORD-002', product: 'Domain Registration', date: '2023-10-10', status: 'active', amount: 14.99 },
    { id: 'ORD-003', product: 'SSL Certificate', date: '2023-10-05', status: 'expiring', amount: 69.99 }
  ];

  const recentEmails = [
    {
      name: "[MyCloud] Пожалуйста, подтвердите ваш email",
      path: "/admin/email/EmailConfirmation",
      time: "1 неделя тому назад"
    },
    {
      name: "[MyCloud] Добро пожаловать в нашу платформу",
      path: "/admin/email/EmailDetail",
      time: "2 недели тому назад"
    },
    {
      name: "[MyCloud] Обновление вашего аккаунта",
      path: "/admin/email/EmailConfirmation",
      time: "3 недели тому назад"
    },
    {
      name: "[MyCloud] Уведомление о безопасности",
      path: "/admin/email/EmailConfirmation",
      time: "1 месяц тому назад"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("Панель управления")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("Обзор вашей активности и статистики")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Orders Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("Заказы")}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statsData.orders.total}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <MdTrolley className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{statsData.orders.active} {t("Активный")}</span>
              <span>{statsData.orders.expiring} {t("Истекающий")}</span>
            </div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(statsData.orders.active / statsData.orders.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Invoices Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("Счет-фактуры")}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statsData.invoices.total}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <MdAttachMoney className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{statsData.invoices.paid} {t("Оплачено")}</span>
              <span>{statsData.invoices.unpaid} {t("Неоплачено")}</span>
            </div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${(statsData.invoices.paid / statsData.invoices.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Tickets Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("Тикеты")}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {statsData.tickets.total}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <MdDescription className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{statsData.tickets.open} {t("Открыть")}</span>
              <span>{statsData.tickets.pending} {t("В ожидании")}</span>
            </div>
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${(statsData.tickets.open / statsData.tickets.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t("Недавние заказы")}
              </button>
              <button
                onClick={() => setActiveTab('emails')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'emails'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {t("Последние электронные письма")}
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'orders' ? (
              <div>
                {recentOrders.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{order.product}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.id} • {order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {order.status === 'active' ? t('Активный') : t('Истекающий')}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">${order.amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t("Заказы не найдены")}</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">{t("У вас пока нет активных заказов")}</p>
                  </div>
                )}
                
                <div className="mt-6">
                  <Link
                    to="/admin/orders"
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t("Все заказы")}
                    <MdArrowForward className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentEmails.map((email, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <Link
                          to={email.path}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex-1"
                        >
                          {email.name}
                        </Link>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                          {email.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/admin/emails"
                    className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {t("Все письма")}
                    <MdArrowForward className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/orders"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{t("Заказы")}</span>
          </Link>
          
          <Link
            to="/admin/invoices"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{t("Счета")}</span>
          </Link>
          
          <Link
            to="/admin/tickets"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MdDescription className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{t("Тикеты")}</span>
          </Link>
          
          <Link
            to="/admin/emails"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiMail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{t("Почта")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
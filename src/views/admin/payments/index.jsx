import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { FiDownload, FiFilter, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Payments = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [amount, setAmount] = useState(120000);

  // Sample payment data
  const paymentData = {
    all: [
      {
        id: "PAY-2023-001",
        description: "Domain renewal - example.uz",
        date: "2023-10-15",
        amount: 249000,
        status: "completed",
        type: "outgoing"
      },
      {
        id: "PAY-2023-002",
        description: "Top up balance",
        date: "2023-10-10",
        amount: 500000,
        status: "completed",
        type: "incoming"
      },
      {
        id: "PAY-2023-003",
        description: "Web hosting - Business plan",
        date: "2023-10-05",
        amount: 199000,
        status: "completed",
        type: "outgoing"
      }
    ],
    incoming: [
      {
        id: "PAY-2023-002",
        description: "Top up balance",
        date: "2023-10-10",
        amount: 500000,
        status: "completed",
        type: "incoming"
      }
    ],
    outgoing: [
      {
        id: "PAY-2023-001",
        description: "Domain renewal - example.uz",
        date: "2023-10-15",
        amount: 249000,
        status: "completed",
        type: "outgoing"
      },
      {
        id: "PAY-2023-003",
        description: "Web hosting - Business plan",
        date: "2023-10-05",
        amount: 199000,
        status: "completed",
        type: "outgoing"
      }
    ]
  };

  const currentPayments = paymentData[activeTab];
  const totalAmount = currentPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-12 dark:bg-[#0B1437] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("Payment History")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("Manage your account balance and payment activities")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-medium mb-2">{t("Current Balance")}</h2>
              <p className="text-3xl font-bold mb-6">1,250,000 {t("UZS")}</p>

              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">{t("Total Income")}</span>
                <span className="font-semibold">2,500,000 {t("UZS")}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-100">{t("Total Expenses")}</span>
                <span className="font-semibold">1,250,000 {t("UZS")}</span>
              </div>
            </div>

            {/* Top Up Card */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 dark:bg-[#111C44]">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t("Top up your balance")}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("Amount")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white"
                  />
                  <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">
                    {t("UZS")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[50000, 100000, 200000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={`py-2 text-sm font-medium rounded-lg ${amount === value
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                  >
                    {value.toLocaleString()}
                  </button>
                ))}
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition-colors">
                <IoWalletOutline size={18} />
                {t("Add Funds")}
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden dark:bg-[#111C44]">
              {/* Header with tabs and filters */}
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-0">
                    {t("Payment History")}
                  </h3>

                  <div className="flex space-x-2">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiSearch className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t("Search payments...")}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white"
                      />
                    </div>

                    <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-gray-300 dark:hover:bg-gray-800">
                      <FiFilter className="h-4 w-4 mr-1" />
                      {t("Filter")}
                    </button>

                    <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-gray-300 dark:hover:bg-gray-800">
                      <FiDownload className="h-4 w-4 mr-1" />
                      {t("Export")}
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex space-x-4">
                  {[
                    { id: "all", label: t("All Payments") },
                    { id: "incoming", label: t("Incoming") },
                    { id: "outgoing", label: t("Outgoing") }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment List */}
              <div className="overflow-hidden">
                {currentPayments.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentPayments.map((payment) => (
                      <li key={payment.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#1a2a61] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${payment.type === "incoming"
                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                              }`}>
                              <IoWalletOutline className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {payment.description}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {payment.date} • {payment.id}
                              </p>
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${payment.type === "incoming"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                            }`}>
                            {payment.type === "incoming" ? "+" : "-"} {payment.amount.toLocaleString()} {t("UZS")}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <IoWalletOutline className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                      {t("No payments found")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t("Get started by making your first payment")}
                    </p>
                  </div>
                )}

                {/* Summary */}
                {currentPayments.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#1a2a61]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("Total")}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {totalAmount.toLocaleString()} {t("UZS")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
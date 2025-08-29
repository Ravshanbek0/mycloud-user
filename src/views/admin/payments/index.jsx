import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const Payments = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f7f9fc] pt-12 dark:bg-[#0B1437]">
      <div className="max-w-8xl">
        <h2 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("Payment History")}
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          {t("your account balance")}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="overflow-x-auto rounded-md border bg-white dark:border-blue-800 dark:bg-[#111C44] md:col-span-2">
            <div className="border-b px-6 py-4 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                {t("Payment History")}
              </h3>
            </div>

            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-[#1a2a61] dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3">{t("Description")}</th>
                  <th className="px-6 py-3">{t("Date")}</th>
                  <th className="px-6 py-3">{t("Amount")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-200">
                <tr className="border-t dark:border-gray-700">
                  <td className="px-6 py-4" colSpan="3">
                    {t("No records found")}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50 font-semibold dark:border-gray-700 dark:bg-[#1a2a61]">
                  <td className="px-6 py-3">{t("Total")}</td>
                  <td></td>
                  <td className="text-black px-6 py-3 dark:text-white">
                    0.00 {t("UZS")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-md border bg-white p-6 dark:border-gray-700 dark:bg-[#111C44]">
            <h3 className="mb-4 font-medium text-gray-800 dark:text-white">
              {t("Top up your balance")}
            </h3>
            <input
              type="number"
              placeholder="Enter amount"
              className="mb-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-800 dark:bg-[#1a2a61] dark:text-white dark:placeholder-gray-400"
              value={120}
            />
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 py-2 text-white hover:bg-blue-800">
              <IoWalletOutline size={16} />
              {t("Add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

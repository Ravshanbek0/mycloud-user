import React from "react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-6 dark:bg-[#0B1538]">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("My Products and Services")}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t("detailed information")}
        </p>

        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-[#111C44]">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              {t("My Products and Services")}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 dark:bg-[#1A2A61]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    {t("PRODUCT/SERVICE")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    {t("PRICE")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    {t("ACTIVE UNTIL")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    {t("STATUS")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#111C44]">
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-5 text-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    {t("List is empty")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

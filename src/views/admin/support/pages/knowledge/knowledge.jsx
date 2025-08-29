import React from "react";
import { IoMdSearch } from "react-icons/io";
import { useTranslation } from "react-i18next";

const Knowledge = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#f7f9fc] p-8 dark:bg-[#0B1538]">
      <div className="max-w-5xl">
        <h2 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("Knowledge Base")}
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          {t("contacting support")}
        </p>

        <div className="rounded-md border bg-white dark:border-gray-700 dark:bg-[#111C44]">
          <div className="border-b px-6 py-4 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white">
              {t("Knowledge Base")}
            </h3>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex">
              <input
                type="text"
                placeholder={t("What are you looking for")}
                className="flex-1 rounded-l-md border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white dark:placeholder-gray-400"
              />
              <button className="flex items-center gap-2 rounded-r-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700">
                <IoMdSearch size={16} />
                {t("Search")}
              </button>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                {t("How to do it")}
              </h4>
              <ul className="list-inside list-disc space-y-1 text-blue-700 dark:text-blue-400">
                <li>
                  <a href="#" className="hover:underline">
                    {t("How to contact support service")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    {t("How to place a new order")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Knowledge;

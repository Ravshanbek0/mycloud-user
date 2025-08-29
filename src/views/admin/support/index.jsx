import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="mt-5 p-6 text-gray-800 dark:text-white">
      <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">
        {t("Support Tickets")}
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {t("Need answers")}
      </p>

      <div className="overflow-hidden rounded-md bg-white shadow-md dark:border dark:border-gray-700 dark:bg-[#111C44]">
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">
            {t("Support Tickets")}
          </h3>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
          >
            <span className="text-xl">＋</span>
            <span>{t("New Ticket")}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 dark:bg-[#1a2a61] dark:text-gray-400">
              <tr className="border dark:border-gray-700">
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("ID")}
                </th>
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("Subject")}
                </th>
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("Support Department")}
                </th>
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("Status")}
                </th>
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("Submitted")}
                </th>
                <th className="border px-6 py-3 dark:border-gray-700">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-6 text-left text-gray-800 dark:text-gray-300"
                >
                  {t("No tickets found")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-[#8c92a0] bg-opacity-50 backdrop-blur-[4px] md:inset-0">
          <div className="relative max-h-full w-full max-w-3xl p-4">
            <div className="relative rounded-lg bg-white shadow-sm dark:bg-[#0B1538]">
              <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-600 md:p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("Submit a Support Ticket")}
                </h3>
                <button
                  type="button"
                  className="bg-transparent ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-[#1a2a61] dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">{t("Close modal")}</span>
                </button>
              </div>

              <form className="p-6">
                <label
                  htmlFor="countries"
                  className="text-md mb-2 block font-medium text-gray-900 dark:text-white"
                >
                  {t("Support Department")}
                </label>
                <select
                  id="countries"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option selected>{t("General")}</option>
                  <option value="">
                    {t("Paid Technical Support Services")}
                  </option>
                </select>

                <div>
                  <label
                    htmlFor="first_name"
                    className="text-md mb-2 block font-medium text-gray-900 dark:text-white"
                  >
                    {t("Subject")}
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder={t("Your subject")}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("Message")}
                  </label>
                  <textarea
                    id="message"
                    rows="10"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1a2a61] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  ></textarea>
                </div>
              </form>

              <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <span className="text-xl">＋</span>
                  <span className="text-base">{t("Submit")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;

import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState("paid");

  const renderTableContent = () => {
    return (
      <tr className="bg-gray-100 text-center dark:bg-[#1A2455]">
        <td
          colSpan="4"
          className="px-3 py-4 text-left text-gray-700 dark:text-gray-300"
        >
          The list is empty
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen p-6 dark:bg-[#0B1538]">
      <div className="mx-auto max-w-6xl p-1">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Invoices
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          All of your invoices can be found here. You can choose to see either
          paid or unpaid invoices by clicking corresponding button.
        </p>

        <div className="rounded-lg border border-gray-100  bg-white shadow dark:bg-[#111C44]">
          <h2 className="mb-2 px-4 py-2 text-xl font-normal text-gray-800 dark:text-white">
            Invoices
          </h2>
          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="mb-0 flex space-x-2 px-4 pb-0 pt-4 dark:bg-[#0B1538]">
            <button
              onClick={() => setActiveTab("unpaid")}
              className={`flex items-center rounded px-4 py-2 transition ${
                activeTab === "unpaid"
                  ? "bg-red-100 text-red-600 dark:bg-red-200 dark:text-red-800"
                  : "border bg-white text-gray-700 dark:border-gray-700 dark:bg-[#0B1538] dark:text-gray-300"
              }`}
            >
              <FaRegClock />
              Unpaid
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`flex items-center  rounded px-4 py-2 transition ${
                activeTab === "paid"
                  ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-800"
                  : "border bg-white text-gray-700 dark:border-gray-700 dark:bg-[#0B1538] dark:text-gray-300"
              }`}
            >
              <IoCheckmarkDoneCircleOutline />
              Paid
            </button>
          </div>

          <hr className="mt-4 border-gray-300 dark:border-gray-700" />

          <div className="overflow-x-auto rounded p-4 pt-2">
            <table className="my-3 min-w-full border border-gray-300 text-sm dark:border-gray-700 dark:bg-[#0B1538]">
              <thead className="text-gray-700 dark:text-gray-300">
                <tr className="border-black dark:border-gray-600">
                  <th className="border p-2 text-left dark:border-gray-700">
                    TITLE
                  </th>
                  <th className="border p-2 text-left dark:border-gray-700">
                    INVOICE DATE
                  </th>
                  <th className="border p-2 text-left dark:border-gray-700">
                    {activeTab === "paid" ? "PAID DATE" : "DUE DATE"}
                  </th>
                  <th className="border p-2 text-left dark:border-gray-700">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>{renderTableContent()}</tbody>
            </table>
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />
          <p className="p-4 text-sm text-gray-700 dark:bg-[#0B1538] dark:text-gray-400">
            0 неоплаченных счетов и 0 оплаченных счетов
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;

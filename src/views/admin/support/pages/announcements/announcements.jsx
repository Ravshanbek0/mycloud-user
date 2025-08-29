import React from "react";
import { useTranslation } from "react-i18next";
const Announcements = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#f7f9fc] p-8 dark:bg-[#0B1538]">
      <div className="max-w-5xl">
        <h2 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("News and Announcements")}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t("Stay informed with our latest updates")}
        </p>

        <div className="rounded-md border bg-white p-4 dark:border-gray-700 dark:bg-[#1a2a61] ">
          <p className="text-gray-800 dark:text-gray-200">
            {t("No announcements at the moment")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;

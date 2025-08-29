import { MdAttachMoney, MdDescription, MdTrolley } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-6">
      <h2 className="my-4 pb-3 text-2xl font-bold dark:text-white">
        {t("Главная")}
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border-t-4 border-green-500 bg-white p-4 shadow dark:bg-[#1A2A61]">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-500 p-2 text-white">
              <MdTrolley size={25} />
            </div>
            <div className="ml-3">
              <p className="font-medium dark:text-white">0 {t("Заказы")}</p>
              <p className=" text-sm text-gray-600">0 {t("Активный")}</p>
              <p className=" text-sm text-gray-600">0 {t("Истекающий")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-t-4 border-red-500 bg-white p-4 shadow dark:bg-[#1A2A61]">
          <div className="flex items-center">
            <div className="rounded-lg bg-red-500 p-2 text-white">
              <MdAttachMoney size={25} />
            </div>
            <div className="ml-3">
              <p className="font-medium dark:text-white">
                0 {t("Счет-фактуры")}
              </p>
              <p className="text-sm text-gray-600">0 {t("Оплачено")}</p>
              <p className="text-sm text-gray-600">0 {t("Неоплачено")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-t-4 border-orange-500 bg-white p-4 shadow dark:bg-[#1A2A61]">
          <div className="flex items-center">
            <div className="rounded-lg bg-orange-500 p-2 text-white">
              <MdDescription size={25} />
            </div>
            <div className="ml-3">
              <p className="font-medium dark:text-white">0 {t("Тикеты")}</p>
              <p className="text-sm text-gray-600">0 {t("Открыть")}</p>
              <p className="text-sm text-gray-600">0 В {t("ожидании")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white shadow dark:bg-[#1A2A61]">
          <h2 className="mb-2 p-4 font-semibold dark:text-white">
            {t("Недавние заказы")}
          </h2>
          <div className="mx-0 border-b border-t px-0 py-4 dark:bg-[#111C44]">
            <p className="px-4 text-sm text-gray-500">{t("Список пуст")}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow dark:bg-[#1A2A61]">
          <h2 className="mb-2 p-4 font-semibold dark:text-white">
            {t("Последние электронные письма")}
          </h2>
          <div className=" dark:bg-[#111C44]">
            <ul>
              {[
                {
                  name: "[MyCloud] Пожалуйста, подтвер...",
                  path: "/admin/email/EmailConfirmation",
                },
                {
                  name: "[MyCloud] Добро пожаловать Nig...",
                  path: "/admin/email/EmailDetail",
                },
                {
                  name: "[MyCloud] Пожалуйста, подтвер...",
                  path: "/admin/email/EmailConfirmation",
                },
                {
                  name: "[MyCloud] Пожалуйста, подтвер...",
                  path: "/admin/email/EmailConfirmation",
                },
              ].map(({ name, path }, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b text-sm last:border-b-0"
                >
                  <Link
                    to={path}
                    className="cursor-pointer p-4 text-blue-600 hover:underline"
                  >
                    {name}
                  </Link>
                  <span className="p-4 text-gray-500 dark:text-white">
                    1 {t("неделя тому назад")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

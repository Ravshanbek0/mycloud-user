import { HiMiniArrowUturnLeft } from "react-icons/hi2";

const EmailConfirmation = () => {
  return (
    <div className="mx-auto mt-9 max-w-6xl rounded-xl bg-white text-gray-900 shadow-lg dark:bg-[#111C44] dark:text-gray-100">
      <div className="mb-4 pb-4">
        <div className="mx-0 flex items-center justify-between border-b border-gray-300 px-0 py-2 dark:border-gray-700">
          <h2 className="px-6 py-3 text-lg font-semibold">
            [MyCloud] Пожалуйста, подтвердите свой адрес электронной почты
          </h2>
          <button
            type="button"
            className="me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <HiMiniArrowUturnLeft size={16} />
            <p className="px-2">Back to email list</p>
          </button>
        </div>

        <div className="mt-3 px-6 text-sm">
          <p className="pb-2">
            <strong>From:</strong> admin@mycloud.uz
          </p>
          <p className="pb-2">
            <strong>To:</strong> nigoratoyloqova5@gmail.com
          </p>
          <p className="pb-2">
            <strong>Created at:</strong> 12/07/2025 22:48
          </p>
          <h2 className="text-lg font-bold">
            [MyCloud] Пожалуйста, подтвердите свой адрес электронной почты
          </h2>
        </div>

        <div className="mt-3 px-6">
          <h3 className="text-xl font-bold">Подтверждение электронной почты</h3>
          <p className="mt-2">Здравствуйте, Nigora Toyloqova,</p>
          <p className="mt-1">
            Подтвердите свой адрес электронной почты, нажав на ссылку ниже:
          </p>
          <a
            href="#"
            className="mt-2 inline-block text-blue-600 dark:text-blue-400"
          >
            Подтвердить адрес электронной почты.
          </a>
          <p className="mt-2">
            Вы также можете{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400">
              войти
            </a>{" "}
            или{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400">
              изменить свой профиль
            </a>
            .
          </p>
        </div>

        <div className="text-md mt-4 border-t border-gray-300 px-6 pt-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          ООО "MYCLOUD" | 100058, Узбекистан, Ташкент, Юнусабадский район, ул.
          Багишамол 57 | Вебсайт: https://mycloud.uz | E-mail: info@mycloud.uz |
          Telegram: t.me/mycloudsupport | Телефон: (+998) 71 205-52-92
        </div>
      </div>

      <div className="px-6 py-3">
        <h2 className="text-3xl font-semibold">Email confirmation</h2>
        <p className="mt-3">Hello Nigora Toyloqova,</p>
        <p className="mt-1">
          Please verify your email by clicking on the link below:
        </p>
        <a
          href="#"
          className="mt-2 inline-block text-blue-600 dark:text-blue-400"
        >
          Verify email address.
        </a>
        <p className="mt-2">
          You may also{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400">
            login
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400">
            edit your profile
          </a>
          .
        </p>

        <div className="text-md mt-4 border-t border-gray-300 pt-2 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          ООО "MYCLOUD" | 100058, Узбекистан, Ташкент, Юнусабадский район, ул.
          Багишамол 57 | Вебсайт: https://mycloud.uz | E-mail: info@mycloud.uz |
          Telegram: t.me/mycloudsupport | Телефон: (+998) 71 205-52-92
        </div>

        <div className="mt-5 flex gap-3 pb-2">
          <button className="rounded-lg bg-[#667382] px-4 py-2 text-white hover:bg-gray-600">
            Отправить повторно
          </button>
          <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;

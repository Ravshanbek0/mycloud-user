import React, { useState, useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "assets/img/avatars/avatar4.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: "https://api-test.mycloud.uz",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users/user-profile/");
        setUserProfile(response.data);
        toast.success(t("profile_loading_success"), {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Foydalanuvchi ma'lumotlarini yuklashda xato:", err);
        let errorMessage = t("profile_loading_error");
        if (err.response) {
          if (err.response.status === 401) {
            try {
              const refreshResponse = await api.post("/auth/token-refresh/", {
                refresh: localStorage.getItem("refresh_token"),
              });
              localStorage.setItem("access_token", refreshResponse.data.access);
              const retryResponse = await api.get("/users/user-profile/");
              setUserProfile(retryResponse.data);
              toast.success(t("profile_loading_success"), {
                position: "top-right",
                autoClose: 3000,
              });
            } catch (refreshErr) {
              console.error("Refresh Token Xatosi:", refreshErr.response?.data || refreshErr.message);
              errorMessage = t("session_expired");
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/auth/sign-in";
            }
          } else if (err.response.status === 403) {
            errorMessage = t("no_permission");
          } else if (err.response.status === 404) {
            errorMessage = t("api_not_found");
          } else {
            errorMessage = err.response.data?.detail || t("server_error");
          }
        } else if (err.request) {
          errorMessage = t("no_connection");
        }
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [t]);

  const getInitial = () => {
    if (userProfile?.first_name) {
      return userProfile.first_name.charAt(0).toUpperCase();
    } else if (userProfile?.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Map current language to flag emoji
  const getCurrentLanguageFlag = () => {
    switch (i18n.language) {
      case "uz":
        return "🇺🇿";
      case "en":
        return "🇬🇧";
      case "ru":
        return "🇷🇺";
      default:
        return "🇺🇿"; // Fallback to Uzbek flag
    }
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <ToastContainer />
      <div className="relative mt-[3px] flex h-[61px] w-full flex-grow items-center justify-between gap-4 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[400px] md:flex-grow-0 md:gap-2 xl:w-[420px] xl:gap-3">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white w-[200px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
            onClick={onOpenSidenav}
          >
            <FiAlignJustify className="h-5 w-5" />
          </span>
          {/* Language Dropdown */}
          <Dropdown
            button={
              <span className="text-xl text-gray-600 dark:text-white cursor-pointer">
                {getCurrentLanguageFlag()}
              </span>
            }
            animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
            children={
              <div className="flex w-[140px] flex-col gap-2 rounded-xl bg-white p-3 shadow-lg dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <button
                  onClick={() => changeLanguage("uz")}
                  className="flex items-center gap-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 rounded-md px-2 py-1"
                >
                  <span>🇺🇿</span> {t("uzbek")}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="flex items-center gap-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 rounded-md px-2 py-1"
                >
                  <span>🇬🇧</span> {t("english")}
                </button>
                <button
                  onClick={() => changeLanguage("ru")}
                  className="flex items-center gap-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 rounded-md px-2 py-1"
                >
                  <span>🇷🇺</span> {t("russian")}
                </button>
              </div>
            }
            classNames={"py-2 top-4 -left-[140px] w-max"}
          />
          {/* Dark Mode Toggle */}
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              if (darkmode) {
                document.body.classList.remove("dark");
                setDarkmode(false);
              } else {
                document.body.classList.add("dark");
                setDarkmode(true);
              }
            }}
          >
            {darkmode ? (
              <RiSunFill className="h-5 w-5 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-5 w-5 text-gray-600 dark:text-white" />
            )}
          </div>
          {/* Profile Dropdown */}
          <Dropdown
            button={
              userProfile?.avatar ? (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={userProfile.avatar}
                  alt={userProfile?.first_name || t("greeting", { name: "Foydalanuvchi" })}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {getInitial()}
                </div>
              )
            }
            children={
              <div className="flex w-56 flex-col justify-start rounded-xl bg-white shadow-lg dark:!bg-navy-700 dark:text-white dark:shadow-none">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {t("greeting", { name: userProfile?.first_name || "Foydalanuvchi" })}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {userProfile?.email || "email@example.com"}
                  </p>
                </div>
                <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
                <div className="flex flex-col p-4">
                  <Link
                    to="/admin/profile"
                    className="text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 rounded-md px-2 py-1"
                  >
                    {t("profile_settings")}
                  </Link>
                  <a
                    href="#"
                    className="mt-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 rounded-md px-2 py-1"
                  >
                    {t("newsletter_settings")}
                  </a>
                  <a
                    href="#"
                    className="mt-2 text-sm font-medium text-red-500 hover:bg-red-100 hover:text-red-600 rounded-md px-2 py-1 transition duration-150 ease-out"
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("refresh_token");
                      window.location.href = "/auth/sign-in";
                    }}
                  >
                    {t("logout")}
                  </a>
                </div>
              </div>
            }
            classNames={"py-2 top-8 -left-[180px] w-max"}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect, useCallback } from "react";
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

const InputField = ({ label, id, type, value, onChange, disabled, name }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 text-gray-900 dark:text-white dark:bg-gray-700"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

const ProfileOverview = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    surname: "",
    email: "",
    phone_1: "",
    address_1: "",
    country: "",
    city_region: "",
    district: "",
    zip_code: "",
    gender: "",
    currency: "",
    individual: {
      birthdate: "",
      JShShIR: "",
      passport_seria: "",
      passport_number: "",
      given_by: "",
      passport_expire_date: "",
    },
  });
  const [changedFields, setChangedFields] = useState({});

  // Joriy tilni olish, default sifatida prefiksiz (o'zbekcha)
  const getLanguagePrefix = () => {
    const lang = i18n.language;
    if (!lang || lang === "uz") {
      return ""; // O'zbekcha uchun prefiks yo'q
    }
    return `/${lang}`;
  };

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const langPrefix = getLanguagePrefix();
      const [countriesResponse, profileResponse, balanceResponse] = await Promise.all([
        api.get(`${langPrefix}/common/geolocation/countries`).catch(() => ({ data: { results: [] } })),
        api.get(`${langPrefix}/users/user-profile/`),
        api.get(`${langPrefix}/users/user-balance/`).catch(() => ({ data: {} })),
      ]);

      if (countriesResponse.data && Array.isArray(countriesResponse.data.results)) {
        setCountries(countriesResponse.data.results);
      } else {
        console.warn(t("error_invalid_country_format"));
      }

      if (!profileResponse.data || typeof profileResponse.data !== "object") {
        throw new Error(t("error_invalid_profile_format"));
      }

      setProfile(profileResponse.data);
      setFormData({
        first_name: profileResponse.data.first_name || "",
        last_name: profileResponse.data.last_name || "",
        surname: profileResponse.data.surname || "",
        email: profileResponse.data.email || "",
        phone_1: profileResponse.data.phone_1 || "",
        address_1: profileResponse.data.address_1 || "",
        country: profileResponse.data.country || "",
        city_region: profileResponse.data.city_region || "",
        district: profileResponse.data.district || "",
        zip_code: profileResponse.data.zip_code || "",
        gender: profileResponse.data.gender || "",
        currency: profileResponse.data.currency || "",
        individual: {
          birthdate: profileResponse.data.individual?.birthdate || "",
          JShShIR: profileResponse.data.individual?.JShShIR || "",
          passport_seria: profileResponse.data.individual?.passport_seria || "",
          passport_number: profileResponse.data.individual?.passport_number || "",
          given_by: profileResponse.data.individual?.given_by || "",
          passport_expire_date: profileResponse.data.individual?.passport_expire_date || "",
        },
      });

      setBalance(balanceResponse.data);

      // Faqat to'g'ri country ID bo'lsa, shahar va tumanlarni olish
      if (profileResponse.data.country && !isNaN(profileResponse.data.country)) {
        const cityResponse = await api.get(`${langPrefix}/common/geolocation/city_with_districts/${profileResponse.data.country}`);
        if (cityResponse.data && Array.isArray(cityResponse.data.districts)) {
          setCities([cityResponse.data]);
          setDistricts(cityResponse.data.districts);
        } else {
          console.warn(t("error_invalid_city_district_format"));
          setCities([]);
          setDistricts([]);
        }
      }
    } catch (err) {
      let errorMessage = t("error_data_fetch");
      if (err.response) {
        if (err.response.status === 401) {
          try {
            const refreshResponse = await api.post(`${getLanguagePrefix()}/auth/token-refresh/`, {
              refresh: localStorage.getItem("refresh_token"),
            });
            localStorage.setItem("access_token", refreshResponse.data.access);
            await fetchInitialData();
            return;
          } catch (refreshErr) {
            errorMessage = t("error_session_expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        } else if (err.response.status === 404) {
          errorMessage = t("error_endpoint_not_found");
        } else if (err.response.status === 403) {
          errorMessage = t("error_no_permission");
        } else {
          errorMessage = err.response.data?.detail || t("error_server");
        }
      } else if (err.request) {
        errorMessage = t("error_network");
      } else {
        errorMessage = err.message || t("error_unknown");
      }
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  }, [t, i18n.language]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (formData.country && !isNaN(formData.country)) {
      const fetchCities = async () => {
        try {
          const langPrefix = getLanguagePrefix();
          const response = await api.get(`${langPrefix}/common/geolocation/city_with_districts/${formData.country}`);
          if (response.data && Array.isArray(response.data.districts)) {
            setCities([response.data]);
            setDistricts(response.data.districts);
          } else {
            throw new Error(t("error_invalid_city_district_format"));
          }
        } catch (err) {
          let errorMessage = t("error_city_district_fetch");
          if (err.response) {
            if (err.response.status === 404) {
              errorMessage = t("error_city_district_not_found");
            } else if (err.response.status === 400) {
              errorMessage = t("error_invalid_country_id");
            } else {
              errorMessage = err.response.data?.detail || t("error_server");
            }
          } else if (err.request) {
            errorMessage = t("error_network");
          }
          toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
          setCities([]);
          setDistricts([]);
          setFormData((prev) => ({ ...prev, city_region: "", district: "" }));
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setDistricts([]);
      setFormData((prev) => ({ ...prev, city_region: "", district: "" }));
    }
  }, [formData.country, t, i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("individual.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        individual: { ...prev.individual, [field]: value },
      }));
      setChangedFields((prev) => ({ ...prev, [`individual.${field}`]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setChangedFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Faqat o'zgartirilgan maydonlarni yuborish uchun changedFields ishlatiladi
      const data = { ...changedFields };

      // Majburiy maydonlarni tekshirish
      if (!formData.first_name || !formData.last_name || !formData.surname || !formData.email || !formData.phone_1) {
        toast.error(t("error_required_fields"), {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      if (profile.user_type === "I" && (!formData.individual.birthdate || !formData.individual.JShShIR)) {
        toast.error(t("error_individual_fields"), {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // PATCH so'rovini sinash uchun ma'lumotlarni konsolga chiqaramiz
      console.log("PATCH data:", JSON.stringify(data, null, 2));

      // PATCH so'rovi, prefiksiz URL bilan
      const response = await api.patch(`/users/user-profile/`, data);

      // Agar PATCH ishlamasa, quyidagi variantlarni sinab ko'ring:
      // 1. PUT metodi:
      // const response = await api.put(`/users/user-profile/`, formData); // To'liq formData bilan
      // 2. Boshqa endpoint:
      // const response = await api.patch(`/users/update-profile/`, data);
      // 3. Til prefiksli URL:
      // const response = await api.patch(`${getLanguagePrefix()}/users/user-profile/`, data);

      setProfile(response.data);
      setEditMode(false);
      setChangedFields({});
    } catch (err) {
      let errorMessage = t("error_update_profile");
      if (err.response) {
        if (err.response.status === 401) {
          try {
            const refreshResponse = await api.post(`${getLanguagePrefix()}/auth/token-refresh/`, {
              refresh: localStorage.getItem("refresh_token"),
            });
            localStorage.setItem("access_token", refreshResponse.data.access);
            await handleUpdateProfile();
            return;
          } catch (refreshErr) {
            errorMessage = t("error_session_expired");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        } else if (err.response.status === 405) {
          errorMessage = t("error_method_not_allowed");
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.detail || t("error_invalid_format");
        } else if (err.response.status === 403) {
          errorMessage = t("error_update_no_permission");
        } else if (err.response.status === 404) {
          errorMessage = t("error_endpoint_not_found");
        } else {
          errorMessage = err.response.data?.detail || t("error_server");
        }
      } else if (err.request) {
        errorMessage = t("error_network");
      } else {
        errorMessage = err.message || t("error_unknown");
      }
      console.error("PATCH error:", err.response?.data || err.message);
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  };

  const getCountryName = (id) => countries.find((c) => c.id === parseInt(id))?.name || t("unknown");
  const getCityName = (id) => cities.find((c) => c.id === parseInt(id))?.name || t("unknown");
  const getDistrictName = (id) => districts.find((d) => d.id === parseInt(id))?.name || t("unknown");

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-5 py-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="text-lg text-gray-700 dark:text-white">{t("loading_message")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-5 py-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-blue-500 py-2 px-6 text-base font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700"
        >
          {t("retry_button")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">{t("title")}</h2>

      {profile && (
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{t("profile_section")}</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="rounded-xl bg-blue-500 py-2 px-4 text-base font-medium text-white transition duration-200 hover:bg-blue-600"
            >
              {editMode ? t("cancel_button") : t("edit_button")}
            </button>
          </div>
          {editMode ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InputField
                label={t("first_name")}
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleInputChange}
                name="first_name"
              />
              <InputField
                label={t("last_name")}
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleInputChange}
                name="last_name"
              />
              <InputField
                label={t("surname")}
                id="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                name="surname"
              />
              <InputField
                label={t("email")}
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                disabled
              />
              <InputField
                label={t("phone_1")}
                id="phone_1"
                type="text"
                value={formData.phone_1}
                onChange={handleInputChange}
                name="phone_1"
              />
              <InputField
                label={t("address_1")}
                id="address_1"
                type="text"
                value={formData.address_1}
                onChange={handleInputChange}
                name="address_1"
              />
              <SelectField
                label={t("country")}
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                options={countries}
                placeholder={t("country_placeholder")}
              />
              <SelectField
                label={t("city_region")}
                name="city_region"
                value={formData.city_region}
                onChange={handleInputChange}
                options={cities}
                placeholder={t("city_region_placeholder")}
              />
              <SelectField
                label={t("district")}
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                options={districts}
                placeholder={t("district_placeholder")}
              />
              <InputField
                label={t("zip_code")}
                id="zip_code"
                type="text"
                value={formData.zip_code}
                onChange={handleInputChange}
                name="zip_code"
              />
              <SelectField
                label={t("gender")}
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  { id: "M", name: t("gender_male") },
                  { id: "F", name: t("gender_female") },
                ]}
                placeholder={t("gender_placeholder")}
              />
              <InputField
                label={t("currency")}
                id="currency"
                type="text"
                value={formData.currency}
                onChange={handleInputChange}
                name="currency"
              />
              {profile.user_type === "I" && (
                <>
                  <InputField
                    label={t("birthdate")}
                    id="birthdate"
                    type="date"
                    value={formData.individual.birthdate}
                    onChange={handleInputChange}
                    name="individual.birthdate"
                  />
                  <InputField
                    label={t("JShShIR")}
                    id="JShShIR"
                    type="text"
                    value={formData.individual.JShShIR}
                    onChange={handleInputChange}
                    name="individual.JShShIR"
                  />
                  <InputField
                    label={t("passport_seria")}
                    id="passport_seria"
                    type="text"
                    value={formData.individual.passport_seria}
                    onChange={handleInputChange}
                    name="individual.passport_seria"
                  />
                  <InputField
                    label={t("passport_number")}
                    id="passport_number"
                    type="text"
                    value={formData.individual.passport_number}
                    onChange={handleInputChange}
                    name="individual.passport_number"
                  />
                  <InputField
                    label={t("given_by")}
                    id="given_by"
                    type="text"
                    value={formData.individual.given_by}
                    onChange={handleInputChange}
                    name="individual.given_by"
                  />
                  <InputField
                    label={t("passport_expire_date")}
                    id="passport_expire_date"
                    type="date"
                    value={formData.individual.passport_expire_date}
                    onChange={handleInputChange}
                    name="individual.passport_expire_date"
                  />
                </>
              )}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="rounded-xl bg-blue-500 py-2 px-6 text-base font-medium text-white transition duration-200 hover:bg-blue-600"
                >
                  {t("update_button")}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("first_name")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.first_name || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("last_name")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.last_name || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("surname")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.surname || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("email")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.email || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("phone_1")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.phone_1 || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("address_1")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.address_1 || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("country")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{getCountryName(profile.country)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("city_region")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{getCityName(profile.city_region)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("district")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{getDistrictName(profile.district)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("zip_code")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.zip_code || t("unknown")}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("gender")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {profile.gender === "M" ? t("gender_male") : profile.gender === "F" ? t("gender_female") : t("unknown")}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("currency")}:</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.currency || t("unknown")}</p>
              </div>
              {profile.user_type === "I" && profile.individual && (
                <>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("birthdate")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.individual.birthdate || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("JShShIR")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.individual.JShShIR || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("passport_seria")} {t("passport_number")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.individual.passport_seria} {profile.individual.passport_number}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("given_by")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.individual.given_by || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("passport_expire_date")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.individual.passport_expire_date || t("unknown")}
                    </p>
                  </div>
                </>
              )}
              {profile.user_type === "L" && profile.legal_entity && (
                <>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("company_name")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.company_name || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("bank_name")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.bank_name || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("account_number")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.account_number || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("INN")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.INN || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("MFO")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.MFO || t("unknown")}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("OKED")}:</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {profile.legal_entity.OKED || t("unknown")}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {balance && (
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 transform transition-all duration-300 hover:shadow-xl">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">{t("balance_section")}</h3>
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("current_balance")}:</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {balance.balance ? `${balance.balance} ${balance.currency || "UZS"}` : "0 UZS"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t("footer")}
      </div>
    </div>
  );
};

export default ProfileOverview;
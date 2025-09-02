import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

const InputField = ({
  extra,
  label,
  placeholder,
  id,
  type,
  value,
  onChange,
  name,
  maxLength,
  showPassword,
  toggleShowPassword,
}) => (
  <div className={`relative ${extra}`}>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      {(name === "password" || name === "repeatPassword" || name === "currentPassword" || name === "newPassword") && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  </div>
);

const Checkbox = ({ checked, onChange, name }) => (
  <input
    type="checkbox"
    name={name}
    checked={checked}
    onChange={onChange}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
);

const SelectField = ({ label, value, onChange, options, placeholder, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
    currentPassword: false,
    newPassword: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    currentPassword: "",
    newPassword: "",
    userType: "I",
    firstName: "",
    lastName: "",
    surname: "",
    birthdate: "",
    jshshir: "",
    passportSeria: "",
    passportNumber: 1234567,
    givenBy: "",
    passportExpireDate: "",
    country: "",
    cityRegion: "",
    district: "",
    address1: "",
    phone1: "",
    zipCode: "",
    companyName: "",
    bankName: "",
    accountNumber: "",
    inn: "",
    mfo: "",
    oked: "",
    keepLoggedIn: false,
  });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchCountries = useCallback(async () => {
    try {
      const response = await api.get("/common/geolocation/countries");
      if (response.data && Array.isArray(response.data.results)) {
        setCountries(response.data.results);
      } else {
        throw new Error("Davlatlar ro'yxati noto'g'ri formatda qaytdi.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "Autentifikatsiya xatosi: Iltimos, tizimga qayta kiring."
          : err.response?.status === 403
            ? "Ruxsat yo'q: Davlatlar ro'yxatini olish uchun ruxsat kerak."
            : err.response?.status === 404
              ? "API endpoint topilmadi."
              : err.response?.data?.detail ||
              "Davlatlar ro‘yxatini yuklashda xato yuz berdi!";
      toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    if (formData.country) {
      const fetchCities = async () => {
        try {
          const response = await api.get(
            `/common/geolocation/city_with_districts/${formData.country}`
          );
          if (response.data) {
            setCities([response.data]);
            setDistricts(response.data.districts || []);
          } else {
            throw new Error(
              "Shahar/tumanlar ro'yxati noto'g'ri formatda qaytdi."
            );
          }
        } catch (err) {
          const errorMessage =
            err.response?.status === 401
              ? "Autentifikatsiya xatosi: Iltimos, tizimga qayta kiring."
              : err.response?.status === 404
                ? "Shahar/tumanlar uchun API endpoint topilmadi."
                : err.response?.data?.detail ||
                "Shahar/tumanlarni yuklashda xato yuz berdi!";
          toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setDistricts([]);
      setFormData((prev) => ({ ...prev, cityRegion: "", district: "" }));
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "passportSeria"
            ? value.toUpperCase()
            : value,
    }));
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {
      email,
      password,
      repeatPassword,
      currentPassword,
      newPassword,
      userType,
      firstName,
      lastName,
      surname,
      birthdate,
      jshshir,
      passportSeria,
      passportNumber,
      givenBy,
      passportExpireDate,
      country,
      cityRegion,
      district,
      address1,
      phone1,
      zipCode,
      companyName,
      bankName,
      accountNumber,
      inn,
      mfo,
      oked,
    } = formData;

    if (showForgotPasswordModal) {
      if (!email || !emailRegex.test(email))
        return "Iltimos, to‘g‘ri email kiriting.";
      if (!currentPassword) return "Joriy parol kiritilishi shart.";
      if (!newPassword) return "Yangi parol kiritilishi shart.";
      if (newPassword.length < 8)
        return "Yangi parol kamida 8 belgi bo‘lishi kerak.";
      if (newPassword !== repeatPassword) return "Yangi parollar mos kelmadi.";
    } else if (isLogin) {
      if (!email || !emailRegex.test(email))
        return "Iltimos, to‘g‘ri email kiriting.";
      if (!password) return "Parol kiritilishi shart.";
      if (password.length < 8) return "Parol kamida 8 belgi bo‘lishi kerak.";
    } else {
      if (!email || !emailRegex.test(email))
        return "Iltimos, to‘g‘ri email kiriting.";
      if (!password) return "Parol kiritilishi shart.";
      if (password.length < 8) return "Parol kamida 8 belgi bo‘lishi kerak.";
      if (password !== repeatPassword) return "Parollar mos kelmadi.";
      if (!firstName) return "Ism kiritilishi shart.";
      if (!lastName) return "Familiya kiritilishi shart.";
      if (!surname) return "Otasining ismi kiritilishi shart.";
      if (!birthdate) return "Tug‘ilgan sana kiritilishi shart.";
      if (!jshshir || !/^\d{14}$/.test(jshshir))
        return "JShShIR 14 raqamdan iborat bo‘lishi kerak.";
      if (!passportSeria || !/^[A-Z]{2}$/.test(passportSeria))
        return "Pasport seriyasi 2 ta katta harfdan iborat bo‘lishi kerak.";
      if (!passportNumber || !/^\d{7}$/.test(passportNumber))
        return "Pasport raqami 7 raqamdan iborat bo‘lishi kerak.";
      if (!givenBy) return "Pasportni kim berdi maydoni kiritilishi shart.";
      if (!passportExpireDate)
        return "Pasport amal qilish muddati kiritilishi shart.";
      if (!country) return "Davlat kiritilishi shart.";
      if (!cityRegion) return "Shahar/viloyat kiritilishi shart.";
      if (!district) return "Tuman kiritilishi shart.";
      if (!address1) return "Manzil kiritilishi shart.";
      if (!phone1 || !/^\d{9}$/.test(phone1))
        return "Telefon raqami 9 raqamdan iborat bo‘lishi kerak (masalan, 9991234567).";
      if (!zipCode) return "Pochta indeksi kiritilishi shart.";
      if (userType === "L") {
        if (!companyName) return "Kompaniya nomi kiritilishi shart.";
        if (!bankName) return "Bank nomi kiritilishi shart.";
        if (!accountNumber || !/^\d+$/.test(accountNumber))
          return "Hisob raqami faqat raqamlardan iborat bo‘lishi kerak.";
        if (!inn || !/^\d{9}$/.test(inn))
          return "INN 9 raqamdan iborat bo‘lishi kerak.";
        if (!mfo || !/^\d{5}$/.test(mfo))
          return "MFO 5 raqamdan iborat bo‘lishi kerak.";
        if (!oked || !/^\d{5}$/.test(oked))
          return "OKED 5 raqamdan iborat bo‘lishi kerak.";
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateInputs();
    try {
      if (showForgotPasswordModal) {
        await api.post("/auth/send-reset-password-email/", {
          email : formData.email
        });
        toast.success(
          "Iltimos emailingizni tekshiring.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        localStorage.setItem("reset-email",formData.email)
        setShowForgotPasswordModal(false);
        setFormData({
          ...formData,
          email: "",
          currentPassword: "",
          newPassword: "",
          repeatPassword: "",
        });
        setIsLogin(true);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } else if (isLogin) {
        const response = await api.post("/auth/token/", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        toast.success("Tizimga muvaffaqiyatli kirildi!", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate("/admin/default");
      } else {
        const registerData = {
          email: formData.email,
          password: formData.password,
          user_type: formData.userType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          surname: formData.surname,
          country: formData.country,
          city_region: formData.cityRegion,
          district: formData.district,
          address_1: formData.address1,
          phone_1: `+998${formData.phone1}`,
          zip_code: formData.zipCode,
          individual_data: {
            birthdate: formData.birthdate,
            JShShIR: parseFloat(formData.jshshir),
            passport_seria: formData.passportSeria,
            passport_number: parseFloat(formData.passportNumber),
            given_by: formData.givenBy,
            passport_expire_date: formData.passportExpireDate,
          },
        };
        if (formData.userType === "L") {
          registerData.legal_entity_data = {
            company_name: formData.companyName,
            bank_name: formData.bankName,
            account_number: formData.accountNumber,
            INN: formData.inn,
            MFO: formData.mfo,
            OKED: formData.oked,
          };
        }
        console.log(registerData);

        const response = await api.post("/users/register/", registerData);
        const response2 = await api.post("/auth/token/", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("access_token", response2.data.access);
        localStorage.setItem("refresh_token", response2.data.refresh);
        toast.success(
          "Ro‘yxatdan o‘tish muvaffaqiyatli!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/admin/default");

        setFormData({
          email: "",
          password: "",
          repeatPassword: "",
          currentPassword: "",
          newPassword: "",
          userType: "I",
          firstName: "",
          lastName: "",
          surname: "",
          birthdate: "",
          jshshir: "",
          passportSeria: "",
          passportNumber: "",
          givenBy: "",
          passportExpireDate: "",
          country: "",
          cityRegion: "",
          district: "",
          address1: "",
          phone1: "",
          zipCode: "",
          companyName: "",
          bankName: "",
          accountNumber: "",
          inn: "",
          mfo: "",
          oked: "",
          keepLoggedIn: false,
        });
      }
    } catch (err) {
      if (err.response?.status === 401 && showForgotPasswordModal) {
        try {
          const refreshResponse = await api.post("/auth/token-refresh/", {
            refresh: localStorage.getItem("refresh_token"),
          });
          localStorage.setItem("access_token", refreshResponse.data.access);
          await api.post("/auth/change-password/", {
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
            repeat_password: formData.repeatPassword,
          });
          toast.success(
            "Parol muvaffaqiyatli o‘zgartirildi! Iltimos, yangi parol bilan tizimga kiring.",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
          setShowForgotPasswordModal(false);
          setFormData({
            ...formData,
            email: "",
            currentPassword: "",
            newPassword: "",
            repeatPassword: "",
          });
          setIsLogin(true);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        } catch (refreshErr) {
          toast.error("Sessiya muddati tugadi. Iltimos, qayta kiring.", {
            position: "top-right",
            autoClose: 5000,
          });
          setShowForgotPasswordModal(false);
          setIsLogin(true);
        }
      } else {
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.errors?.map((e) => e.message).join(", ") ||
          (showForgotPasswordModal
            ? "Parolni o‘zgartirish muvaffaqiyatsiz. Joriy parolni tekshiring."
            : isLogin
              ? "Kirish muvaffaqiyatsiz. Email yoki parolni tekshiring."
              : "Ro‘yxatdan o‘tish muvaffaqiyatsiz. Ma'lumotlarni tekshiring.");
        toast.error(errorMessage, { position: "top-right", autoClose: 5000 });
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowForgotPasswordModal(false);
    setFormData({
      email: "",
      password: "",
      repeatPassword: "",
      currentPassword: "",
      newPassword: "",
      userType: "I",
      firstName: "",
      lastName: "",
      surname: "",
      birthdate: "",
      jshshir: "",
      passportSeria: "",
      passportNumber: "",
      givenBy: "",
      passportExpireDate: "",
      country: "",
      cityRegion: "",
      district: "",
      address1: "",
      phone1: "",
      zipCode: "",
      companyName: "",
      bankName: "",
      accountNumber: "",
      inn: "",
      mfo: "",
      oked: "",
      keepLoggedIn: false,
    });
    setShowPassword({
      password: false,
      repeatPassword: false,
      currentPassword: false,
      newPassword: false,
    });
  };

  const openForgotPasswordModal = () => {
    
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setFormData({
      ...formData,
      email: "",
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    });
    setShowPassword({
      password: false,
      repeatPassword: false,
      currentPassword: false,
      newPassword: false,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800  shadow-lg p-8">
        <h4 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isLogin
            ? "Email va parolni kiriting!"
            : "Yangi hisob yaratish uchun ma'lumotlarni kiriting!"}
        </p>
        <ToastContainer />
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
          <p className="text-gray-600 dark:text-gray-300">yoki</p>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div>
          <InputField
            extra="mb-4"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
          />
          {isLogin && !showForgotPasswordModal ? (
            <>
              <InputField
                extra="mb-4"
                label="Parol*"
                placeholder="Kamida 8 belgi"
                id="password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                showPassword={showPassword.password}
                toggleShowPassword={() => toggleShowPassword("password")}
              />
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    checked={formData.keepLoggedIn}
                    onChange={handleInputChange}
                    name="keepLoggedIn"
                  />
                  <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    Meni eslab qol
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
            </>
          ) : !showForgotPasswordModal ? (
            <>
              <InputField
                extra="mb-4"
                label="Parol*"
                placeholder="Kamida 8 belgi"
                id="password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                showPassword={showPassword.password}
                toggleShowPassword={() => toggleShowPassword("password")}
              />
              <InputField
                extra="mb-4"
                label="Parolni takrorlang*"
                placeholder="Kamida 8 belgi"
                id="repeatPassword"
                type={showPassword.repeatPassword ? "text" : "password"}
                value={formData.repeatPassword}
                onChange={handleInputChange}
                name="repeatPassword"
                showPassword={showPassword.repeatPassword}
                toggleShowPassword={() => toggleShowPassword("repeatPassword")}
              />

              <InputField
                extra="mb-4"
                label="Ism*"
                placeholder="Ismingiz"
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                name="firstName"
              />
              <InputField
                extra="mb-4"
                label="Familiya*"
                placeholder="Familiyangiz"
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                name="lastName"
              />
              <InputField
                extra="mb-4"
                label="Otasining ismi*"
                placeholder="Otasining ismi"
                id="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                name="surname"
              />
              <InputField
                extra="mb-4"
                label="Tug‘ilgan sana*"
                id="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleInputChange}
                name="birthdate"
              />
              <SelectField
                label="Davlat*"
                value={formData.country}
                onChange={handleInputChange}
                name="country"
                options={countries}
                placeholder="Davlatni tanlang"
              />
              <SelectField
                label="Shahar/Viloyat*"
                value={formData.cityRegion}
                onChange={handleInputChange}
                name="cityRegion"
                options={cities}
                placeholder="Shahar/viloyatni tanlang"
              />
              <SelectField
                label="Tuman*"
                value={formData.district}
                onChange={handleInputChange}
                name="district"
                options={districts}
                placeholder="Tumanni tanlang"
              />
              <InputField
                extra="mb-4"
                label="Manzil*"
                placeholder="Manzil"
                id="address1"
                type="text"
                value={formData.address1}
                onChange={handleInputChange}
                name="address1"
              />
              <InputField
                extra="mb-4"
                label="Telefon raqami*"
                placeholder="9991234567"
                id="phone1"
                type="text"
                maxLength="9"
                value={formData.phone1}
                onChange={handleInputChange}
                name="phone1"
              />
              <InputField
                extra="mb-4"
                label="Pochta indeksi*"
                placeholder="Pochta indeksi"
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleInputChange}
                name="zipCode"
              />
              <SelectField
                label="Foydalanuvchi turi*"
                value={formData.userType}
                onChange={handleInputChange}
                name="userType"
                options={[
                  { id: "I", name: "Jismoniy shaxs" },
                  { id: "L", name: "Yuridik shaxs" },
                ]}
                placeholder="Foydalanuvchi turini tanlang"
              />
              {formData.userType === "I" && (
                <>
                  <InputField
                    extra="mb-4"
                    label="JShShIR*"
                    placeholder="12345678901234"
                    id="jshshir"
                    type="text"
                    maxLength="14"
                    value={formData.jshshir}
                    onChange={handleInputChange}
                    name="jshshir"
                  />
                  <InputField
                    extra="mb-4"
                    label="Pasport seriyasi*"
                    placeholder="AA"
                    id="passportSeria"
                    type="text"
                    maxLength="2"
                    value={formData.passportSeria}
                    onChange={handleInputChange}
                    name="passportSeria"
                  />
                  <InputField
                    extra="mb-4"
                    label="Pasport raqami*"
                    placeholder="1234567"
                    id="passportNumber"
                    type="text"
                    maxLength="7"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    name="passportNumber"
                  />
                  <InputField
                    extra="mb-4"
                    label="Kim tomonidan berilgan*"
                    placeholder="Masalan, Toshkent sh. IIB"
                    id="givenBy"
                    type="text"
                    value={formData.givenBy}
                    onChange={handleInputChange}
                    name="givenBy"
                  />
                  <InputField
                    extra="mb-4"
                    label="Pasport amal qilish muddati*"
                    id="passportExpireDate"
                    type="date"
                    value={formData.passportExpireDate}
                    onChange={handleInputChange}
                    name="passportExpireDate"
                  />
                </>
              )}

              {formData.userType === "L" && (
                <>
                  <InputField
                    extra="mb-4"
                    label="Kompaniya nomi*"
                    placeholder="Kompaniya nomi"
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    name="companyName"
                  />
                  <InputField
                    extra="mb-4"
                    label="Bank nomi*"
                    placeholder="Bank nomi"
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    name="bankName"
                  />
                  <InputField
                    extra="mb-4"
                    label="Hisob raqami*"
                    placeholder="Hisob raqami"
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    name="accountNumber"
                  />
                  <InputField
                    extra="mb-4"
                    label="INN*"
                    placeholder="123456789"
                    id="inn"
                    type="text"
                    maxLength="9"
                    value={formData.inn}
                    onChange={handleInputChange}
                    name="inn"
                  />
                  <InputField
                    extra="mb-4"
                    label="MFO*"
                    placeholder="12345"
                    id="mfo"
                    type="text"
                    maxLength="5"
                    value={formData.mfo}
                    onChange={handleInputChange}
                    name="mfo"
                  />
                  <InputField
                    extra="mb-4"
                    label="OKED*"
                    placeholder="12345"
                    id="oked"
                    type="text"
                    maxLength="5"
                    value={formData.oked}
                    onChange={handleInputChange}
                    name="oked"
                  />
                </>
              )}
            </>
          ) : null}
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-blue-600 py-3 text-base font-medium text-white transition duration-200 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
          </button>
        </div>

        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Parolni O‘zgartirish
              </h3>
              <div>
                <InputField
                  extra="mb-4"
                  label="Email*"
                  placeholder="mail@simmmple.com"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                />
                {/* <InputField
                  extra="mb-4"
                  label="Joriy parol*"
                  placeholder="Joriy parolni kiriting"
                  id="currentPassword"
                  type={showPassword.currentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  name="currentPassword"
                  showPassword={showPassword.currentPassword}
                  toggleShowPassword={() => toggleShowPassword("currentPassword")}
                />
                <InputField
                  extra="mb-4"
                  label="Yangi parol*"
                  placeholder="Kamida 8 belgi"
                  id="newPassword"
                  type={showPassword.newPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  name="newPassword"
                  showPassword={showPassword.newPassword}
                  toggleShowPassword={() => toggleShowPassword("newPassword")}
                />
                <InputField
                  extra="mb-4"
                  label="Yangi parolni takrorlang*"
                  placeholder="Kamida 8 belgi"
                  id="repeatPassword"
                  type={showPassword.repeatPassword ? "text" : "password"}
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  name="repeatPassword"
                  showPassword={showPassword.repeatPassword}
                  toggleShowPassword={() => toggleShowPassword("repeatPassword")}
                /> */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 transition duration-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    Parolni O‘zgartirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isLogin ? "Hali ro‘yxatdan o‘tmaganmisiz?" : "Hisobingiz bormi?"}
          </span>
          <button
            onClick={toggleForm}
            className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isLogin ? "Hisob yaratish" : "Kirish"}
          </button>
        </div>
      </div>
    </div>
  );
}
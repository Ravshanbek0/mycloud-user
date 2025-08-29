import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [colocationAddons, setColocationAddons] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("click");

  const fetchCartItems = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const response = await fetch("https://api-test.mycloud.uz/shopping-cart-item/auth-user-cart-items/list/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${t("cart_retrieval_error")} (Status: ${response.status})`);
      }

      const data = await response.json();
      setCartItems((prevItems) => [...prevItems, ...data.results]);
      setNextUrl(data.next);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchColocationAddons = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const langPrefix = localStorage.getItem("i18n_language") || "uz";
      const apiUrl = `https://api-test.mycloud.uz/${langPrefix}/user-side-services/active-colocation-addons/?limit=10&offset=0`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${t("data_retrieval_error")} (Status: ${response.status})`);
      }

      const data = await response.json();
      setColocationAddons(data.results || []);
    } catch (err) {
      console.error("Error fetching colocation addons:", err);
    }
  };

  const fetchOperatingSystems = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const langPrefix = localStorage.getItem("i18n_language") || "uz";
      const apiUrl = `https://api-test.mycloud.uz/${langPrefix}/user-side-services/operating-systems/?limit=10&offset=0`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${t("data_retrieval_error")} (Status: ${response.status})`);
      }

      const data = await response.json();
      setOperatingSystems(data.results || []);
    } catch (err) {
      console.error("Error fetching operating systems:", err);
    }
  };

  useEffect(() => {
    const initializeCartAndFetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error(t("auth_issue"));
        }

        // Savatni faqat kerak bo‘lganda yaratamiz (agar mavjud bo‘lmasa)
        const checkCartResponse = await fetch(
          "https://api-test.mycloud.uz/shopping-cart/auth-user-cart/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (checkCartResponse.status === 404 || checkCartResponse.status === 400) {
          // Savat mavjud emas bo‘lsa, yaratamiz
          const createCartResponse = await fetch(
            "https://api-test.mycloud.uz/shopping-cart/auth-user-cart/create/",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!createCartResponse.ok) {
            throw new Error(`${t("cart_creation_error")} (Status: ${createCartResponse.status})`);
          }
        }

        // Qo‘shimcha ma’lumotlarni yuklash
        await fetchColocationAddons();
        await fetchOperatingSystems();
        await fetchCartItems();
      } catch (err) {
        console.error("Error initializing cart or fetching items:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeCartAndFetchItems();
  }, [t]);

  const handleLoadMore = () => {
    if (nextUrl) {
      fetchCartItems(nextUrl);
    }
  };

  const handleDeleteItem = async (itemId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const response = await fetch(
        `https://api-test.mycloud.uz/shopping-cart-item/auth-user-cart-item/${itemId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-CSRFTOKEN": localStorage.getItem("csrf_token") || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(t("cart_item_delete_error"));
      }

      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (itemId, updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const response = await fetch(
        `https://api-test.mycloud.uz/shopping-cart-item/auth-user-cart-item/${itemId}/update/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-CSRFTOKEN": localStorage.getItem("csrf_token") || "",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(t("cart_item_update_error"));
      }

      const updatedItem = await response.json();
      setCartItems(cartItems.map((item) => (item.id === itemId ? updatedItem : item)));
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) {
      setError(t("cart_empty"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const payload = {
        cart_items: cartItems.map((item) => ({
          id: item.id,
          plan: item.plan.id,
          configs: item.configs || {},
        })),
        payment_method: selectedPaymentMethod,
      };

      const response = await fetch(
        "https://api-test.mycloud.uz/shopping-cart/auth-user-cart/confirm/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("payment_confirmation_error"));
      }

      navigate("/admin/payments");
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/order");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-800 dark:text-gray-200">
        {t("loading_status")}
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-center text-red-500">
  //       {t("error_status")}: {error}
  //       <button onClick={() => window.location.reload()} className="ml-4 text-blue-600 hover:underline">
  //         {t("retry")}
  //       </button>
  //     </div>
  //   );
  // }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto bg-white p-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <button
          onClick={handleBack}
          className="mb-6 rounded-lg bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          {t("go_back")}
        </button>
        <div className="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
          <h1 className="mb-4 text-2xl font-bold">{t("cart")}</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">{t("cart_empty")}</p>
          <button
            onClick={() => navigate("/admin/order")}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {t("continue_shopping")}
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.plan?.discounted_monthly_price || 0;
    const months = item.plan?.period_months || 1;
    const addonPrice = item.configs?.addon
      ? colocationAddons.find((addon) => addon.name === item.configs.addon)?.monthly_price || 0
      : 0;
    return total + (price * months) + addonPrice;
  }, 0);

  return (
    <div className="container mx-auto bg-white p-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <button
        onClick={handleBack}
        className="mb-6 rounded-lg bg-gray-500 px-4 py-2 text-white transition duration-300 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
      >
        {t("go_back")}
      </button>
      <div className="rounded-lg bg-gray-100 p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold">{t("cart")}</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {t("your_shopping_cart")} ({cartItems.length} {t("items")})
        </p>
        <div className="mb-4 grid grid-cols-3 gap-4 border-b pb-2">
          <p className="font-semibold">{t("product")}</p>
          <p className="font-semibold text-center">{t("price")}</p>
          <p className="font-semibold text-right">{t("actions")}</p>
        </div>
        {cartItems.map((item) => (
          <div key={item.id} className="mb-4 grid grid-cols-3 gap-4 items-center">
            <p>
              {t("host_plan", { name: item.plan?.name || t("unknown"), domain: item.configs?.domain || t("no_domain") })}
              {item.plan?.type === "vps" && item.configs?.os && (
                <span className="block text-sm text-gray-500">OS: {item.configs.os}</span>
              )}
              {item.plan?.type === "colocation" && item.configs?.addon && (
                <span className="block text-sm text-gray-500">Addon: {item.configs.addon}</span>
              )}
              <span className="block text-sm text-gray-500">
                {t("duration_period", { count: item.plan?.period_months || 1 })}
              </span>
            </p>
            <p className="text-center">
              {item.plan?.discounted_monthly_price
                ? `${item.plan.discounted_monthly_price} ${t("currency_code")}/oy`
                : t("free")}
              {item.configs?.addon && (
                <span className="block text-sm text-gray-500">
                  + {colocationAddons.find((addon) => addon.name === item.configs.addon)?.monthly_price || 0} {t("currency_code")}
                </span>
              )}
            </p>
            <div className="text-right">
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="mr-2 text-orange-500 hover:text-orange-600"
                title={t("remove_item")}
              >
                ✖
              </button>
              <button
                onClick={() =>
                  handleUpdateItem(item.id, { plan: item.plan.id, configs: item.configs || {} })
                }
                className="text-blue-500 hover:text-blue-600"
                title={t("update_item")}
              >
                ✎
              </button>
            </div>
          </div>
        ))}
        {nextUrl && (
          <button
            onClick={handleLoadMore}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {t("load_more")}
          </button>
        )}
        <div className="mb-4 flex justify-between">
          <p>{t("have_coupon_code")}</p>
          <p className="text-orange-500 cursor-pointer hover:underline">{t("apply_coupon")}</p>
        </div>
        <div className="mb-4 flex justify-between">
          <p className="font-semibold">{t("total")}</p>
          <p className="font-semibold">
            {totalPrice > 0 ? `${totalPrice} ${t("currency_code")}` : t("free")}
          </p>
        </div>
        {totalPrice > 0 && (
          <>
            <div className="mb-4">
              <p className="font-semibold">{t("payment_options")}</p>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="click"
                  checked={selectedPaymentMethod === "click"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                {t("pay_by_click")}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="payme"
                  checked={selectedPaymentMethod === "payme"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                {t("pay_by_payme")}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="bank_card"
                  checked={selectedPaymentMethod === "bank_card"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                {t("pay_by_bank_card")}
              </label>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="mt-6 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? t("processing") : t("checkout")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
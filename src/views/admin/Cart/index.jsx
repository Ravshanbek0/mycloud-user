import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [colocationAddons, setColocationAddons] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("click");
  const [editingItems, setEditingItems] = useState({}); // { [id]: { isEditing: bool, domain: "" } }
  const apiUrlEnv = process.env.REACT_APP_API_URL;


  // edit mode yoqish
  const handleEditClick = (item) => {
    setEditingItems((prev) => ({
      ...prev,
      [item.id]: {
        isEditing: true,
        domain: item.configs?.domain || "",
      },
    }));
  };

  // input value o'zgartirish
  const handleDomainChange = (itemId, value) => {
    setEditingItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        domain: value,
      },
    }));
  };

  // saqlash
  const handleSaveChanges = (item) => {
    const editedDomain = editingItems[item.id]?.domain || "";

    handleUpdateItem(item.id, {
      plan: item.plan.id,
      configs: {
        ...item.configs,
        domain: editedDomain,
      },
    });

    setEditingItems((prev) => ({
      ...prev,
      [item.id]: { ...prev[item.id], isEditing: false },
    }));
  };

  const fetchCartItems = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      const response = await fetch(`${apiUrlEnv}shopping-cart-item/auth-user-cart-items/list/`, {
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
      console.log(data.results)
      setCartItems(data.results);
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

      const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`
      const apiUrl = `${apiUrlEnv}${langPrefix}user-side-services/active-colocation-addons/?limit=10&offset=0`;

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

      const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`
      const apiUrl = `${apiUrlEnv}${langPrefix}user-side-services/operating-systems/?limit=10&offset=0`;

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
          `${apiUrlEnv}shopping-cart/auth-user-cart/`,
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
            `${apiUrlEnv}shopping-cart/auth-user-cart/create/`,
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
        `${apiUrlEnv}shopping-cart-item/auth-user-cart-item/${itemId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
        `${apiUrlEnv}shopping-cart-item/auth-user-cart-item/${itemId}/update/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
        `${apiUrlEnv}shopping-cart/auth-user-cart/confirm/`,
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

  if (error) {
    return (
      <div className="text-center text-red-500">
        {t("error_status")}: {error}
        <button onClick={() => window.location.reload()} className="ml-4 text-blue-600 hover:underline">
          {t("retry")}
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto  px-4 py-8 text-gray-800 dark:text-gray-200">
        {/* Go back button */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-md bg-gray-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          ← {t("go_back")}
        </button>

        {/* Card */}
        <div className="rounded-xl bg-gray-100 p-8 shadow-xl dark:bg-gray-800">
          <h1 className="mb-6 text-3xl font-extrabold">{t("cart")}</h1>

          {/* Empty cart illustration and message */}
          <div className="flex flex-col items-center text-center">
            <svg
              className="mb-4 h-24 w-24 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7.5M17 13l1.5 7.5M9 21h6"
              />
            </svg>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{t("cart_empty")}</p>

            {/* Continue shopping button */}
            <button
              onClick={() => navigate("/admin/order")}
              className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t("continue_shopping")}
            </button>
          </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1538] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("your_shopping_cart")}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {cartItems.length} {t("items")}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="mt-4 sm:mt-0 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("continue_shopping")}
          </button>
        </div>

        {/* Progress Bar */}
        {/* <div className="mb-10">
          <div className="flex items-center justify-between mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="text-blue-600 dark:text-blue-400">{t("cart")}</span>
            <span>{t("shipping")}</span>
            <span>{t("payment")}</span>
            <span>{t("confirmation")}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full w-1/4"></div>
          </div>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-[#111C44] rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("cart_items")}</h2>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cartItems.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">{t("empty_cart")}</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const editState = editingItems[item.id] || { isEditing: false, domain: item.configs?.domain || "" };

                    return (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {item.configs && Object.keys(item.configs).length > 0 ? (
                                  Object.entries(item.configs).map(([key, value]) => (
                                    <div key={key}>
                                      <strong>{key}: </strong>{value}
                                    </div>
                                  ))
                                ) : (
                                  t("no_config")
                                )}
                              </h3>

                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {t("duration_period", { count: item.plan?.period_months || 1 })}
                              </p>

                              {editState.isEditing && (
                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("domain_name")}
                                  </label>
                                  <div className="flex">
                                    <input
                                      type="text"
                                      value={editState.domain}
                                      onChange={(e) => handleDomainChange(item.id, e.target.value)}
                                      className="flex-grow rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                      placeholder={t("enter_domain")}
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 text-sm">
                                      .uz
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {item.plan?.discounted_monthly_price
                                  ? `${item.plan.discounted_monthly_price} ${t("currency_code")}`
                                  : t("free")}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                            </div>
                          </div>

                          <div className="mt-4 flex space-x-3">
                            {!editState.isEditing ? (
                              <>
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  {t("edit")}
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  {t("remove")}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleSaveChanges(item)}
                                  className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {t("save_changes")}
                                </button>
                                <button
                                  onClick={() => setEditingItems((prev) => ({
                                    ...prev,
                                    [item.id]: { ...prev[item.id], isEditing: false },
                                  }))}
                                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  {t("cancel")}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {nextUrl && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleLoadMore}
                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("loading")}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t("load_more")}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-[#111C44] rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("order_summary")}</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("subtotal")}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {totalPrice > 0 ? `${totalPrice} ${t("currency_code")}` : t("free")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t("shipping")}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{t("free")}</span>
                  </div>

                  {totalPrice > 0 && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">{t("estimated_tax")}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {totalPrice * 0.15} {t("currency_code")}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{t("total")}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {totalPrice > 0 ? `${totalPrice * 1.15} ${t("currency_code")}` : t("free")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("including_tax")}</p>
                  </div>
                </div>

                {totalPrice > 0 && (
                  <>
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t("payment_method")}</h3>
                      <div className="space-y-2">
                        {["click", "payme", "bank_card"].map((method) => (
                          <div key={method} className="flex items-center">
                            <input
                              id={`payment-${method}`}
                              name="payment"
                              type="radio"
                              value={method}
                              checked={selectedPaymentMethod === method}
                              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <label htmlFor={`payment-${method}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t(`pay_by_${method}`)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      disabled={loading}
                      className="mt-6 w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("processing")}
                        </div>
                      ) : (
                        t("proceed_to_checkout")
                      )}
                    </button>
                  </>
                )}

                <div className="mt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t("secure_checkout")}
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="mt-6 bg-white dark:bg-[#111C44] rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("have_coupon_code")}</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder={t("enter_coupon_code")}
                    className="flex-grow rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {t("apply")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Cart;
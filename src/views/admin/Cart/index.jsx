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
  const [editingItems, setEditingItems] = useState({}); // { [id]: { isEditing: bool, domain: "" } }
  const apiUrl = process.env.REACT_APP_API_URL;

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

      const response = await fetch(`${apiUrl}shopping-cart-item/auth-user-cart-items/list/`, {
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

      const langPrefix = localStorage.getItem("i18n_language") || "uz";
      const apiUrl = `${apiUrl}${langPrefix}/user-side-services/active-colocation-addons/?limit=10&offset=0`;

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
      const apiUrl = `${apiUrl}${langPrefix}/user-side-services/operating-systems/?limit=10&offset=0`;

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
          `${apiUrl}shopping-cart/auth-user-cart/`,
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
            `${apiUrl}shopping-cart/auth-user-cart/create/`,
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
        `${apiUrl}shopping-cart-item/auth-user-cart-item/${itemId}/delete/`,
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
        `${apiUrl}shopping-cart-item/auth-user-cart-item/${itemId}/update/`,
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
        `${apiUrl}shopping-cart/auth-user-cart/confirm/`,
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
    <div className="min-h-screen p-6 dark:bg-[#0B1538]">
      <div className="mx-auto max-w-6xl p-1">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("cart")}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {t("your_shopping_cart")} ({cartItems.length} {t("items")})
        </p>

        <div className="rounded-lg border border-gray-100 bg-white shadow dark:bg-[#111C44]">
          <div className="flex justify-between items-center px-4 py-3">
            <h2 className="text-xl font-normal text-gray-800 dark:text-white">{t("cart")}</h2>
            <button
              onClick={handleBack}
              className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white transition hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
            >
              {t("go_back")}
            </button>
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="overflow-x-auto rounded p-4 pt-2">
            <table className="min-w-full border border-gray-300 text-sm dark:border-gray-700 dark:bg-[#0B1538]">
              <thead className="text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="border p-3 text-left dark:border-gray-700">{t("product")}</th>
                  <th className="border p-3 text-center dark:border-gray-700">{t("price")}</th>
                  <th className="border p-3 text-right dark:border-gray-700">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 dark:text-gray-200">
                {cartItems.map((item) => {
                  const editState = editingItems[item.id] || { isEditing: false, domain: item.configs?.domain || "" };

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border p-3 align-top dark:border-gray-700">
                        <div className="mb-1 font-medium">
                          
                          <strong>{editState.domain || t("no_domain")}</strong>
                        </div>


                        {item.plan?.type === "vps" && item.configs?.os && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">OS: {item.configs.os}</div>
                        )}

                        {item.plan?.type === "colocation" && item.configs?.addon && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Addon: {item.configs.addon}
                          </div>
                        )}

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t("duration_period", { count: item.plan?.period_months || 1 })}
                        </div>

                        {editState.isEditing && (
                          <input
                            type="text"
                            value={editState.domain}
                            onChange={(e) => handleDomainChange(item.id, e.target.value)}
                            className="mt-2 w-full rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
                            placeholder={t("enter_domain")}
                          />
                        )}
                      </td>

                      <td className="border p-3 text-center align-middle dark:border-gray-700">
                        {item.plan?.discounted_monthly_price
                          ? `${item.plan.discounted_monthly_price} ${t("currency_code")}/oy`
                          : t("free")}
                      </td>

                      <td className="border p-3 text-right align-middle space-x-2 dark:border-gray-700">
                        {!editState.isEditing ? (
                          <>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-orange-500 hover:text-orange-600"
                              title={t("remove_item")}
                            >
                              ✖
                            </button>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="text-blue-500 hover:text-blue-600"
                              title={t("update_item")}
                            >
                              ✎
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveChanges(item)}
                              className="text-green-500 hover:text-green-600"
                              title={t("save_changes")}
                            >
                              ✔
                            </button>
                            <button
                              onClick={() =>
                                setEditingItems((prev) => ({
                                  ...prev,
                                  [item.id]: { ...prev[item.id], isEditing: false },
                                }))
                              }
                              className="text-red-500 hover:text-gray-600"
                              title={t("cancel_edit")}
                            >
                              ✗
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {nextUrl && (
              <button
                onClick={handleLoadMore}
                className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {t("load_more")}
              </button>
            )}
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="px-4 py-4 space-y-4">
            <div className="flex justify-between">
              <span>{t("have_coupon_code")}</span>
              <span className="cursor-pointer text-orange-500 hover:underline">{t("apply_coupon")}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <p>{t("total")}</p>
              <p>{totalPrice > 0 ? totalPrice : t("free")}</p>
            </div>

            {totalPrice > 0 && (
              <>
                <div>
                  <p className="mb-2 font-semibold">{t("payment_options")}</p>
                  <div className="space-y-2">
                    {["click", "payme", "bank_card"].map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={selectedPaymentMethod === method}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="mr-2"
                        />
                        {t(`pay_by_${method}`)}
                      </label>
                    ))}
                  </div>
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
      </div>
    </div>

  );
};

export default Cart;
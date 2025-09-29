import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [serviceDetails, setServiceDetails] = useState({});
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate()



  // Buyurtmalar ro‘yxatini olish
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}orders/auth-user-orders/list/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.results || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
      }
    };
    fetchOrders();
  }, [token]);

  // Cancel qilish
  const cancelOrder = async (serviceId) => {
    try {
      await axios.post(
        `${API_BASE}order-services/auth-user-order-service/${serviceId}/cancel/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Buyurtma bekor qilindi ✅");

      // Statusni yangilash
      setServiceDetails((prev) => ({
        ...prev,
        [serviceId]: {
          ...prev[serviceId],
          status: "canceled",
        },
      }));
    } catch (err) {
      console.error("Cancel qilishda xatolik:", err);
      alert("Bekor qilishda muammo ❌");
    }
  };

  // Order ichidagi itemlarni olish
  const toggleExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    if (!orderDetails[orderId]) {
      try {
        const res = await axios.get(
          `${API_BASE}orders/auth-user-order/with-order-services/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: res.data,
        }));

        // order_services ichidagi har bir id bo‘yicha detallarni olish
        res.data.order_services.forEach(async (service) => {
          try {
            const detailRes = await axios.get(
              `${API_BASE}order-services/auth-user-order-service/${service.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setServiceDetails((prev) => ({
              ...prev,
              [service.id]: detailRes.data,
            }));
          } catch (err) {
            console.error("Service detail fetch error:", err);
          }
        });
      } catch (err) {
        console.error("Order detail fetch error:", err);
      }
    }

    setExpandedOrder(orderId);
  };
  // Narxlarni formatlash helper
  const formatPrice = (amount) => {
    if (!amount) return "0 so‘m";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mening Buyurtmalarim
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Barcha qilgan buyurtmalaringizni ko‘ring va ichini tekshiring
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Buyurtmalar Ro‘yxati
              </h2>
              <button
                onClick={() => navigate(`/admin/order-services`)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md transition"
              >
                Barcha servislar
              </button>
            </div>
          </div>


          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Buyurtmalar topilmadi
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Siz hali hech qanday buyurtma qilmagansiz.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Buyurtma #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sana: {new Date(order.order_date).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                        Jami: {formatPrice(order.total_cost)}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {expandedOrder === order.id && orderDetails[order.id] && (
                    <div className="mt-4 pl-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Buyurtma tafsilotlari:
                        </h4>

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          To‘lov usuli:{" "}
                          <span className="font-semibold text-[#000]">
                            {orderDetails[order.id].payment_method}
                          </span>
                        </p>
                        {/* <p className="text-sm text-gray-600 dark:text-gray-300">
                          Izoh:{" "}
                          <span className="font-medium">
                            {orderDetails[order.id].notes}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Sabab:{" "}
                          <span className="font-medium">
                            {orderDetails[order.id].reason}
                          </span>
                        </p> */}

                        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                          {orderDetails[order.id].order_services.map((service) => (
                            <li key={service.id} className="py-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                                    {service.plan.tariff_name} | {parseFloat(service.plan.period_months)} oy
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-400">
                                    Narx: {formatPrice(service.plan.discounted_monthly_price)}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-400">
                                    Chegirma: {service.plan.discount}%
                                  </p>
                                </div>

                                {/* Status va Cancel tugma */}
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : service.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : service.status === "canceled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {service.status}
                                  </span>
                                  {service.status !== "canceled" && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm("Rostdan ham davom ettirasizmi?")) {
                                          cancelOrder(service.id)
                                        }
                                      }}
                                      className="px-4 py-1 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="font-medium text-gray-900 dark:text-white">
                            Jami:
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatPrice(orderDetails[order.id].total_cost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

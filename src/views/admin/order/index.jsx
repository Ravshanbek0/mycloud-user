import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiServer, FiGlobe, FiCpu, FiHardDrive, FiZap, FiCheck } from "react-icons/fi";

const Order = () => {
  const [services, setServices] = useState([]);
  const [colocationAddons, setColocationAddons] = useState([]);
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [tariffDetails, setTariffDetails] = useState(null);
  const [domainConfig, setDomainConfig] = useState({ domain: "", extension: "" });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOS, setSelectedOS] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const apiUrlenv = process.env.REACT_APP_API_URL;
  const [selectedAddon, setSelectedAddon] = useState(null);

  useEffect(() => {
    if (orderId) {
      const decodedOrderId = decodeURIComponent(orderId);
      setSelectedTariff(decodedOrderId);
    } else {
      setSelectedTariff(null);
      setTariffDetails(null);
      setDomainConfig({ domain: "", extension: "" });
      setSelectedPlan(null);
      setSelectedOS(null);
    }
  }, [orderId]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error(t("auth_issue"));
        }

        const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`;
        const apiUrl = `${apiUrlenv}${langPrefix}user-side-services/services-with-tariff-names/?limit=10&offset=0`;

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
        setServices(data.results || []);
      } catch (err) {
        console.error("Error fetching services:", err);
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

        const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`;
        const apiUrl = `${apiUrlenv}${langPrefix}user-side-services/active-colocation-addons/?limit=10&offset=0`;

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

        const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`;
        const apiUrl = `${apiUrlenv}${langPrefix}user-side-services/operating-systems/?limit=10&offset=0`;

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

    fetchServices();
    fetchColocationAddons();
    fetchOperatingSystems();
  }, [i18n.language, t]);

  useEffect(() => {
    const fetchTariffDetails = async () => {
      if (!selectedTariff) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error(t("auth_issue"));
        }

        const langPrefix = i18n.language === "uz" ? "" : `${i18n.language}/`;
        const apiUrl = `${apiUrlenv}${langPrefix}user-side-services/tariff-with-plans-by-tariff-name/${encodeURIComponent(selectedTariff)}/`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`${t("tariff_details_error")} (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log(data);
        
        setTariffDetails(data);
        setSelectedPlan(data.plans && data.plans.length > 0 ? data.plans[0] : null);
        if (data.name.toLowerCase().includes("host")) {
          setDomainConfig({ domain: "", extension: "" });
          setSelectedOS(null);
        } else if (data.name.toLowerCase().includes("vps")) {
          setDomainConfig(null);
          setSelectedOS(operatingSystems[0] || null);
        } else if (data.name.toLowerCase().includes("colocation")) {
          setDomainConfig(null);
          setSelectedOS(null);
        }
      } catch (err) {
        console.error("Error fetching tariff details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTariffDetails();
  }, [selectedTariff, i18n.language, t, operatingSystems]);

  const handleAddToCart = async () => {
    if (!selectedTariff || !tariffDetails || !selectedPlan?.id) {
      setError(t("missing_details"));
      return;
    }
  
    if (tariffDetails.name.toLowerCase().includes("host") && !domainConfig.domain) {
      setError(t("domain_required"));
      return;
    }
  
    if (tariffDetails.name.toLowerCase().includes("vps") && !selectedPlan) {
      setError(t("os_required"));
      return;
    }
  
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error(t("auth_issue"));
  
      const addToCartPromises = [];
  
      const basePayload = {
        plan: selectedPlan.id,
        cart: 1,
        configs: {
          plan_details: selectedPlan.discounted_monthly_price,
          tariff_name: selectedPlan.tariff_name, // 🟢 butun obyektni qo‘shamiz
          period_months: selectedPlan.period_months, // 🟢 butun obyektni qo‘shamiz
        },
      };
  
      if (tariffDetails.name.toLowerCase().includes("colocation")) {
        basePayload.configs.colocation = tariffDetails.name;
        if (selectedAddon) {
          basePayload.configs.addon = selectedAddon.name;
        }if (selectedAddon) {
          basePayload.configs.addon_id = selectedAddon.id;
        }
      } else if (tariffDetails.name.toLowerCase().includes("host")) {
        basePayload.configs.domain = `${domainConfig.domain}${domainConfig.extension || ""}`;
      } else if (tariffDetails.name.toLowerCase().includes("vps")) {
        basePayload.configs.vps = tariffDetails.name; 
        if (selectedOS) {
          basePayload.configs.vps_os = selectedOS
        }// VPS-250 kabi
      } else {
        basePayload.configs.type = tariffDetails.name;
      }
  
      addToCartPromises.push(
        fetch(`${apiUrlenv}shopping-cart-item/auth-user-cart-item/create/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(basePayload),
        })
      );
  
      const responses = await Promise.all(addToCartPromises);
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.plan?.[0] || t("cart_item_creation_error"));
        }
      }
  
      navigate("/admin/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    setSelectedTariff(null);
    setTariffDetails(null);
    setDomainConfig({ domain: "", extension: "" });
    setSelectedPlan(null);
    setSelectedOS(null);
    navigate("/admin/order");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">{t("loading_status")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("error_status")}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  if (selectedTariff && tariffDetails) {
    const properties = tariffDetails.properties
      ? tariffDetails.properties.split("\r\n").filter((prop) => prop.trim())
      : [];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            {t("go_back")}
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tariffDetails.name || t("tariff_summary")}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{tariffDetails.description || t("no_description")}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("plan_details")}</h2>

                  {tariffDetails.plans && tariffDetails.plans.length > 0 ? (
                    <div className="space-y-3">
                      {tariffDetails.plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPlan?.id === plan.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                            }`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {t("duration_period", { count: plan.period_months })}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {plan.discounted_monthly_price ? `${plan.discounted_monthly_price} ${t("currency_code")}/month` : t("free")}
                              </p>
                            </div>
                            {selectedPlan?.id === plan.id && (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <FiCheck className="text-white text-sm" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">{t("no_plans_found")}</p>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("configuration")}</h2>

                  {tariffDetails.name.toLowerCase().includes("host") && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("domain_configuration")}
                      </label>
                      <div className="flex">
                        {/* Domain nomi */}
                        <input
                          type="text"
                          value={domainConfig.domain}
                          onChange={(e) =>
                            setDomainConfig({ ...domainConfig, domain: e.target.value })
                          }
                          placeholder={t("enter_domain_name")}
                          className="flex-1 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {/* Extension */}
                        <input
                          type="text"
                          value={domainConfig.extension}
                          onChange={(e) =>
                            setDomainConfig({ ...domainConfig, extension: e.target.value })
                          }
                          placeholder=".com"
                          className="w-28 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}


                  {tariffDetails.name.toLowerCase().includes("vps") && operatingSystems.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("operating_system")}
                      </label>
                      <select
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedOS ? selectedOS.id : ""}
                        onChange={(e) => {
                          const os = operatingSystems.find((os) => os.id === parseInt(e.target.value));
                          setSelectedOS(os);
                        }}
                      >
                        <option value="" disabled>{t("select_os")}</option>
                        {operatingSystems.map((os) => (
                          <option key={os.id} value={os.id}>
                            {os.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {tariffDetails.name.toLowerCase().includes("colocation") && colocationAddons.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("colocation_addons")}
                      </label>
                      <select
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedAddon ? selectedAddon.id : ""}
                        onChange={(e) => {
                          const addon = colocationAddons.find(a => a.id === parseInt(e.target.value));
                          setSelectedAddon(addon);
                          
                        }}
                      >
                        <option value="" disabled>{t("select_addon")}</option>
                        {colocationAddons.map((addon) => (
                          <option key={addon.id} value={addon.id}>
                            {addon.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {properties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("features")}</h3>
                      <ul className="space-y-2">
                        {properties.map((prop, index) => (
                          <li key={index} className="flex items-center">
                            <FiCheck className="text-green-500 mr-2" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{prop}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("processing")}
                    </>
                  ) : (
                    t("add_to_cart")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("service_offerings")}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("choose_from_our_wide_range_of_services")}
          </p>
        </div>

        {services.length > 0 ? (
          <div className="space-y-12">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{service.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(service.tariffs) && service.tariffs.length > 0 ? (
                      service.tariffs.map((tariff) => (
                        <div
                          key={tariff.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800"
                          onClick={() => navigate(`/admin/order/${encodeURIComponent(tariff.name)}`)}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tariff.name}</h3>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                              {tariff.rating || 8}/10
                            </span>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tariff.description}</p>

                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors">
                            {t("select_plan")}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">{t("no_tariffs_found")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FiServer className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t("no_services_found")}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t("try_again_later")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
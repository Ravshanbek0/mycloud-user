import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

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
        console.log(data.results);
        
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
    if (!selectedTariff || !tariffDetails || !selectedPlan || !selectedPlan.id) {
      setError(t("missing_details"));
      return;
    }

    if (tariffDetails.name.toLowerCase().includes("host") && !domainConfig.domain) {
      setError(t("domain_required"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error(t("auth_issue"));
      }

      // Colocation uchun barcha addonlarni qo‘shish
      const addToCartPromises = [];
      if (tariffDetails.name.toLowerCase().includes("colocation") && colocationAddons.length > 0) {
        colocationAddons.forEach((addon) => {
          const payload = {
            plan: selectedPlan.id,
            configs: { addon: addon.name },
          };
          
          addToCartPromises.push(
            fetch(`${apiUrlenv}shopping-cart-item/auth-user-cart-item/create/`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            })
          );
        });
      } else {
        const payload = {
          plan: selectedPlan.id,
          cart: 1,
        };
        if (tariffDetails.name.toLowerCase().includes("host") && domainConfig) {
          payload.configs = { domain: `${domainConfig.domain}${domainConfig.extension || ""}` };
        } else if (tariffDetails.name.toLowerCase().includes("vps") && selectedOS) {
          payload.configs = { os: selectedOS.name };
        }

        addToCartPromises.push(
          fetch(`${apiUrlenv}shopping-cart-item/auth-user-cart-item/create/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        );
      }

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

  if (selectedTariff && tariffDetails) {
    const properties = tariffDetails.properties
      ? tariffDetails.properties.split("\r\n").filter((prop) => prop.trim())
      : [];

    return (
      <div className="container mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <button
          onClick={handleBack}
          className="mb-6 bg-gray-500 dark:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-800 transition duration-300"
        >
          {t("go_back")}
        </button>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{tariffDetails.name || t("tariff_summary")}</h1>
          <p className="text-sm mb-2"><strong>{t("title")}:</strong> {tariffDetails.title || t("no_title")}</p>
          <p className="text-sm mb-2"><strong>{t("description")}:</strong> {tariffDetails.description || t("no_description")}</p>
          <p className="text-sm mb-2"><strong>{t("info")}:</strong> {tariffDetails.info || t("no_info")}</p>
          <div className="space-y-2">
            {properties.length > 0 ? (
              properties.map((prop, index) => <p key={index} className="text-sm">{prop}</p>)
            ) : (
              <p className="text-sm text-gray-500">{t("no_properties")}</p>
            )}
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">{t("plan_choices")}</h2>
            {tariffDetails.plans && tariffDetails.plans.length > 0 ? (
              <select
                className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                onChange={(e) => {
                  const selectedPlan = tariffDetails.plans.find((plan) => plan.id === parseInt(e.target.value));
                  setSelectedPlan(selectedPlan);
                }}
                value={selectedPlan ? selectedPlan.id : ""}
              >
                <option value="" disabled>{t("select_plan")}</option>
                {tariffDetails.plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {t("duration_period", { count: plan.period_months })} - {plan.discounted_monthly_price || t("free")} {t("currency_code")}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{t("no_plans_found")}</p>
            )}
          </div>
          {tariffDetails.name.toLowerCase().includes("host") && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{t("domain_configuration")}</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  value={domainConfig.domain}
                  onChange={(e) => setDomainConfig({ ...domainConfig, domain: e.target.value })}
                  placeholder={t("enter_domain_name")}
                  className="w-full p-2 mb-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                />
                <input
                  type="text"
                  value={domainConfig.extension}
                  onChange={(e) => setDomainConfig({ ...domainConfig, extension: e.target.value })}
                  placeholder={t("enter_extension")}
                  className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}
          {tariffDetails.name.toLowerCase().includes("vps") && operatingSystems.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{t("operating_system")}</h2>
              <select
                className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
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
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{t("colocation_addons")}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("all_addons_will_be_added")}
              </p>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? t("processing") : t("add_to_cart")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">{t("service_offerings")}</h1>
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">{service.name}</h2>
            <p className="text-sm mb-2"><strong> {service.title || t("no_title")}</strong></p>
            <p className="text-sm mb-2"><strong>{service.description || t("no_description")}</strong> </p>
            <p className="text-sm mb-2"><strong>{service.info || t("no_info")}</strong> </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.isArray(service.tariffs) && service.tariffs.length > 0 ? (
                service.tariffs.map((tariff) => (
                  <div
                    key={tariff.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 relative overflow-hidden"
                  >
                    <span className="absolute top-3 right-3 bg-yellow-500 dark:bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {tariff.rating || 8}
                    </span>
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 uppercase tracking-wide">{t("tariff")}</p>
                      <h3 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">{tariff.name}</h3>
                      <button
                        onClick={() => navigate(`/admin/order/${encodeURIComponent(tariff.name)}`)}
                        className="w-full bg-blue-600 dark:bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition duration-300"
                      >
                        {t("select_plan")}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">{t("no_tariffs_found")}</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">{t("no_services_found")}</p>
      )}
    </div>
  );
};

export default Order;
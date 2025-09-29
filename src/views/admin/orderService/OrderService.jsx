import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiClock, FiCheck, FiX, FiAlertCircle, FiCreditCard, FiEye } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const OrderService = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const api_url = process.env.REACT_APP_API_URL
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("access_token")
            try {
                setLoading(true);
                const response = await fetch(`${api_url}order-services/auth-user-order-service/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setOrders(data.results)
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
            setLoading(false);

        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <FiCheck className="h-4 w-4" />;
            case 'pending': return <FiClock className="h-4 w-4" />;
            case 'suspended': return <FiX className="h-4 w-4" />;
            case 'expired': return <FiAlertCircle className="h-4 w-4" />;
            default: return <FiAlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return t('active');
            case 'pending': return t('pending');
            case 'suspended': return t('suspended');
            case 'expired': return t('expired');
            default: return status;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = order.plan.tariff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_order_number.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const toggleOrderSelection = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(order => order.id));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-300">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p>{t('error_loading_orders')}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {t('retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('my_orders')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t('manage_and_track_your_orders')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('total_orders')}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                <FiShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('active_orders')}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {orders.filter(o => o.status === 'active').length}
                                </p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('pending_orders')}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {orders.filter(o => o.status === 'pending').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                                <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('other_orders')}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {orders.filter(o => !['active', 'pending'].includes(o.status)).length}
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                <FiAlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiEye className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={t('search_orders')}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">{t('all_statuses')}</option>
                                <option value="active">{t('active')}</option>
                                <option value="pending">{t('pending')}</option>
                                <option value="suspended">{t('suspended')}</option>
                                <option value="expired">{t('expired')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('orders_list')}</h2>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('no_orders_found')}</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                {searchTerm ? t('no_orders_match_search') : t('you_have_no_orders')}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className={`checkbox-round mr-4 ${selectedOrders.includes(order.id) ? 'bg-blue-600 border-blue-600' : ''}`}
                                                onClick={() => toggleOrderSelection(order.id)}
                                            >
                                                {selectedOrders.includes(order.id) && (
                                                    <FiCheck className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {order.plan.tariff_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    #{order.user_order_number} • {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {getStatusText(order.status)}
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatPrice(order.plan.discounted_monthly_price)}
                                                <span className="text-sm text-gray-500 dark:text-gray-400">/mo</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pl-9 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">{t('period')}:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {order.plan.period_months} {t('months')}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">{t('original_price')}:</span>
                                            <span className="ml-2 text-gray-900 dark:text-white">
                                                {formatPrice(order.plan.discounted_monthly_price / (1 - order.plan.discount / 100))}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">{t('discount')}:</span>
                                            <span className="ml-2 text-green-600 dark:text-green-400">
                                                {order.plan.discount > 0 ? `${order.plan.discount}%` : t('none')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pl-9 flex justify-end gap-3">
                                        <button onClick={(()=>{navigate(`/admin/order-services/${order.id}`)})} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                            {t('view_details')}
                                        </button>
                                        {order.status === 'pending' && (
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                                <FiCreditCard className="inline mr-1 h-4 w-4" />
                                                {t('pay_now')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Orders Actions */}
                {selectedOrders.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center">
                                <div
                                    className={`checkbox-round mr-3 ${selectedOrders.length === filteredOrders.length ? 'bg-blue-600 border-blue-600' : ''}`}
                                    onClick={toggleSelectAll}
                                >
                                    {selectedOrders.length === filteredOrders.length && (
                                        <FiCheck className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">
                                    {selectedOrders.length} {t('orders_selected')}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    {t('export_selected')}
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <FiCreditCard className="inline mr-1 h-4 w-4" />
                                    {t('pay_selected')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .checkbox-round {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #cbd5e0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .checkbox-round:hover {
          border-color: #3b82f6;
        }
        .dark .checkbox-round {
          border-color: #4b5563;
        }
      `}</style>
        </div>
    );
};

export default OrderService;
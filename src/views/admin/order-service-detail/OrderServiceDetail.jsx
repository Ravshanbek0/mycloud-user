import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    CalendarIcon,
    CurrencyDollarIcon,
    CogIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    ClockIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const OrderServiceDetail = () => {
    const { t } = useTranslation();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { serviceId } = useParams();

    useEffect(() => {
        const fetchServiceData = async () => {
            const token = localStorage.getItem("access_token");
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api-test.mycloud.uz/order-services/auth-user-order-service/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }
                );

                if (!response.ok) {
                    throw new Error(t('error_msg'));  // translate error message
                }

                const data = await response.json();
                setService(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [serviceId, t]);  // t qo'shildi dependencies ga

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return t('not_set');  // "Not set" tarjimasi uchun kalit qo'sh
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal'
        }).format(amount) + " SO'M";
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'pending': return 'bg-amber-500';
            case 'suspended': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getServiceTypeIcon = () => {
        if (service.hosting_config) return '🌐';
        if (service.vps_config) return '🖥️';
        if (service.vds_config) return '💽';
        if (service.colocation_config) return '🏢';
        return '❓';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                        <ShieldCheckIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{t('error_title')}</h3>
                    <p className="text-gray-600 text-center">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t('retry')}
                    </button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
                        <InformationCircleIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{t('service_not_found_title')}</h3>
                    <p className="text-gray-600 text-center">{t('error_msg')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {t('service_details')}
                            </h1>
                            <div className="flex items-center mt-2 space-x-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {t('order_number', { number: service.user_order_number })}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(service.status)}`}>
                                    {t(`status.${service.status}`)}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                {t('manage_service')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service Overview Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{getServiceTypeIcon()}</span>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">{t('overview_title')}</h2>
                                        <p className="text-blue-100 text-sm mt-1">
                                            {service.hosting_config ? t('overview_type.hosting') :
                                                service.vps_config ? t('overview_type.vps') :
                                                    service.vds_config ? t('overview_type.vds') :
                                                        service.colocation_config ? t('overview_type.colocation') : t('overview_type.unknown')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600">
                                                    <CogIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">{t('service_id')}</h3>
                                                <p className="text-lg font-semibold text-gray-900">{service.id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-100 text-green-600">
                                                    <CurrencyDollarIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">{t('total_cost')}</h3>
                                                <p className="text-lg font-semibold text-gray-900">{formatCurrency(parseFloat(service.total_cost))}</p>
                                            </div>
                                        </div>

                                        {service.hosting_config && (
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-100 text-purple-600">
                                                        <span className="text-lg font-bold">.com</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-sm font-medium text-gray-500">{t('domain')}</h3>
                                                    <p className="text-lg font-semibold text-gray-900">{service.hosting_config.domain}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-amber-100 text-amber-600">
                                                    <DocumentTextIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">{t('invoice_option')}</h3>
                                                <p className="text-lg font-semibold text-gray-900 capitalize">{service.invoice_option}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                                                    <CalendarIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">{t('activation_date')}</h3>
                                                <p className="text-lg font-semibold text-gray-900">{formatDate(service.activation_date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-red-100 text-red-600">
                                                    <ClockIcon className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">{t('renewal_date')}</h3>
                                                <p className="text-lg font-semibold text-gray-900">{formatDate(service.renewal_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('additional_info')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">{t('order_reference')}</label>
                                    <p className="text-gray-900 font-medium">#{service.order}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">{t('plan_id')}</label>
                                    <p className="text-gray-900 font-medium">{service.plan}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('actions.title')}</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                    <CogIcon className="h-5 w-5 mr-2" />
                                    {t('actions.manage')}
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                                    {t('actions.invoice')}
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                                    {t('actions.support')}
                                </button>
                            </div>

                            {/* Status Overview */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('status_panel.title')}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">{t('status_panel.current_status')}</span>
                                        <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(service.status)} text-white`}>
                                            {t(`status.${service.status}`)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">{t('status_panel.service_type')}</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {service.hosting_config ? t('overview_type.hosting') :
                                                service.vps_config ? t('overview_type.vps') :
                                                    service.vds_config ? t('overview_type.vds') :
                                                        service.colocation_config ? t('overview_type.colocation') : t('overview_type.unknown')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">{t('status_panel.billing_cycle')}</span>
                                        <span className="text-sm font-medium text-gray-900">{t('monthly')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderServiceDetail;

import { useState } from 'react';
import { FaRegClock, FaShoppingCart, FaFileInvoice } from 'react-icons/fa';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';

const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState('unpaid');
  
  // Sample invoice data
  const invoices = {
    unpaid: [
      {
        id: 'INV-2023-002',
        title: 'Domain Renewal - example.com',
        invoiceDate: '2023-10-20',
        dueDate: '2023-11-20',
        total: 14.99,
        status: 'unpaid',
        items: [
          { name: 'Domain Renewal - example.com', price: 14.99 }
        ]
      }
    ],
    paid: [
      
    ]
  };

  const renderInvoiceCard = (invoice) => {
    return (
      <div key={invoice.id} className="bg-white dark:bg-[#1A2B5F] rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{invoice.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Invoice ID: {invoice.id}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium mt-3 sm:mt-0 ${
            invoice.status === 'paid' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
          </div>
        </div>

        {/* Invoice Items - Styled like a shopping cart */}
        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Items</h4>
          <div className="space-y-3">
            {invoice.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <FaShoppingCart className="text-blue-600 dark:text-blue-400" size={14} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Dates and Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Date</p>
            <p className="text-gray-900 dark:text-white">{invoice.invoiceDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {invoice.status === 'paid' ? 'Paid Date' : 'Due Date'}
            </p>
            <p className="text-gray-900 dark:text-white">
              {invoice.status === 'paid' ? invoice.paidDate : invoice.dueDate}
            </p>
          </div>
        </div>

        {/* Total and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${invoice.total.toFixed(2)}</p>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
              View Details
            </button>
            {invoice.status === 'unpaid' && (
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium">
                Pay Now
              </button>
            )}
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md transition-colors text-sm font-medium">
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1538] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaFileInvoice className="mr-3 text-blue-600" />
              My Invoices
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              All of your invoices can be found here. Filter by status using the tabs below.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-[#111C44] rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('unpaid')}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'unpaid'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FaRegClock className="mr-2" />
                Unpaid Invoices
                <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {invoices.unpaid.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'paid'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <IoCheckmarkDoneCircleOutline className="mr-2" />
                Paid Invoices
                <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {invoices.paid.length}
                </span>
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {invoices.unpaid.length + invoices.paid.length}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">Total Unpaid</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  ${invoices.unpaid.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">Total Paid</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ${invoices.paid.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Invoices List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {activeTab === 'unpaid' ? 'Unpaid Invoices' : 'Paid Invoices'}
              </h2>
              
              {invoices[activeTab].length > 0 ? (
                <div>
                  {invoices[activeTab].map(renderInvoiceCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <FaFileInvoice className="text-gray-400 dark:text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No {activeTab} invoices
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    You don't have any {activeTab} invoices at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
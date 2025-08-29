import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600 mt-2">Sahifa topilmadi.</p>
      <a
        href="/"
        className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Bosh sahifaga qaytish
      </a>
    </div>
  </div>
  )
}

export default NotFoundPage
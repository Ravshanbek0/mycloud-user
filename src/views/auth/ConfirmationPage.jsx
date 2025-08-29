import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirmation_token = searchParams.get('confirmation_token');
  const [message, setMessage] = useState('Tasdiqlash jarayoni tekshirilmoqda...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/confirm?token=${confirmation_token}`);
        const data = await response.json();
        if (data.success) {
          navigate('/auth/success');
        } else {
          navigate('/auth/confirm');
        }
      } catch (error) {
        navigate('/auth/confirm');
      }
    };

    if (confirmation_token) {
      verifyEmail();
    } else {
      navigate('/auth/confirm');
    }
  }, [confirmation_token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email tasdiqlash</h1>
        <p className="text-gray-700 mb-4">{message}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
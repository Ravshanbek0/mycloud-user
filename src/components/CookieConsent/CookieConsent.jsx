import { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('cookie-consent') !== '1') {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem('cookie-consent', '1');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-4 md:mb-0">
          Bizning veb-saytimiz sayt ishlashi, samaradorligi va qulayligini yaxshilash uchun cookie-fayllardan foydalanadi. my.mycloud.uz veb-saytidan foydalanishni davom ettirish orqali siz cookie-fayllardan foydalanishga rozilik bildirasiz.
        </p>
        <button
          onClick={handleConsent}
          className="btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M10 10l4 4m0 -4l-4 4" />
          </svg>
          Yopish
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
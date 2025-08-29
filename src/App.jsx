import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import routes from "./routes";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uid || !token) {
        setError("Invalid confirmation link: Missing UID or token");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://api-test.mycloud.uz/users/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid, token }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Email verification failed");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token]);

  const resendVerificationEmail = async () => {
    if (!email) {
      setError("Email address is missing");
      return;
    }

    try {
      const response = await fetch(
        "https://api-test.mycloud.uz/users/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to resend verification email");
      }

      setResendSuccess("New verification email sent!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setResendSuccess(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md text-center">
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={resendVerificationEmail}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Resend verification email
          </button>
          {resendSuccess && (
            <p className="text-green-600 mt-4">{resendSuccess}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            ✓
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Great! Now confirm your email address.
        </h1>
        <p className="text-gray-600 mb-4">
          We've sent an email to {email || "your email"}. Click the button inside
          to confirm your email.
        </p>
        <button
          onClick={resendVerificationEmail}
          className="inline-block bg-gray-200 text-blue-600 px-4 py-2 rounded hover:bg-gray-300"
        >
          Click here if you didn't get the email...
        </button>
        {resendSuccess && (
          <p className="text-green-600 mt-4">{resendSuccess}</p>
        )}
      </div>
    </div>
  );
};

const ErrorPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-900">
    <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 text-center text-white shadow-lg">
      <h1 className="mb-4 text-3xl font-bold">An error has occurred.</h1>
      <p className="mb-4 text-gray-400">Invalid email confirmation link</p>
      <div className="mb-4 flex justify-center space-x-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Show original message
        </button>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          View the FOSSBilling documentation
        </button>
      </div>
      <p className="text-sm text-gray-500">Powered by FOSSBilling</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      <Route path="auth/*" element={<AuthLayout />}>
        {routes
          .filter((route) => route.layout === "/auth")
          .map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
      </Route>
      <Route
        path="admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {routes
          .filter((route) => route.layout === "/admin")
          .map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
      </Route>
      <Route
        path="rtl/*"
        element={
          <ProtectedRoute>
            <RtlLayout />
          </ProtectedRoute>
        }
      >
        {routes
          .filter((route) => route.layout === "/rtl")
          .map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
      </Route>
      <Route path="/auth/confirm-email" element={<ConfirmationPage />} />
      <Route path="/auth/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default App;
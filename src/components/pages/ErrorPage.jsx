import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-surface-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Authentication Error</h1>
        <p className="text-surface-700 dark:text-surface-300 mb-6">{errorMessage}</p>
        <Link to="/login">
          <Button variant="primary" size="lg" className="w-full">
            Return to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import PinInput from '../components/ui/PinInput';
import { useAuth } from '../contexts/AuthContext';
import { HardHat } from 'lucide-react';

const PinLogin: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithPin, pinAttempts, setPinAttempts } = useAuth();
  const navigate = useNavigate();

  // Check if max attempts reached
  useEffect(() => {
    if (pinAttempts >= 3) {
      navigate('/login');
    }
  }, [pinAttempts, navigate]);

  const handlePinComplete = async (pin: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await loginWithPin(pin);
      if (success) {
        navigate('/dashboard');
      } else {
        const attemptsLeft = 2 - pinAttempts;
        setError(`Incorrect PIN. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} left.`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <HardHat size={48} className="text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Quick Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your 6-digit PIN
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <PinInput
                onComplete={handlePinComplete}
                error={error}
              />
            </div>

            <div className="flex items-center justify-between">
              <Link 
                to="/login" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign in with password
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinLogin;
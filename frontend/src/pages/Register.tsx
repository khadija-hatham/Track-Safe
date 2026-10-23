import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { HardHat } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [factoryName, setFactoryName] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) newErrors.name = 'Name is required';
    if (!factoryName) newErrors.factoryName = 'Factory name is required';
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 16) {
      newErrors.password = 'Password must be at least 16 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers';
    }
    
    if (!pin) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length !== 6) {
      newErrors.pin = 'PIN must be 6 digits';
    } else if (!/^\d+$/.test(pin)) {
      newErrors.pin = 'PIN must contain only numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await register(name, factoryName, password, pin);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <HardHat size={48} className="text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Register to use Track Safe system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                id="name"
                label="Your Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                fullWidth
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Input
                id="factoryName"
                label="Factory Name"
                type="text"
                value={factoryName}
                onChange={(e) => setFactoryName(e.target.value)}
                error={errors.factoryName}
                fullWidth
                placeholder="Enter your factory name"
              />
            </div>

            <div>
              <Input
                id="password"
                label="Strong Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                fullWidth
                placeholder="Minimum 16 characters with uppercase, lowercase, and numbers"
              />
            </div>

            <div>
              <Input
                id="pin"
                label="6-Digit PIN"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                error={errors.pin}
                fullWidth
                placeholder="For quick logins (6 digits)"
              />
            </div>

            {errors.form && (
              <div className="text-danger-600 text-sm">{errors.form}</div>
            )}

            <div>
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
              >
                Register
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm">
              <Link 
                to="/login" 
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
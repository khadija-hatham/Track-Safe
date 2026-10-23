import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  factoryName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPin: (pin: string) => Promise<boolean>;
  register: (name: string, factoryName: string, password: string, pin: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
  pinAttempts: number;
  setPinAttempts: (attempts: number) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('trackSafeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (name: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    try {
      // For demo, check if user exists in localStorage
      const storedUserData = localStorage.getItem('trackSafeUserData');
      
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (userData.name === name && userData.password === password) {
          // Mock successful login
          const user = {
            id: '1',
            name: userData.name,
            factoryName: userData.factoryName,
          };
          
          localStorage.setItem('trackSafeUser', JSON.stringify(user));
          setUser(user);
          setIsAuthenticated(true);
          // Reset PIN attempts
          setPinAttempts(0);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const loginWithPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const storedUserData = localStorage.getItem('trackSafeUserData');
      
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if (userData.pin === pin) {
          // Mock successful login
          const user = {
            id: '1',
            name: userData.name,
            factoryName: userData.factoryName,
          };
          
          localStorage.setItem('trackSafeUser', JSON.stringify(user));
          setUser(user);
          setIsAuthenticated(true);
          // Reset PIN attempts
          setPinAttempts(0);
          return true;
        }
      }
      
      // Increment failed attempts
      setPinAttempts(prev => prev + 1);
      return false;
    } catch (error) {
      console.error('PIN login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (
    name: string, 
    factoryName: string, 
    password: string,
    pin: string
  ): Promise<boolean> => {
    try {
      // For demo, store in localStorage
      const userData = {
        name,
        factoryName,
        password,
        pin,
      };
      
      localStorage.setItem('trackSafeUserData', JSON.stringify(userData));
      
      // Auto login after registration
      const user = {
        id: '1',
        name,
        factoryName,
      };
      
      localStorage.setItem('trackSafeUser', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('trackSafeUser');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      loginWithPin,
      register,
      logout, 
      checkAuth,
      pinAttempts,
      setPinAttempts
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
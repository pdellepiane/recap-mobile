import { useState } from 'react';

import { authRepository } from '@/src/core/di/container';
import { User } from '@/src/domain/models';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authRepository.login(email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authRepository.signUp(name, email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    currentUser,
    login,
    signUp,
  };
};

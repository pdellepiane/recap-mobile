import { useCallback, useEffect, useState } from 'react';

import { profileRepository } from '@/src/core/di/container';
import { User } from '@/src/domain/models';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await profileRepository.getProfile();
      setProfile(me);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    reload: loadProfile,
  };
};

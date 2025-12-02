import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type AppId = 'webamp' | string;

type VolumeContextValue = {
  masterVolume: number;
  isMuted: boolean;
  setMasterVolume: (v: number) => void;
  setMuted: (m: boolean) => void;

  perAppVolumes: Record<AppId, number>;
  registerApp: (id: AppId, initialVolume?: number) => void;
  unregisterApp: (id: AppId) => void;
  setAppVolume: (id: AppId, v: number) => void;
};

const VolumeContext = createContext<VolumeContextValue | undefined>(undefined);

export const VolumeProvider = ({ children }: { children: ReactNode }) => {
  const [masterVolume, setMasterVolume] = useState(1);
  const [isMuted, setMuted] = useState(false);
  const [perAppVolumes, setPerAppVolumes] = useState<Record<AppId, number>>(
    {} as Record<AppId, number>
  );

  const registerApp = useCallback((id: AppId, initialVolume: number = 1) => {
    setPerAppVolumes((prev) => {
      if (id in prev) return prev;
      return { ...prev, [id]: initialVolume };
    });
  }, []);

  const unregisterApp = useCallback((id: AppId) => {
    setPerAppVolumes((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setAppVolume = useCallback((id: AppId, v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setPerAppVolumes((prev) => ({
      ...prev,
      [id]: clamped,
    }));
  }, []);

  const value: VolumeContextValue = {
    masterVolume,
    isMuted,
    setMasterVolume,
    setMuted,
    perAppVolumes,
    registerApp,
    unregisterApp,
    setAppVolume,
  };

  return (
    <VolumeContext.Provider value={value}>{children}</VolumeContext.Provider>
  );
};

export const useVolume = () => {
  const ctx = useContext(VolumeContext);
  if (!ctx) {
    throw new Error('useVolume must be used within VolumeProvider');
  }
  return ctx;
};

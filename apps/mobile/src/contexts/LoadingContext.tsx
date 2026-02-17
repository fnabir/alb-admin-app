import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface LoadingContextType {
  isLoading: boolean;
  isFullScreen: boolean;
  setLoading: (loading: boolean, fullScreen?: boolean) => void;
  startLoading: (fullScreen?: boolean) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const startLoading = useCallback((fullScreen: boolean = false) => {
    setIsLoading(true);
    setIsFullScreen(fullScreen);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setIsFullScreen(false);
  }, []);

  const setLoading = useCallback(
    (loading: boolean, fullScreen: boolean = false) => {
      setIsLoading(loading);
      setIsFullScreen(fullScreen);
    },
    [],
  );

  return (
    <LoadingContext.Provider
      value={{ isLoading, isFullScreen, setLoading, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

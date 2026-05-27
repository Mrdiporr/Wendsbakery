import React, { createContext, useContext, useState } from "react";
import { PlatformCredentials, PlatformConnectionStatus } from "@/lib/platform/types";
import { activityLogger } from "@/lib/activityLogger";
import { useAuth } from "@/contexts/AuthContext";

interface PlatformContextValue {
  isConnected: boolean;
  isLoading: boolean;
  credentials: PlatformCredentials | null;
  connectionStatus: PlatformConnectionStatus | null;
  systemInfo: any;
  error: string | null;
  connect: (credentials: PlatformCredentials) => Promise<boolean>;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
  loadServerCredentials: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<PlatformCredentials | null>({
    name: "Laravel API backend",
    baseUrl: "http://localhost/api",
    platformType: "woocommerce",
    authMethod: "basic",
    basePath: ""
  });
  const [connectionStatus, setConnectionStatus] = useState<PlatformConnectionStatus | null>({
    connected: true,
    platformName: "Laravel API",
    platformType: "woocommerce",
    version: "1.0",
    details: {}
  });
  const [systemInfo, setSystemInfo] = useState<any>({ environment: { version: "1.0" } });
  const [error, setError] = useState<string | null>(null);

  const loadServerCredentials = async () => {
    setIsLoading(false);
  };

  const testConnection = async (): Promise<boolean> => {
    return true;
  };

  const connect = async (newCredentials: PlatformCredentials): Promise<boolean> => {
    return true;
  };

  const disconnect = async () => {
    setIsConnected(false);
  };

  return (
    <PlatformContext.Provider
      value={{
        isConnected,
        isLoading,
        credentials,
        connectionStatus,
        systemInfo,
        error,
        connect,
        disconnect,
        testConnection,
        loadServerCredentials,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = (): PlatformContextValue => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error("usePlatform must be used within a PlatformProvider");
  return context;
};

// Backward-compatible alias
export const useWooCommerce = usePlatform;

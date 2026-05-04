/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { PixConfig, OperationType } from '../types';
import { handleFirestoreError } from '../lib/firestoreErrorHandler';

interface PixConfigContextType {
  config: PixConfig | null;
  loading: boolean;
}

const PixConfigContext = createContext<PixConfigContextType | undefined>(undefined);

export function PixConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PixConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'config', 'settings'),
      (snap) => {
        if (snap.exists()) {
          setConfig(snap.data() as PixConfig);
        }
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'config/settings');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const value = React.useMemo(() => ({ config, loading }), [config, loading]);

  return <PixConfigContext.Provider value={value}>{children}</PixConfigContext.Provider>;
}

export function usePixConfig() {
  const context = useContext(PixConfigContext);
  if (context === undefined) {
    throw new Error('usePixConfig must be used within a PixConfigProvider');
  }
  return context;
}

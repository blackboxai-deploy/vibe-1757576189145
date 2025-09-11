'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppSettings } from '@/types/image';

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'es',
  defaultStyle: 'realistic',
  defaultQuality: 'high',
  autoSave: true,
  showTutorials: true,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
  }, []);

  const loadSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem('appSettings');
      if (stored) {
        const parsedSettings: AppSettings = JSON.parse(stored);
        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    }
  }, []);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  // Auto-save settings when they change
  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    loadSettings,
    saveSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
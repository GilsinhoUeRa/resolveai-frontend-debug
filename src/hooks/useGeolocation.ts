// src/hooks/useGeolocation.ts
import { useState } from 'react';

interface GeolocationState {
  loading: boolean;
  error: GeolocationPositionError | null;
  data: {
    latitude: number;
    longitude: number;
  } | null;
}

type GetLocationCallback = (location: GeolocationState['data']) => void;

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
  });

  const getLocation = (callback?: GetLocationCallback) => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: new GeolocationPositionError() }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = { latitude, longitude };

        setState({ loading: false, error: null, data: locationData });

        // Se um callback for fornecido, chame-o com os dados da localização
        if (callback) {
          callback(locationData);
        }
      },
      (error) => {
        setState({ loading: false, error, data: null });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { ...state, getLocation };
};
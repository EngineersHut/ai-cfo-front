'use client';

import { ReactNode } from 'react';

// third party
import { Provider } from 'react-redux';

import { store } from '.';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

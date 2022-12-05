import '@/styles/globals.css';
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'sweetalert2/src/sweetalert2.scss';

import type { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from 'next-themes';
import { Theme, ToastContainer } from 'react-toastify';

import getFromLocalStorage from '@/lib/getFromLocalStorage';

declare module 'next-themes' {
  interface ThemeProviderProps {
    children: React.ReactNode;
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { theme } = useTheme();

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
      <Component {...pageProps} />
      <ToastContainer
        theme={(getFromLocalStorage('theme') as Theme) ?? theme ?? 'dark'}
        key={theme}
      />
    </ThemeProvider>
  );
};

export default MyApp;

import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocalStorage } from 'react-use';

import Button from '@/components/buttons/Button';
import StyledInput from '@/components/forms/StyledInput';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { toastStyle } from '@/constant/toast';
import customAxios from '@/lib/customAxios';

const Login: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  const [, setToken] = useLocalStorage<string>('token');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      customAxios.post('/auth/login', {
        email,
        password,
      }),
      {
        loading: 'Loading...',
        success: ({ data }) => {
          setToken(data?.data?.data?.token as string);
          setTimeout(() => router.push('/'), 2000);
          return 'Logged in !';
        },
        error: (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Login failed, who are you 🤔';
        },
      }
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <Layout>
      <Seo templateTitle='Login' />
      <main>
        <section className=''>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor='email'>Email</label>
              <StyledInput
                type='email'
                name='email'
                className='mb-4 block rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
                onChange={handleEmailChange}
              />
              <label htmlFor='password'>Password</label>
              <StyledInput
                type='password'
                name='password'
                className='mb-4 block rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
                onChange={handlePasswordChange}
              />
              <div className='mt-2'>
                <Button type='submit'>Submit</Button>
              </div>
            </form>

            <p className='text-xl text-primary-200'>
              <ArrowLink href='/' openNewTab={false} direction='left'>
                Back To Home
              </ArrowLink>
            </p>
          </div>
        </section>
      </main>
      <Toaster
        toastOptions={{
          style: toastStyle,
          loading: {
            iconTheme: {
              primary: '#eb2754',
              secondary: 'black',
            },
          },
        }}
      />
    </Layout>
  );
};

export default Login;

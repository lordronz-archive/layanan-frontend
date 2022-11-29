import axios, { AxiosError } from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import StyledInput from '@/components/forms/StyledInput';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { toastStyle } from '@/constant/toast';
import customAxios from '@/lib/customAxios';

const Register: NextPage = () => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>();

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      customAxios.post('/auth/register', {
        name,
        password,
        email,
      }),
      {
        loading: 'Loading...',
        success: () => {
          setTimeout(() => router.push('/login'), 2000);
          return 'Registered!';
        },
        error: (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            return err.response?.data.message ?? err.message;
          }
          return 'Register failed, sadge!';
        },
      }
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
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
      <Seo templateTitle='Register' />
      <main>
        <section className=''>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-y-12 text-center'>
            <div>
              <h1 className='mb-4 text-4xl text-primary-300'>Register</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor='name'>Name</label>
              <StyledInput
                type='text'
                name='name'
                className='mb-4 block rounded-lg border-2 bg-gray-300 p-2 dark:bg-gray-900'
                onChange={handleNameChange}
              />
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

export default Register;

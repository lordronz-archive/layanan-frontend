import Link from 'next/link';
import { useTheme } from 'next-themes';

import ColorModeToggle from '@/components/ColorModeToggle';

const Header = (): JSX.Element => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className='bg-gray-300 dark:bg-neutral-700'>
      <ul className='flex items-center justify-between px-8 py-4'>
        <li className='z-10'>
          <ul className='flex items-center justify-between space-x-8'>
            <li>
              <Link
                href='/'
                className='font-bold transition-all duration-200 hover:text-primary-300'
              >
                Home
              </Link>
            </li>
          </ul>
        </li>
        <li className='z-10'>
          <ul className='flex items-center justify-between space-x-4'>
            <li>
              <ColorModeToggle value={theme} onChange={setTheme} />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Header;

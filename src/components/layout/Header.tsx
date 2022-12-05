import Link from 'next/link';
import { useTheme } from 'next-themes';

import ColorModeToggle from '@/components/ColorModeToggle';
import UnstyledLink from '@/components/links/UnstyledLink';

type Links = {
  href: string;
  label: string;
}[];

const links: Links = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
];

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
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`} className='hidden md:list-item'>
                <UnstyledLink
                  href={href}
                  className='transition-all duration-200 hover:text-primary-300'
                >
                  {label}
                </UnstyledLink>
              </li>
            ))}
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

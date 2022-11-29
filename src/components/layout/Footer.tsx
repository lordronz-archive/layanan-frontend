type FooterProp = {
  trueFooter?: boolean;
};

const Footer = ({ trueFooter = false }: FooterProp) => {
  return (
    <footer className='mt-4 pb-2'>
      <main className='layout flex flex-col items-center border-t pt-6 dark:border-gray-600'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          &copy; {new Date().getFullYear()} Aaron Christopher
        </p>
        {trueFooter && (
          <p className='mt-4 text-sm  text-gray-600 dark:text-gray-300'>
            Made with ❤️ by Aaron for the one and only Tia
          </p>
        )}
      </main>
    </footer>
  );
};

export default Footer;

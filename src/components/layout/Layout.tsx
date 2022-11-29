import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

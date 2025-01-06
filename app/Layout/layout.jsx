import Header from '@/app/Header/page';
import Footer from '@/app/Footer/page';

function Layout({ children }) {
  return (
    <div className="flex flex-col p-2 min-h-screen bg-gray-50">
      {/* Header Section */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="container mx-auto  px-1 sm:px-1 lg:px-1 py-1">
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-8 lg:p-2">
            {children}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Layout;

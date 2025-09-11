import React from 'react'; 

type LayoutProps = {
  children: React.ReactNode;
};


const Header = () => (
  <header className="bg-white shadow-md">
    <nav className="container mx-auto px-6 py-4">
      <div className="text-2xl font-bold text-[#1a5276]">
        Rede Cegonha
      </div>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
    <div className="container mx-auto">
      &copy; 2025 Rede Cegonha. Todos os direitos reservados.
    </div>
  </footer>
);



function Layout({ children }: LayoutProps) {
  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
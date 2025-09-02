
import Sidebar from "@/components/Sidebar";



interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Content takes full width and height */}
        <div className="flex-1 overflow-auto w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

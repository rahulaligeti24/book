import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AppShell = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-mist">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default AppShell;

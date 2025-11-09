import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Messages from './pages/Messages';
import CreateMessage from './pages/CreateMessage';
import Placeholder from './pages/Placeholder';

type Page = 'login' | 'register' | 'messages' | 'create-message' | 'stores' | 'products' | 'suppliers' | 'credits' | 'returns' | 'reports' | 'service' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLocalSession();
  }, []);

  const checkLocalSession = () => {
    const storedSession = localStorage.getItem('demo_user_session');

    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setIsAuthenticated(true);
        setUserName(session.userName || 'User');

        if (currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('messages');
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('demo_user_session');
      }
    }

    setLoading(false);
  };

  const handleLoginSuccess = () => {
    checkLocalSession();
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('demo_user_session');
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleCreateMessage = () => {
    setCurrentPage('create-message');
  };

  const handleMessageCreated = () => {
    setCurrentPage('messages');
  };

  const handleCancelCreate = () => {
    setCurrentPage('messages');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'messages':
        return <Messages onCreateMessage={handleCreateMessage} />;
      case 'create-message':
        return <CreateMessage onCancel={handleCancelCreate} onSuccess={handleMessageCreated} />;
      case 'stores':
        return <Placeholder title="Stores" />;
      case 'products':
        return <Placeholder title="Products" />;
      case 'suppliers':
        return <Placeholder title="Suppliers" />;
      case 'credits':
        return <Placeholder title="Credits" />;
      case 'returns':
        return <Placeholder title="Returns" />;
      case 'reports':
        return <Placeholder title="Reports" />;
      case 'service':
        return <Placeholder title="Service Status" />;
      case 'admin':
        return <Placeholder title="Admin" />;
      default:
        return <Messages onCreateMessage={handleCreateMessage} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userName={userName}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;

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
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      (async () => {
        await checkSession();
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setIsAuthenticated(true);

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        setUserName(profile?.full_name || 'User');

        if (currentPage === 'login' || currentPage === 'register') {
          setCurrentPage('messages');
        }
      } else {
        setIsAuthenticated(false);
        setCurrentPage('login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
      setCurrentPage('login');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async () => {
    await checkSession();
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

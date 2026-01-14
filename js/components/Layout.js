const { useState, useEffect } = React;

const Layout = ({ children, currentScreen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => ({ 
    name: localStorage.getItem('userName') || 'User', 
    email: localStorage.getItem('userEmail') || '' 
  }));

  useEffect(() => {
    // Auth check
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('accessToken');

    if (!isAuthenticated || !token) {
      window.location.href = '/pages/login.html';
      return;
    }

    const updateUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/verify-token?token=${token}`);
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        const data = await response.json();
        
        localStorage.setItem('userName', data.user_name);
        localStorage.setItem('userEmail', data.user_email);
        
        setUser({
          name: data.user_name,
          email: data.user_email
        });
      } catch (err) {
        console.error('Session verification failed:', err);
        // Only redirect if it's an auth error, not a network error
        if (err.message !== 'Failed to fetch') {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('accessToken');
          window.location.href = '/pages/login.html';
        }
      }
    };

    updateUserData();
    window.addEventListener('storage', updateUserData);
    return () => window.removeEventListener('storage', updateUserData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans selection:bg-primary/30">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentScreen={currentScreen} onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300">
        <TopNav 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
          isMenuOpen={isMenuOpen}
          user={user}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

window.Layout = Layout;

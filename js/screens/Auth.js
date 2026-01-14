const { useState } = React;
const { Hexagon, Mail, Lock, User, ArrowRight } = lucideReact;

const Auth = ({ mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    if (mode === 'forgot-password') {
      try {
        const response = await fetch(`http://localhost:8000/api/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to send reset email');
        setSuccess(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (mode === 'reset-password') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      try {
        const response = await fetch(`http://localhost:8000/api/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, new_password: password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to reset password');
        setSuccess(data.message);
        setTimeout(() => window.location.href = '/pages/login.html', 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const endpoint = mode === 'register' ? '/api/register' : '/api/login';
    const payload = mode === 'register' 
      ? { email, password, name }
      : { email, password };

    try {
      console.log('Attempting to fetch:', `http://localhost:8000${endpoint}`);
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store auth data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('userEmail', data.user_email);
      localStorage.setItem('userName', data.user_name);

      window.location.href = '/pages/dashboard.html';
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message === 'Failed to fetch' 
        ? 'Cannot connect to the backend server. Please ensure main.py is running on port 8000.' 
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'login') window.location.href = '/pages/register.html';
    else window.location.href = '/pages/login.html';
  };

  const goToForgotPassword = (e) => {
    e.preventDefault();
    window.location.href = '/pages/forgot-password.html';
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'forgot-password': return 'Forgot Password';
      case 'reset-password': return 'Reset Password';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 font-display">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Hexagon className="text-primary fill-current" size={48} />
          </div>
          <h2 className="mt-6 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {getTitle()}
          </h2>
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' && (
              <>Don't have an account? <a href="/pages/register.html" className="font-bold text-primary hover:underline">Sign up</a></>
            )}
            {mode === 'register' && (
              <>Already have an account? <a href="/pages/login.html" className="font-bold text-primary hover:underline">Log in</a></>
            )}
            {(mode === 'forgot-password' || mode === 'reset-password') && (
              <a href="/pages/login.html" className="font-bold text-primary hover:underline">Back to login</a>
            )}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
            )}
            
            {mode !== 'reset-password' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="Email Address"
                />
              </div>
            )}

            {mode !== 'forgot-password' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder={mode === 'reset-password' ? "New Password" : "Password"}
                />
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="/pages/forgot-password.html" className="font-bold text-primary hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot-password' && 'Send Reset Link'}
                  {mode === 'reset-password' && 'Update Password'}
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Google
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Auth = Auth;

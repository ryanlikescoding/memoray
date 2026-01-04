const { LogOut, Eye, CheckCircle2 } = lucideReact;
const { useState } = React;

const Settings = () => {
  const [name, setName] = useState(localStorage.getItem('userName') || 'Alex Johnson');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'alex@example.com');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  const handleSaveChanges = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    alert('Changes saved successfully!');
    // Trigger a re-render or redirect if needed, but alert is fine for now
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" 
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                        <input type="password" defaultValue="password123" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                        <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} />
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-2">
                <button className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold transition">Delete Account</button>
                <button 
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
            </div>
        </div>

        {/* School Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">School Integration</h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 dark:text-green-300">Connected to University of Knowledge</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">Score tracking is active.</p>
                    </div>
                </div>
                <button className="text-sm font-medium text-primary hover:underline border border-primary px-3 py-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">Re-authenticate</button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Change School</label>
                <input type="text" placeholder="Search for your school..." className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
            </div>
        </div>

        {/* API Key */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Settings</h2>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gemini API Key</label>
                <input 
                  type="password" 
                  placeholder="Enter your Google Gemini API Key" 
                  onChange={(e) => localStorage.setItem('GEMINI_API_KEY', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" 
                />
                <p className="text-xs text-gray-500">Your key is stored locally in your browser.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

window.Settings = Settings;

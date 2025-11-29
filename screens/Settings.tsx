import React from 'react';
import { LogOut, Eye, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                    <input type="text" defaultValue="alex_johnson" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" defaultValue="alex.j@school.edu" className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white" />
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
                <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition">Save Changes</button>
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

        {/* AI Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Preferences</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                    <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200">Timetable Generation</h3>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Enable AI Timetable</span>
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Study Session Length: <span className="text-primary font-bold">60 min</span></span>
                         </div>
                         <input type="range" className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" />
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200">Revision List Creation</h3>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Enable AI Revision Lists</span>
                        <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Prioritization Strategy</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none">
                            <option>Prioritize Weaker Subjects</option>
                            <option>Balanced Approach</option>
                            <option>Exam Date Proximity</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-4">
             <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition">
                 <LogOut size={20} /> Log Out
             </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
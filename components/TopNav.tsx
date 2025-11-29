import React, { useState } from 'react';
import { Menu, X, Bell, Search } from 'lucide-react';
import { Screen } from '../types';

interface TopNavProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  user: { name: string; email: string };
  onNavigate: (screen: Screen) => void;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick, isMenuOpen, user, onNavigate }) => {
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20 md:pl-72">
        <div className="flex items-center gap-4 md:hidden">
            <button onClick={onMenuClick} className="text-gray-600 dark:text-gray-300">
                {isMenuOpen ? <X /> : <Menu />}
            </button>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Memoray</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md ml-4">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search courses, revision topics..." 
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary text-sm text-gray-900 dark:text-white placeholder-gray-500"
                />
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(Screen.SETTINGS)}>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-1">Student</p>
                </div>
                <img 
                    src="https://picsum.photos/100/100" 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" 
                />
            </div>
        </div>
    </header>
  );
};

export default TopNav;

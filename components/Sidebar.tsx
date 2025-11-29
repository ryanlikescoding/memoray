import React from 'react';
import { Screen } from '../types';
import { LayoutDashboard, Calendar, BarChart2, Settings, LogOut, Hexagon } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, onLogout }) => {
  const navItems = [
    { id: Screen.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Screen.TIMETABLE, label: 'Timetable', icon: Calendar },
    { id: Screen.PERFORMANCE, label: 'Performance', icon: BarChart2 },
    { id: Screen.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-10 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <Hexagon className="text-primary fill-current" size={28} />
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Memoray</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              currentScreen === item.id
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-medium transition-colors">
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

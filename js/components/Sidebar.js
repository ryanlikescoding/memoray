const { LayoutDashboard, Calendar, BarChart2, Settings: SettingsIcon, LogOut, Hexagon } = lucideReact;

const Sidebar = ({ currentScreen, onLogout }) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard.html' },
    { id: 'TIMETABLE', label: 'Timetable', icon: Calendar, href: '/timetable.html' },
    { id: 'PERFORMANCE', label: 'Performance', icon: BarChart2, href: '/performance.html' },
    { id: 'SETTINGS', label: 'Settings', icon: SettingsIcon, href: '/settings.html' },
  ];

  // Helper for conditional classes
  const getLinkClass = (isActive) => {
    const base = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ";
    return base + (isActive 
      ? "bg-primary/10 text-primary dark:bg-primary/20" 
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800");
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <Hexagon className="text-primary fill-current" size={28} />
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Memoray</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={getLinkClass(currentScreen === item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </a>
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

window.Sidebar = Sidebar;

import React, { useState } from 'react';
import LandingPage from './screens/LandingPage';
import Dashboard from './screens/Dashboard';
import TimetableGenerator from './screens/TimetableGenerator';
import Performance from './screens/Performance';
import Settings from './screens/Settings';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import { Screen } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen(Screen.LANDING);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
      />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white dark:bg-gray-900 shadow-xl" onClick={e => e.stopPropagation()}>
             <Sidebar 
                currentScreen={currentScreen} 
                onNavigate={handleNavigate} 
                onLogout={handleLogout} 
             />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <TopNav 
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            isMenuOpen={isMobileMenuOpen}
            user={{ name: "Alex Johnson", email: "alex.j@school.edu" }}
            onNavigate={handleNavigate}
        />
        
        <main className="flex-1 relative">
           {currentScreen === Screen.DASHBOARD && <Dashboard onNavigate={handleNavigate} />}
           {currentScreen === Screen.TIMETABLE && <TimetableGenerator />}
           {currentScreen === Screen.PERFORMANCE && <Performance />}
           {currentScreen === Screen.SETTINGS && <Settings onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
}
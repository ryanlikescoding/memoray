const { Plus, List, Zap, Clock, CheckCircle2, AlertTriangle, Lightbulb } = lucideReact;
const { useState, useEffect } = React;

const Dashboard = () => {
  const [userName, setUserName] = useState(() => {
    const stored = localStorage.getItem('userName');
    return stored ? stored.split(' ')[0] : 'User';
  });
  
  useEffect(() => {
    const updateName = () => {
      const stored = localStorage.getItem('userName');
      if (stored) {
        setUserName(stored.split(' ')[0]);
      }
    };

    updateName();
    // Also listen for storage events in case it changes in another tab
    window.addEventListener('storage', updateName);
    return () => window.removeEventListener('storage', updateName);
  }, []);

  const schedule = [
    { time: "09:00 - 10:30", subject: "Calculus II", location: "Room 301", status: "Upcoming", color: "blue" },
    { time: "11:00 - 12:30", subject: "Physics I", location: "Lab B", status: "Upcoming", color: "purple" },
    { time: "14:00 - 15:00", subject: "Study Session", location: "Library", status: "In Progress", color: "green" },
    { time: "16:00 - 17:30", subject: "History of Art", location: "Auditorium A", status: "Completed", color: "gray" },
  ];

  const recentScores = [
    { sub: "Calc", val: 85 },
    { sub: "Phys", val: 72 },
    { sub: "Art", val: 94 },
    { sub: "Chem", val: 68 },
    { sub: "Hist", val: 88 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userName}!</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's a summary of your academic progress.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <a 
            href="/pages/timetable.html"
            className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition shadow-sm flex items-center gap-2">
            <Zap size={18} />
            Generate New Timetable
        </a>
        <a 
            href="/pages/performance.html"
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
            <Plus size={18} />
            Add a New Score
        </a>
        <a 
            href="/pages/performance.html"
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
            <List size={18} />
            View Full Revision List
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Today's Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-4 font-medium">Time</th>
                  <th className="pb-4 font-medium">Subject</th>
                  <th className="pb-4 font-medium">Location</th>
                  <th className="pb-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {schedule.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                    <td className="py-4 text-gray-900 dark:text-white font-medium">{item.time}</td>
                    <td className="py-4 text-gray-900 dark:text-white font-semibold">{item.subject}</td>
                    <td className="py-4 text-gray-500 dark:text-gray-400">{item.location}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${item.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                        ${item.status === 'In Progress' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}
                        ${item.status === 'Completed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}
                      `}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-8">
            {/* Recent Scores */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Scores</h2>
                </div>
                <div className="h-48 flex items-end justify-between px-2 gap-2">
                    {recentScores.map((score, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                            <div className="relative w-full flex justify-center items-end h-32 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                                <div 
                                    className="w-full bg-primary hover:bg-blue-600 transition-all duration-500 rounded-t-lg relative"
                                    style={{ height: `${score.val}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{score.sub}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{score.val}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;

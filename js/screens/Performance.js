const { AlertTriangle, Lightbulb, CheckCircle2, TrendingUp, ChevronDown } = lucideReact;
const { useState, useEffect } = React;

const Performance = () => {
  const [activeTab, setActiveTab] = useState('Mathematics');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/performance')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.subjects)) {
          setPerformanceData(data);
        } else {
          console.error('Invalid data format received:', data);
          setPerformanceData({ subjects: [] });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching performance data:', err);
        setPerformanceData({ subjects: [] });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!performanceData || !Array.isArray(performanceData.subjects) || performanceData.subjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] flex-col gap-4">
        <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center max-w-md">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Performance Data</h2>
          <p className="text-gray-500 dark:text-gray-400">We couldn't find any performance data for your subjects. Please check your data folders.</p>
        </div>
      </div>
    );
  }

  const currentSubject = performanceData.subjects.find(s => s.name === activeTab) || performanceData.subjects[0];
  const tabs = performanceData.subjects.map(s => s.name);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance & Revision</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Overall Average</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{currentSubject.stats.average}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Highest Score</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{currentSubject.stats.highest}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Lowest Score</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{currentSubject.stats.lowest}%</p>
        </div>
      </div>

      {/* Scores Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scores Over Time</h3>
             <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <TrendingUp size={16} />
                <span>+5%</span>
                <span className="text-gray-400 font-normal ml-1">Last 30 Days</span>
             </div>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-4 px-2">
            {currentSubject.scoresOverTime.map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-500 hover:opacity-80 ${bar.score > 80 ? 'bg-primary' : 'bg-blue-200 dark:bg-blue-900/40'}`} 
                      style={{ height: `${bar.score}%` }}
                    ></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{bar.label}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Revision List */}
      <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Revision List</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                <button className="flex items-center gap-1 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-lg">
                    Priority <ChevronDown size={14} />
                </button>
            </div>
        </div>

        <div className="space-y-4">
            {currentSubject.revisionList.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-5">
                    <div className="min-w-[40px]">
                        {item.priority === 'High' && <AlertTriangle className="text-orange-500" />}
                        {item.priority === 'Medium' && <Lightbulb className="text-yellow-500" />}
                        {item.priority === 'Low' && <CheckCircle2 className="text-green-500" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.topic}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                            {item.status}
                        </span>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition">
                            Mark Revised
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

window.Performance = Performance;

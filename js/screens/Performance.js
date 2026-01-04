const { AlertTriangle, Lightbulb, CheckCircle2, TrendingUp, ChevronDown } = lucideReact;
const { useState } = React;

const Performance = () => {
  const [activeTab, setActiveTab] = useState('Mathematics');
  const tabs = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const revisionItems = [
    { id: '1', topic: 'Algebraic Equations', priority: 'High', status: 'Pending', description: 'Low scores on recent quizzes about this topic.' },
    { id: '2', topic: 'Linear Functions', priority: 'Medium', status: 'Pending', description: 'Inconsistent performance in homework assignments.' },
    { id: '3', topic: 'Polynomials', priority: 'Low', status: 'Pending', description: 'Generally good understanding but a few concepts could be reinforced.' },
  ];

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
            <p className="text-4xl font-bold text-gray-900 dark:text-white">82%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Highest Score</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">95%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">Lowest Score</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">65%</p>
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
            {[
                { label: 'Quiz 1', h: '40%', col: 'bg-blue-200 dark:bg-blue-900/40' },
                { label: 'Test 1', h: '35%', col: 'bg-blue-200 dark:bg-blue-900/40' },
                { label: 'Quiz 2', h: '45%', col: 'bg-blue-200 dark:bg-blue-900/40' },
                { label: 'Midterm', h: '75%', col: 'bg-primary' },
                { label: 'Quiz 3', h: '50%', col: 'bg-blue-200 dark:bg-blue-900/40' },
            ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                    <div className={`w-full rounded-t-md transition-all duration-500 hover:opacity-80 ${bar.col}`} style={{ height: bar.h }}></div>
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
            {revisionItems.map(item => (
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

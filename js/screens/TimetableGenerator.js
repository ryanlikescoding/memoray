const { Trash2, Plus, Book, Briefcase, Sun, Moon, Sparkles, LayoutGrid, Settings, ChevronLeft, ChevronRight, Menu } = lucideReact;
const { useState, useMemo, useEffect } = React;

const TimetableGenerator = () => {
  const [courses, setCourses] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/timetable')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCourses(data.courses || []);
        setCommitments(data.commitments || []);
        setGeneratedTimetable(data.timetable || null);
        setInitialLoading(false);
      })
      .catch(err => {
        console.error('Error fetching timetable data:', err);
        setCourses([]);
        setCommitments([]);
        setGeneratedTimetable(null);
        setInitialLoading(false);
      });
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    const result = await window.generateTimetable(courses, commitments, { studyStyle: 'morning', sessionLength: 60 });
    setGeneratedTimetable(result);
    setLoading(false);
    setShowSettings(false);
  };

  const removeCourse = (id) => setCourses(courses.filter(c => c.id !== id));
  const removeCommitment = (id) => setCommitments(commitments.filter(c => c.id !== id));

  // Helper to parse time string like "09:00 - 10:00" to grid positions
  const getTimePosition = (timeStr) => {
    try {
      const [start] = timeStr.split(' - ');
      const [hourStr, minuteStr] = start.split(':');
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      // Calculate row: (hour - 7) * 2 + (minute >= 30 ? 1 : 0) + 1
      // We'll use a simpler version for now: (hour - 7) * 60 + minute
      return (hour - 7) * 60 + minute;
    } catch (e) {
      return 0;
    }
  };

  const getDuration = (timeStr) => {
    try {
      const [start, end] = timeStr.split(' - ');
      const parse = (s) => {
        const [h, m] = s.split(':');
        return parseInt(h) * 60 + parseInt(m);
      };
      return parse(end) - parse(start);
    } catch (e) {
      return 60;
    }
  };

  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'class': return 'bg-[#E1F5FE] border-[#B3E5FC] text-[#0288D1] dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300';
      case 'study': return 'bg-[#FFF9C4] border-[#FFF176] text-[#FBC02D] dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300';
      case 'commitment': return 'bg-[#FFEBEE] border-[#FFCDD2] text-[#D32F2F] dark:bg-red-900/30 dark:border-red-800 dark:text-red-300';
      case 'break': return 'bg-[#F1F8E9] border-[#DCEDC8] text-[#689F38] dark:bg-green-900/30 dark:border-green-800 dark:text-green-300';
      default: return 'bg-[#F5F5F5] border-[#E0E0E0] text-[#616161] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      {/* Top Header/Actions */}
      <div className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h1>
          {generatedTimetable && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <Sparkles size={14} className="text-primary" />
              AI Optimized
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition ${showSettings ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            title="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Settings Panel (Collapsible) */}
        {showSettings && (
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-20 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
              {/* Commitments Section Only */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Your Commitments</h4>
                  <button className="p-1 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {commitments.length > 0 ? commitments.map(comm => (
                    <div key={comm.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 group relative">
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm">{comm.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{comm.time}</p>
                      <button 
                        onClick={() => removeCommitment(comm.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic text-center py-4">No commitments added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Calendar View */}
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-950 p-4 relative">
          <div className="min-w-[800px] h-full flex flex-col">
            {/* Calendar Header (Days) */}
            <div className="flex border-b border-gray-200 dark:border-gray-800">
              <div className="w-20 shrink-0" /> {/* Time column spacer */}
              {days.map(day => (
                <div key={day} className="flex-1 py-3 text-center font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest border-l border-gray-100 dark:border-gray-800/50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="flex flex-1 relative min-h-[900px] pb-24">
              {/* Time Column */}
              <div className="w-20 shrink-0 border-r border-gray-100 dark:border-gray-800">
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] text-right pr-3 text-xs text-gray-400 dark:text-gray-500 font-medium pt-1">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </div>
                ))}
              </div>

              {/* Grid Columns */}
              <div className="flex flex-1 relative">
                {days.map((day, dayIndex) => (
                  <div key={day} className="flex-1 border-l border-gray-50 dark:border-gray-900/50 relative">
                    {/* Grid Lines */}
                    {hours.map(hour => (
                      <div key={hour} className="h-[60px] border-b border-gray-50 dark:border-gray-900/30" />
                    ))}

                    {/* Timetable Items for this day */}
                    {generatedTimetable && generatedTimetable
                      .filter(item => item.day.toLowerCase().startsWith(day.toLowerCase()))
                      .map((item, i) => {
                        const top = getTimePosition(item.time);
                        const height = getDuration(item.time);
                        return (
                          <div 
                            key={i}
                            style={{ 
                              top: `${top}px`, 
                              height: `${height}px`,
                              left: '4px',
                              right: '4px'
                            }}
                            className={`absolute rounded-md border p-2 text-[10px] leading-tight overflow-hidden shadow-sm transition-transform hover:scale-[1.02] hover:z-10 cursor-pointer ${getTypeStyles(item.type)}`}
                          >
                            <div className="font-bold truncate">{item.activity}</div>
                            <div className="opacity-80">{item.time}</div>
                            <div className="mt-1 font-medium opacity-60 uppercase tracking-tighter">{item.type}</div>
                          </div>
                        );
                      })
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* THE ONE BUTTON IN THE MIDDLE */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 min-w-[240px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Sparkles size={22} /> {generatedTimetable ? 'Regenerate Schedule' : 'Generate Timetable'}</>
              )}
            </button>
          </div>

          {!generatedTimetable && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-950/60 backdrop-blur-[2px] z-10">
              <div className="p-8 text-center max-w-md mb-20">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <LayoutGrid size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to plan your week?</h2>
                <p className="text-gray-500 dark:text-gray-400">Configure your commitments and let AI create your optimized schedule.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.TimetableGenerator = TimetableGenerator;

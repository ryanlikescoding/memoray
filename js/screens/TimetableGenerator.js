const { Trash2, Plus, Book, Briefcase, Sun, Moon, Sparkles, LayoutGrid } = lucideReact;
const { useState } = React;

const TimetableGenerator = () => {
  const [courses, setCourses] = useState([
    { id: '1', name: 'Calculus I', details: 'Professor Smith, Room 101' },
    { id: '2', name: 'History of Art', details: 'Professor Davis, Room 203' },
  ]);
  const [commitments, setCommitments] = useState([
    { id: '1', name: 'Part-time Job', time: 'Wed, 5:00 PM - 9:00 PM' }
  ]);
  const [learningStyle, setLearningStyle] = useState('morning');
  const [sessionLength, setSessionLength] = useState(60);
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await window.generateTimetable(courses, commitments, { studyStyle: learningStyle, sessionLength });
    setGeneratedTimetable(result);
    setLoading(false);
  };

  const removeCourse = (id) => setCourses(courses.filter(c => c.id !== id));
  const removeCommitment = (id) => setCommitments(commitments.filter(c => c.id !== id));

  return (
    <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Configuration Sidebar */}
      <div className="w-full lg:w-1/3 space-y-8 pb-10">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Your Timetable</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Configure your preferences and let AI optimize your week.</p>
        </div>

        {/* Courses */}
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Your Courses</h3>
            <div className="space-y-3">
                {courses.map(course => (
                    <div key={course.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-3 group">
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md text-gray-600 dark:text-gray-300">
                            <Book size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{course.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{course.details}</p>
                        </div>
                        <button onClick={() => removeCourse(course.id)} className="text-gray-400 hover:text-red-500 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
            <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
                <Plus size={18} /> Add Course
            </button>
        </div>

        {/* Commitments */}
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Weekly Commitments</h3>
            <div className="space-y-3">
                {commitments.map(comm => (
                    <div key={comm.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-3">
                        <div className="bg-white dark:bg-gray-700 p-2 rounded-md text-gray-600 dark:text-gray-300">
                            <Briefcase size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{comm.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{comm.time}</p>
                        </div>
                        <button onClick={() => removeCommitment(comm.id)} className="text-gray-400 hover:text-red-500 transition">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
            <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
                <Plus size={18} /> Add Commitment
            </button>
        </div>

        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? 'Generating...' : <><Sparkles size={20} /> Generate Timetable</>}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
        {!generatedTimetable ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <LayoutGrid size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No timetable generated yet.</p>
                <p className="text-sm">Configure your preferences and click generate.</p>
            </div>
        ) : (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Optimized Schedule</h2>
                {generatedTimetable.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="w-24 font-bold text-gray-900 dark:text-white">{item.day}</div>
                        <div className="flex-1">
                            <div className="font-semibold text-primary">{item.time}</div>
                            <div className="text-gray-800 dark:text-gray-200">{item.activity}</div>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 inline-block">{item.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

window.TimetableGenerator = TimetableGenerator;

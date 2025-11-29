import React, { useState } from 'react';
import { Trash2, Plus, Book, Briefcase, Sun, Moon, Sparkles, LayoutGrid } from 'lucide-react';
import { Course, Commitment, TimetableEntry } from '../types';
import { generateTimetable } from '../services/gemini';
import clsx from 'clsx';

const TimetableGenerator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Calculus I', details: 'Professor Smith, Room 101' },
    { id: '2', name: 'History of Art', details: 'Professor Davis, Room 203' },
  ]);
  const [commitments, setCommitments] = useState<Commitment[]>([
    { id: '1', name: 'Part-time Job', time: 'Wed, 5:00 PM - 9:00 PM' }
  ]);
  const [learningStyle, setLearningStyle] = useState<'morning' | 'night'>('morning');
  const [sessionLength, setSessionLength] = useState(60);
  const [breakDuration, setBreakDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableEntry[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateTimetable(courses, commitments, { studyStyle: learningStyle, sessionLength });
    setGeneratedTimetable(result);
    setLoading(false);
  };

  const removeCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));
  const removeCommitment = (id: string) => setCommitments(commitments.filter(c => c.id !== id));

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

        {/* Learning Style */}
        <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Learning Style</h3>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Study Time</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setLearningStyle('morning')}
                        className={clsx("flex items-center justify-center gap-2 p-3 rounded-lg border transition", learningStyle === 'morning' ? "bg-blue-50 border-primary text-primary dark:bg-blue-900/20" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}
                    >
                        <Sun size={18} /> Morning Person
                    </button>
                    <button
                        onClick={() => setLearningStyle('night')}
                        className={clsx("flex items-center justify-center gap-2 p-3 rounded-lg border transition", learningStyle === 'night' ? "bg-blue-50 border-primary text-primary dark:bg-blue-900/20" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}
                    >
                        <Moon size={18} /> Night Owl
                    </button>
                </div>
            </div>

             {/* Sliders */}
             <div className="space-y-6">
                <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Study Session Length</span>
                        <span className="text-gray-500 dark:text-gray-400">{sessionLength} min</span>
                     </div>
                     <input 
                        type="range" min="30" max="120" step="15" 
                        value={sessionLength} onChange={(e) => setSessionLength(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                     />
                     <div className="flex justify-between text-xs text-gray-400">
                        <span>30 min</span>
                        <span>120 min</span>
                     </div>
                </div>

                <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Break Duration</span>
                        <span className="text-gray-500 dark:text-gray-400">{breakDuration} min</span>
                     </div>
                     <input 
                        type="range" min="5" max="30" step="5" 
                        value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                     />
                     <div className="flex justify-between text-xs text-gray-400">
                        <span>5 min</span>
                        <span>30 min</span>
                     </div>
                </div>
             </div>

             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? (
                    <span>Generating...</span>
                ) : (
                    <>
                        <Sparkles size={20} /> Generate Timetable
                    </>
                )}
             </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center min-h-[500px]">
          {generatedTimetable ? (
               <div className="w-full h-full flex flex-col items-start self-start">
                   <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Optimized Schedule</h2>
                   <div className="w-full space-y-4">
                       {generatedTimetable.map((entry, idx) => (
                           <div key={idx} className="flex gap-4 p-4 border-l-4 border-primary bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                               <div className="min-w-[100px] font-bold text-gray-700 dark:text-gray-300">{entry.day}</div>
                               <div className="min-w-[120px] text-primary font-medium">{entry.time}</div>
                               <div className="flex-1 font-semibold text-gray-900 dark:text-white">{entry.activity}</div>
                               <div className="text-sm text-gray-500 dark:text-gray-400 capitalize bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">{entry.type}</div>
                           </div>
                       ))}
                   </div>
               </div>
          ) : (
              <div className="text-center space-y-4 max-w-md">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto text-gray-400 dark:text-gray-500">
                      <LayoutGrid size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ready to organize your life?</h3>
                  <p className="text-gray-500 dark:text-gray-400">Configure your courses and commitments on the left, then click Generate to let our AI build your perfect schedule.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default TimetableGenerator;
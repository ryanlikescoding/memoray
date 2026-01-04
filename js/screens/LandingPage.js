const { Hexagon, Calendar, BarChart2, CheckSquare, Menu } = lucideReact;

const LandingPage = () => {
  const handleLogin = () => {
      localStorage.setItem('isAuthenticated', 'true');
      window.location.href = '/dashboard.html';
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-7xl flex-1">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 md:px-10 py-3">
              <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                <div className="size-6 text-primary">
                    <Hexagon className="fill-current" />
                </div>
                <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Memoray</h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <a className="text-gray-800 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Features</a>
                  <a className="text-gray-800 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Pricing</a>
                  <a className="text-gray-800 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">About</a>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleLogin}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <span className="truncate">Log In</span>
                  </button>
                  <button onClick={handleLogin} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                    <span className="truncate">Sign Up</span>
                  </button>
                </div>
              </div>
              <div className="md:hidden">
                <button className="text-gray-900 dark:text-white">
                  <Menu />
                </button>
              </div>
            </header>
            <main className="flex-grow">
              {/* HeroSection */}
              <div className="@container">
                <div className="flex flex-col gap-10 px-4 py-16 md:py-24 lg:flex-row lg:items-center">
                  <div className="flex flex-col gap-6 lg:w-1/2 lg:pr-12">
                    <div className="flex flex-col gap-4 text-left">
                      <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl">
                        Your AI-Powered Study Partner.
                      </h1>
                      <h2 className="text-gray-700 dark:text-gray-300 text-base font-normal leading-relaxed sm:text-lg">
                        Effortlessly create smart timetables, track your progress, and conquer your exams with personalized revision lists. Memoray organizes your studies, so you can focus on learning.
                      </h2>
                    </div>
                    <button onClick={handleLogin} className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                      <span className="truncate">Get Started for Free</span>
                    </button>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-2xl" 
                         style={{ backgroundImage: 'url("https://picsum.photos/1024/768?grayscale&blur=2")' }}>
                         <div className="w-full h-full bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Hexagon size={96} className="text-white drop-shadow-lg" />
                         </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* FeatureSection */}
              <div className="flex flex-col gap-10 px-4 py-16 md:py-24 bg-white dark:bg-gray-800/50 rounded-xl">
                <div className="flex flex-col gap-4 items-center text-center">
                  <h1 className="text-gray-900 dark:text-white tracking-light text-3xl font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-2xl">
                    Master Your Studies with Intelligent Tools
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300 text-base font-normal leading-relaxed max-w-2xl">
                    Memoray provides everything you need to study smarter, not harder. From automated scheduling to progress insights, we've got you covered.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-0">
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6 flex-col items-center text-center hover:border-primary/50 transition-colors">
                    <div className="text-primary bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
                      <Calendar size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Smart Timetables</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">Let our AI generate the most effective study schedule tailored to your courses and goals.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark p-6 flex-col items-center text-center hover:border-primary/50 transition-colors">
                    <div className="text-primary bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
                      <BarChart2 size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Performance Tracking</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">Monitor your scores and track your academic progress to identify strengths and weaknesses.</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

window.LandingPage = LandingPage;

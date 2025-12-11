import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Cpu, Settings, MessageSquare, Menu, X, ChevronUp, LogOut } from 'lucide-react';
import { User, Tool, Reservation, Review, PageView } from './types';
import { MOCK_USERS, INITIAL_TOOLS } from './constants';
import { Dashboard } from './components/Dashboard';
import { TeamPage } from './components/TeamPage';
import { ToolsPage } from './components/ToolsPage';
import { ReviewsPage } from './components/ReviewsPage';
import { SettingsPage } from './components/SettingsPage';
import { UserSwitcher } from './components/UserSwitcher';

function App() {
  // --- Global State ---
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  
  const [selectedToolFilter, setSelectedToolFilter] = useState<string | null>(null);

  // Data Persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ai_manager_users');
    return saved ? JSON.parse(saved) : MOCK_USERS.map(u => ({...u, role: 'Member', initials: u.name.substring(0,2).toUpperCase()}));
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users[0];
  });

  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('ai_manager_tools');
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('ai_manager_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ai_manager_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Effects ---
  useEffect(() => {
    // Initialize Theme
    const isDark = localStorage.getItem('theme') === 'dark';
    if(isDark) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => localStorage.setItem('ai_manager_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('ai_manager_tools', JSON.stringify(tools)), [tools]);
  useEffect(() => localStorage.setItem('ai_manager_reservations', JSON.stringify(reservations)), [reservations]);
  useEffect(() => localStorage.setItem('ai_manager_reviews', JSON.stringify(reviews)), [reviews]);

  // --- Handlers ---
  const handleNavigate = (page: PageView, toolId?: string) => {
    setCurrentPage(page);
    if (page === 'reviews' && toolId) {
      setSelectedToolFilter(toolId);
    } else {
      setSelectedToolFilter(null);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setIsUserSwitcherOpen(false);
  };

  // Data Modifiers
  const addUser = (u: User) => setUsers([...users, u]);
  const updateUser = (u: User) => setUsers(users.map(user => user.id === u.id ? u : user));
  const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addTool = (t: Tool) => setTools([...tools, t]);
  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
    setReservations(reservations.filter(r => r.toolId !== id)); 
  };

  const addReservation = (r: Reservation) => setReservations([...reservations, r]);
  const updateReservation = (r: Reservation) => setReservations(reservations.map(res => res.id === r.id ? r : res));
  const removeReservation = (id: string) => setReservations(reservations.filter(r => r.id !== id));

  const addReview = (review: Review) => setReviews([review, ...reviews]);

  const getReviewCount = (toolId: string) => reviews.filter(r => r.toolId === toolId).length;

  // --- Render Helpers ---
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            users={users} 
            tools={tools} 
            reservations={reservations}
            currentUser={currentUser}
            onAddReservation={addReservation}
            onUpdateReservation={updateReservation}
            onRemoveReservation={removeReservation}
          />
        );
      case 'team':
        return <TeamPage users={users} onAdd={addUser} onUpdate={updateUser} onRemove={removeUser} currentUser={currentUser} />;
      case 'tools':
        return (
          <ToolsPage 
            tools={tools} 
            getReviewCount={getReviewCount}
            onAdd={addTool} 
            onRemove={removeTool} 
            onViewReviews={(toolId) => handleNavigate('reviews', toolId)}
            currentUser={currentUser}
          />
        );
      case 'reviews':
        return (
          <ReviewsPage 
            reviews={reviews} 
            tools={tools} 
            users={users} 
            currentUser={currentUser}
            initialToolFilter={selectedToolFilter}
            onAddReview={addReview} 
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  const NavItem = ({ page, icon: Icon, label }: { page: PageView, icon: any, label: string }) => (
    <button
      onClick={() => handleNavigate(page)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
        ${currentPage === page 
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 ${currentPage === page ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 flex font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center gap-2.5 px-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            AI Manager
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem page="team" icon={Users} label="Team Members" />
          <NavItem page="tools" icon={Cpu} label="AI Tools" />
          <NavItem page="reviews" icon={MessageSquare} label="Reviews" />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-1 flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/50">
          <NavItem page="settings" icon={Settings} label="Settings" />
          
          {/* User Profile / Switcher */}
          <div className="mt-4 relative">
            <button 
              onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
              className="w-full flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold border border-blue-200 dark:border-blue-700">
                {currentUser.initials}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Switch User</p>
              </div>
            </button>

            {/* Switch User Popover */}
            {isUserSwitcherOpen && (
              <UserSwitcher 
                users={users} 
                currentUser={currentUser} 
                onSwitch={handleSwitchUser} 
                onClose={() => setIsUserSwitcherOpen(false)} 
              />
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Top Bar */}
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
            {currentPage === 'dashboard' ? 'Schedule' : 
             currentPage === 'team' ? 'Team Management' : 
             currentPage === 'tools' ? 'Tool Management' : 
             currentPage === 'reviews' ? 'Tool Reviews' :
             currentPage}
          </h1>
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative">
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2 border-2 border-white dark:border-gray-800"></div>
                <MessageSquare className="w-5 h-5" />
             </button>
             <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-80px)]">
           {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
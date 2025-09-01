import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/learning.png';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [menuOpen, setMenuOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('userUpdated', handleUserChange);
    window.addEventListener('storage', handleUserChange);

    return () => {
      window.removeEventListener('userUpdated', handleUserChange);
      window.removeEventListener('storage', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/signin');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-screen ${
          collapsed ? 'w-20' : 'w-[20%]'
        } bg-white text-gray-800 shadow-md z-20 flex-col transition-all duration-300`}
      >
        {/* Logo + Collapse Button */}
        <div className="p-4 flex items-center justify-between border-b">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Learning Logo" className="w-12 h-12 object-cover" />
            {!collapsed && <span className="font-bold text-xl whitespace-nowrap">LearnSpace</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="ml-2">
            {collapsed ? '☰' : '✖'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-2">
            {user && (
              <li>
                <Link
                  to={user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'}
                  className="block px-6 py-3 hover:bg-gray-100 transition-colors"
                >
                  {collapsed ? '🏠' : 'Dashboard'}
                </Link>
              </li>
            )}

            {user?.role === 'faculty' && (
              <>
                <li>
                  <Link
                    to="/create-course"
                    className="block px-6 py-3 hover:bg-gray-100 transition-colors"
                  >
                    {collapsed ? '📘' : '📘 Create Course'}
                  </Link>
                </li>
              
              
          
                <li>
                  <Link
                    to="/manage-students"
                    className="block px-6 py-3 hover:bg-gray-100 transition-colors"
                  >
                    {collapsed ? '👥' : '👥 Manage Students'}
                  </Link>
                </li>
              </>
            )}

            {user?.role === 'student' && (
              <li>
                <Link
                  to="/student/enrolled-courses"
                  className="block px-6 py-3 hover:bg-gray-100 transition-colors"
                >
                  {collapsed ? '🎓' : '🎓 Enrolled-Course'}
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.firstName + ' ' + user.lastName
                )}`}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              {!collapsed && (
                <div className="flex-1">
                  <p className="font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.role}</p>
                  <button onClick={handleLogout} className="btn btn-sm btn-error mt-2">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !collapsed && <Link to="/signin" className="btn btn-primary w-full">Sign In</Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10 object-cover" />
            <span className="font-bold text-lg">LearnSpace</span>
          </Link>

          {/* Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            {menuOpen ? '✖' : '☰'}
          </button>
        </div>

        {/* Collapsible Dropdown */}
        <div
          className={`transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-[600px]' : 'max-h-0'}`}
        >
          <div className="border-t p-4">
            <ul className="space-y-2">
              {user && (
                <li>
                  <Link
                    to={user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {user?.role === 'faculty' && (
                <>
                  <li>
                    <Link
                      to="/create-course"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      📘 Create Course
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manage-students"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      👥 Manage Students
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'student' && (
                <li>
                  <Link
                    to="/student/join-course"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    🎓 Join Course
                  </Link>
                </li>
              )}
            </ul>

            <div className="mt-4 border-t pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}`}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-sm btn-error">Logout</button>
                </div>
              ) : (
                <Link to="/signin" className="btn btn-primary w-full">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

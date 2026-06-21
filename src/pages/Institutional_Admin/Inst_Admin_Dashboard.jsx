// InstAdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import apiClient from '../../services/apiClient';
import './inst_admin_dashboard.css';

/** Animated counter hook */
const useCountUp = (target, duration = 1000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!startCounting || target === 0) {
      setCount(target);
      return;
    }
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, startCounting]);

  return count;
};

const InstAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Admin data from localStorage
  const [adminData, setAdminData] = useState({
    fullName: '',
    email: '',
    instituteId: '',
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: ''
  });
  
  // Stats data
  const [studentsCount, setStudentsCount] = useState(0);
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  
  // Students data
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  
  // Courses data
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Get admin data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminData({
          fullName: user.fullName || `${user.firstName || ''} ${user.secondName || ''} ${user.thirdName || ''} ${user.lastName || ''}`,
          email: user.email || '',
          instituteId: user.instituteId || '',
          firstName: user.firstName || '',
          secondName: user.secondName || '',
          thirdName: user.thirdName || '',
          lastName: user.lastName || ''
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Fetch dashboard overview stats
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/Dashboard/institute-overview');
        const data = response.data;
        setStudentsCount(data.studentsCount || 0);
        setInstructorsCount(data.instructorsCount || 0);
        setCoursesCount(data.coursesCount || 0);
        setTimeout(() => setAnimateIn(true), 200);
      } catch (err) {
        console.error('Error fetching overview:', err);
        setError('Could not load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        const response = await apiClient.get('/Students');
          // Ensure response.data is an array, handle various API response structures
          const studentsData = Array.isArray(response.data)
            ? response.data
            : response.data?.students || response.data?.data || [];
          setStudents(studentsData);
      } catch (err) {
        console.error('Error fetching students:', err);
          setStudents([]); // Set empty array on error
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const instituteId = adminData.instituteId;
        if (instituteId) {
          const response = await apiClient.get(`/Courses/institute/${instituteId}`);
            // Ensure response.data is an array, handle various API response structures
            const coursesData = Array.isArray(response.data)
              ? response.data
              : response.data?.courses || response.data?.data || [];
            setCourses(coursesData);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
          setCourses([]); // Set empty array on error
      } finally {
        setCoursesLoading(false);
      }
    };
    
    if (adminData.instituteId) {
      fetchCourses();
    }
  }, [adminData.instituteId]);

  // Animated stats
  const animatedStudents = useCountUp(studentsCount, 1000, animateIn);
  const animatedInstructors = useCountUp(instructorsCount, 1000, animateIn);
  const animatedCourses = useCountUp(coursesCount, 1000, animateIn);

  // Get initials for avatar
  const getInitials = () => {
    if (adminData.fullName) {
      return adminData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (adminData.firstName) return adminData.firstName[0]?.toUpperCase() || 'A';
    return 'IA';
  };

  // Limit students to latest 7 for display
  const latestStudents = Array.isArray(students) ? students.slice(0, 7) : [];
  
  // Limit courses to latest 6 for display
  const latestCourses = Array.isArray(courses) ? courses.slice(0, 6) : [];

  return (
    <div className="ia-layout">
      <button className="ia-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className={`ia-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'ia-sidebar-wrapper open' : 'ia-sidebar-wrapper'}>
        <InstAdminSideBar />
      </div>

      <main className="ia-main-content">
        {/* Header */}
        <header className="ia-header">
          <div className="ia-header-logo">
            <svg className="ia-edu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="ia-edu-text">Edu<span className="ia-nexus-text">Nexus</span></span>
          </div>
          <div className="ia-user-profile">
            <div className="ia-user-info">
              <span className="ia-user-name">{adminData.fullName || 'Institutional Admin'}</span>
              <span className="ia-user-email">{adminData.email}</span>
            </div>
            <div className="ia-user-avatar">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="ia-page-content">
          {loading && (
            <div className="ia-loading">
              <div className="ia-spinner"></div>
              <p>Loading dashboard...</p>
            </div>
          )}

          {error && (
            <div className="ia-error">
              <svg className="ia-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className={`ia-container ${animateIn ? 'ia-animate-in' : ''}`}>
              {/* Welcome Section */}
              <div className="ia-welcome-section">
                <div className="ia-welcome-text">
                  <div className="ia-institute-badge">
                    <span className="ia-institute-id">{adminData.instituteId}</span>
                  </div>
                  <h1>Welcome back, {adminData.firstName || 'Admin'}!</h1>
                  <p>Oversee and manage all students, instructors, and courses with precision and professionalism.</p>
                </div>
                <div className="ia-welcome-illustration">
                  <svg viewBox="0 0 120 100" fill="none">
                    <rect x="10" y="20" width="40" height="50" rx="4" fill="#fef3c7" stroke="#e67e22" strokeWidth="1.5" />
                    <rect x="20" y="30" width="20" height="3" rx="1" fill="#e67e22" />
                    <rect x="20" y="37" width="15" height="3" rx="1" fill="#e67e22" opacity="0.5" />
                    <rect x="20" y="44" width="18" height="3" rx="1" fill="#e67e22" opacity="0.3" />
                    <circle cx="85" cy="40" r="20" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                    <path d="M78 40l4 4 8-8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                    <rect x="60" y="60" width="50" height="30" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                    <circle cx="75" cy="75" r="8" fill="#3b82f6" opacity="0.2" />
                  </svg>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="ia-stats-grid">
                <div className="ia-stat-card">
                  <div className="ia-stat-icon-wrap students">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <span className="ia-stat-label">Students</span>
                  <span className="ia-stat-value">{animatedStudents.toLocaleString()}</span>
                  <div className="ia-stat-trend">
                    <span className="ia-trend-up">↑</span> Active learners
                  </div>
                </div>

                <div className="ia-stat-card">
                  <div className="ia-stat-icon-wrap instructors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="ia-stat-label">Instructors</span>
                  <span className="ia-stat-value">{animatedInstructors.toLocaleString()}</span>
                  <div className="ia-stat-trend">
                    <span className="ia-trend-up">↑</span> Teaching staff
                  </div>
                </div>

                <div className="ia-stat-card">
                  <div className="ia-stat-icon-wrap courses">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <span className="ia-stat-label">Courses</span>
                  <span className="ia-stat-value">{animatedCourses.toLocaleString()}</span>
                  <div className="ia-stat-trend">
                    <span className="ia-trend-up">↑</span> Active courses
                  </div>
                </div>
              </div>

              {/* Latest Students Added Table */}
              <div className="ia-table-card">
                <div className="ia-table-header">
                  <h3 className="ia-table-title">Latest Students Added</h3>
                  <div className="ia-table-count">{students.length} total students</div>
                </div>
                <div className="ia-table-wrapper">
                  <table className="ia-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Enrolled Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsLoading ? (
                        <tr>
                          <td colSpan="3" className="ia-table-loading">
                            <div className="ia-skeleton"></div>
                          </td>
                        </tr>
                      ) : latestStudents.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="ia-table-empty">No students found</td>
                        </tr>
                      ) : (
                        latestStudents.map((student, index) => (
                          <tr key={student.id} className="ia-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td className="ia-cell-name">
                              <div className="ia-name-wrapper">
                                <div className="ia-student-initials">
                                  {student.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'}
                                </div>
                                <div>
                                  <div className="ia-name">{student.fullName}</div>
                                  <div className="ia-id">{student.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="ia-cell-email">
                              <div className="ia-email-wrapper">
                                <svg className="ia-email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="2" y="4" width="20" height="16" rx="2" />
                                  <path d="M22 7l-10 7L2 7" />
                                </svg>
                                <span>{student.email}</span>
                              </div>
                            </td>
                            <td className="ia-cell-count">
                              <div className="ia-courses-badge">
                                <svg className="ia-courses-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                                <span>{student.enrolledCoursesCount || 0} courses</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {students.length > 7 && (
                  <div className="ia-table-footer">
                    <button className="ia-view-all-btn" onClick={() => window.location.href = '/institutional-admin/students'}>
                      View All Students →
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Course Updates Table */}
              <div className="ia-table-card">
                <div className="ia-table-header">
                  <h3 className="ia-table-title">Recent Course Updates</h3>
                  <div className="ia-table-count">{courses.length} total courses</div>
                </div>
                <div className="ia-table-wrapper">
                  <table className="ia-table">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th>Instructors</th>
                        <th>Enrolled Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesLoading ? (
                        <tr>
                          <td colSpan="3" className="ia-table-loading">
                            <div className="ia-skeleton"></div>
                          </td>
                        </tr>
                      ) : latestCourses.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="ia-table-empty">No courses found</td>
                        </tr>
                      ) : (
                        latestCourses.map((course, index) => (
                          <tr key={course.id} className="ia-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td className="ia-cell-course">
                              <div className="ia-course-wrapper">
                                <div className="ia-course-initials">
                                  {course.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                  <div className="ia-name">{course.name}</div>
                                  <div className="ia-id">{course.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="ia-cell-instructors">
                              <div className="ia-instructors-wrapper">
                                <svg className="ia-instructor-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                <div className="ia-instructor-names">
                                  {course.instructorNames?.slice(0, 2).join(', ')}
                                  {course.instructorNames?.length > 2 && ` +${course.instructorNames.length - 2} more`}
                                </div>
                              </div>
                            </td>
                            <td className="ia-cell-count">
                              <div className="ia-students-badge">
                                <svg className="ia-students-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                </svg>
                                <span>{course.enrolledStudentsCount || 0} enrolled</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {courses.length > 6 && (
                  <div className="ia-table-footer">
                    <button className="ia-view-all-btn" onClick={() => window.location.href = '/institutional-admin/courses'}>
                      View All Courses →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstAdminDashboard;
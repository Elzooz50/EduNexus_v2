import React, { useState, useEffect } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import apiClient from '../../services/apiClient';
import './inst_courses.css';

const InstCourses = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [adminData, setAdminData] = useState({ instituteId: '', fullName: '', email: '' });
  
  // Courses lists
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // Search state
  const [searchId, setSearchId] = useState('');
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  // New course fields
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [addingCourse, setAddingCourse] = useState(false);

  // Modal managements
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [manageTab, setManageTab] = useState('student'); // 'student' or 'instructor'
  const [manageStudentId, setManageStudentId] = useState('');
  const [manageInstructorId, setManageInstructorId] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Import fields (mock)
  const [importFile, setImportFile] = useState(null);
  const [importFields, setImportFields] = useState({
    id: true,
    name: true,
    instituteId: true,
    isActive: true,
  });

  useEffect(() => {
    // Load admin user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const data = {
          instituteId: user.instituteId || '',
          fullName: user.fullName || `${user.firstName || ''} ${user.secondName || ''} ${user.thirdName || ''} ${user.lastName || ''}`,
          email: user.email || '',
        };
        setAdminData(data);
        if (user.instituteId) {
          fetchCourses(user.instituteId);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const fetchCourses = async (instId) => {
    const idToUse = instId || adminData.instituteId;
    if (!idToUse) return;
    try {
      setCoursesLoading(true);
      const res = await apiClient.get(`/Courses/institute/${encodeURIComponent(idToUse)}`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) return;
    setSearching(true);
    setSearchError('');
    setSearchedCourse(null);

    try {
      const res = await apiClient.get(`/Courses/${encodeURIComponent(trimmedId)}`, {
        params: { instituteId: adminData.instituteId }
      });
      const data = res.data?.data || res.data;
      if (data) {
        setSearchedCourse(data);
      } else {
        setSearchError('Course not found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError(err.response?.data?.message || 'Error searching course. Make sure ID is correct.');
    } finally {
      setSearching(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseId.trim() || !newCourseName.trim()) {
      alert('Please fill out all fields.');
      return;
    }
    setAddingCourse(true);
    try {
      const payload = {
        id: newCourseId.trim(),
        name: newCourseName.trim(),
        instituteName: adminData.instituteId // Backend maps correct institute from code/ID passed as name
      };
      
      const res = await apiClient.post('/Courses', payload);
      // Backend returns a CourseResultResponse
      if (res.data?.success || res.status === 200) {
        alert('Course added successfully!');
        setNewCourseId('');
        setNewCourseName('');
        setShowAddCourseModal(false);
        fetchCourses();
      } else {
        alert(res.data?.message || 'Failed to add course.');
      }
    } catch (err) {
      console.error('Error adding course:', err);
      alert(err.response?.data?.message || 'Error creating course. Double check institute correlation.');
    } finally {
      setAddingCourse(false);
    }
  };

  const openDetails = async (courseId) => {
    try {
      // Fetch full details of the course (includes student list and instructor list)
      const res = await apiClient.get(`/Courses/${encodeURIComponent(courseId)}`, {
        params: { instituteId: adminData.instituteId }
      });
      const data = res.data?.data || res.data;
      setSelectedCourse(data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error loading course details:', err);
      alert('Could not fetch course details.');
    }
  };

  const openManage = (course) => {
    setSelectedCourse(course);
    setManageStudentId('');
    setManageInstructorId('');
    setShowManageModal(true);
  };

  const handleEnrollStudent = async () => {
    const studId = manageStudentId.trim();
    if (!studId || !selectedCourse) return alert('Student ID is required');
    setProcessingAction(true);
    try {
      const res = await apiClient.post(`/Courses/${encodeURIComponent(selectedCourse.id)}/students/${encodeURIComponent(studId)}`);
      if (res.data?.success || res.status === 200) {
        alert('Student enrolled successfully!');
        setManageStudentId('');
        // Refresh details if visible
        if (showDetailsModal) {
          openDetails(selectedCourse.id);
        } else {
          fetchCourses();
        }
      } else {
        alert(res.data?.message || 'Failed to enroll student.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error enrolling student');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUnenrollStudent = async () => {
    const studId = manageStudentId.trim();
    if (!studId || !selectedCourse) return alert('Student ID is required');
    setProcessingAction(true);
    try {
      const res = await apiClient.delete(`/Courses/${encodeURIComponent(selectedCourse.id)}/students/${encodeURIComponent(studId)}`);
      if (res.data?.success || res.status === 200) {
        alert('Student unenrolled successfully!');
        setManageStudentId('');
        if (showDetailsModal) {
          openDetails(selectedCourse.id);
        } else {
          fetchCourses();
        }
      } else {
        alert(res.data?.message || 'Failed to unenroll student.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error unenrolling student');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleAssignInstructor = async () => {
    const instId = manageInstructorId.trim();
    if (!instId || !selectedCourse) return alert('Instructor ID is required');
    setProcessingAction(true);
    try {
      const res = await apiClient.post(`/Courses/${encodeURIComponent(selectedCourse.id)}/instructors/${encodeURIComponent(instId)}`);
      if (res.data?.success || res.status === 200) {
        alert('Instructor assigned successfully!');
        setManageInstructorId('');
        if (showDetailsModal) {
          openDetails(selectedCourse.id);
        } else {
          fetchCourses();
        }
      } else {
        alert(res.data?.message || 'Failed to assign instructor.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error assigning instructor');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleUnassignInstructor = async () => {
    const instId = manageInstructorId.trim();
    if (!instId || !selectedCourse) return alert('Instructor ID is required');
    setProcessingAction(true);
    try {
      const res = await apiClient.delete(`/Courses/${encodeURIComponent(selectedCourse.id)}/instructors/${encodeURIComponent(instId)}`);
      if (res.data?.success || res.status === 200) {
        alert('Instructor unassigned successfully!');
        setManageInstructorId('');
        if (showDetailsModal) {
          openDetails(selectedCourse.id);
        } else {
          fetchCourses();
        }
      } else {
        alert(res.data?.message || 'Failed to unassign instructor.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error unassigning instructor');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleImportSubmit = () => {
    console.log('Importing course list file:', importFile);
    setShowImportModal(false);
    setImportFile(null);
  };

  const getInitials = () => {
    if (adminData.fullName) {
      return adminData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'IA';
  };

  return (
    <div className="ia-layout">
      <button className="ia-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
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
              <span className="ia-user-email">{adminData.instituteId}</span>
            </div>
            <div className="ia-user-avatar">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="ia-page-content">
          <div className="ia-action-bar">
            <button className="ia-btn-import" onClick={() => setShowImportModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Import data
            </button>

            <div className="ia-search">
              <input
                type="text"
                placeholder="Search course by ID (e.g. inst-cairo-0001-C3)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="ia-search-btn" onClick={handleSearch} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="ia-courses-header">
            <div>
              <h1 className="ia-page-title">Course Management</h1>
              <p className="ia-page-subtitle">
                Create new academic programs, allocate teachers, register students, and examine full course cohorts details inside your organization.
              </p>
            </div>
            <button className="ia-btn-add-course" onClick={() => setShowAddCourseModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Course
            </button>
          </div>

          {/* Admin name/info row */}
          <div className="ia-header-inline">
            <div className="ia-admin-name">{adminData.fullName || 'Institutional Admin'}</div>
            <div className="ia-admin-id">{adminData.instituteId}</div>
          </div>

          {/* Search Result section */}
          {searchedCourse && (
            <div className="ia-search-result ia-search-course-detail">
              <button className="ia-search-close" onClick={() => setSearchedCourse(null)}>✕</button>
              <div className="ia-search-detail-head">
                <div className="ia-search-badge">Course Query Found</div>
                <h2>{searchedCourse.name}</h2>
                <div className="ia-search-meta">ID: <span>{searchedCourse.id}</span></div>
              </div>
              <div className="ia-search-sections-grid">
                <div className="ia-search-sub-sec">
                  <h4>👨‍🏫 Assigned Instructors ({searchedCourse.instructors?.length || 0})</h4>
                  {searchedCourse.instructors && searchedCourse.instructors.length > 0 ? (
                    <ul>
                      {searchedCourse.instructors.map((inst, index) => (
                        <li key={inst.id || index}>
                          <span className="id-tag">ID: {inst.instructorId}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-tag">No instructors assigned.</p>
                  )}
                </div>
                <div className="ia-search-sub-sec">
                  <h4>👥 Registered Students ({searchedCourse.students?.length || 0})</h4>
                  {searchedCourse.students && searchedCourse.students.length > 0 ? (
                    <ul className="student-scroll-list">
                      {searchedCourse.students.map((st, index) => (
                        <li key={st.id || index}>
                          <span className="id-tag">ID: {st.studentId}</span>
                          {st.groupStudent && <span className="group-tag">Group: {st.groupStudent.groupId?.slice(0, 8)}...</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-tag">No students registered.</p>
                  )}
                </div>
              </div>
              <div className="ia-search-footer-actions">
                <button className="ia-action-btn assign" onClick={() => openManage(searchedCourse)}>Manage Enrollment</button>
              </div>
            </div>
          )}
          
          {searchError && <div className="ia-search-error">{searchError}</div>}

          {/* Advanced Grid of Course Cards */}
          {coursesLoading ? (
            <div className="ia-courses-loading">
              <div className="ia-spinner"></div>
              <p>Loading institutional courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="ia-courses-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <p>No courses registered for this institution yet.</p>
            </div>
          ) : (
            <div className="ia-courses-advanced-grid">
              {courses.map((course, idx) => (
                <div 
                  className="ia-course-neon-card" 
                  key={course.id || idx}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="ia-course-card-top">
                    <div className="ia-course-icon-badge">
                      <span>{course.name?.charAt(0).toUpperCase() || 'C'}</span>
                    </div>
                    <div className="ia-course-card-id-badge">{course.id}</div>
                  </div>

                  <h3 className="ia-course-card-name">{course.name}</h3>

                  <div className="ia-course-card-divider"></div>

                  <div className="ia-course-card-info-row">
                    <span className="info-label">👥 Enrolled Cohort</span>
                    <span className="info-value count-highlight">
                      {course.enrolledStudentsCount || 0} Students
                    </span>
                  </div>

                  <div className="ia-course-card-instructors-sec">
                    <span className="info-label">👨‍🏫 Instructor Staff</span>
                    {Array.isArray(course.instructorNames) && course.instructorNames.length > 0 ? (
                      <div className="instructor-badges-container">
                        {course.instructorNames.slice(0, 3).map((name, i) => (
                          <div className="instructor-mini-badge" key={i} title={name}>
                            {name}
                          </div>
                        ))}
                        {course.instructorNames.length > 3 && (
                          <div className="instructor-more-badge">
                            +{course.instructorNames.length - 3} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-staff">No staff assigned</div>
                    )}
                  </div>

                  <div className="ia-course-card-actions">
                    <button className="ia-course-card-btn view-details" onClick={() => openDetails(course.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      Details
                    </button>
                    <button className="ia-course-card-btn manage-cohort" onClick={() => openManage(course)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Course Detail / Drawer Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="ia-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="ia-modal ia-course-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <h2>Course Deep-Dive</h2>
              <button className="ia-modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div className="ia-detail-hero">
              <div className="hero-icon">{selectedCourse.name?.charAt(0).toUpperCase()}</div>
              <div>
                <h3>{selectedCourse.name}</h3>
                <p className="hero-meta">ID: {selectedCourse.id} | Institute: {selectedCourse.instituteId}</p>
              </div>
            </div>

            <div className="ia-details-grid">
              <div className="details-col">
                <div className="section-title-wrapper">
                  <h4>👥 Enrolled Students ({selectedCourse.students?.length || 0})</h4>
                  <button className="small-action-btn" onClick={() => { setShowDetailsModal(false); openManage(selectedCourse); }}>+ Manage</button>
                </div>
                <div className="details-list-wrap">
                  {selectedCourse.students && selectedCourse.students.length > 0 ? (
                    <table className="details-mini-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Group ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCourse.students.map((st, i) => (
                          <tr key={st.id || i}>
                            <td className="font-mono">{st.studentId}</td>
                            <td className="text-gray">
                              {st.groupStudent ? st.groupStudent.groupId?.slice(0, 12) + '...' : 'Unallocated'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-panel">No students enrolled.</div>
                  )}
                </div>
              </div>

              <div className="details-col">
                <div className="section-title-wrapper">
                  <h4>👨‍🏫 Assigned Instructors ({selectedCourse.instructors?.length || 0})</h4>
                  <button className="small-action-btn" onClick={() => { setShowDetailsModal(false); openManage(selectedCourse); }}>+ Manage</button>
                </div>
                <div className="details-list-wrap">
                  {selectedCourse.instructors && selectedCourse.instructors.length > 0 ? (
                    <table className="details-mini-table">
                      <thead>
                        <tr>
                          <th>Instructor ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCourse.instructors.map((ins, i) => (
                          <tr key={ins.id || i}>
                            <td className="font-mono">{ins.instructorId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-panel">No instructors assigned.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Enrollment / Manage Modal */}
      {showManageModal && selectedCourse && (
        <div className="ia-modal-overlay" onClick={() => setShowManageModal(false)}>
          <div className="ia-modal ia-modal--compact" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <h2>Enrollment Manager</h2>
              <button className="ia-modal-close" onClick={() => setShowManageModal(false)}>✕</button>
            </div>
            
            <p className="manage-course-subtitle">Course: <strong>{selectedCourse.name}</strong></p>

            <div className="ia-manage-tabs">
              <button 
                className={`manage-tab ${manageTab === 'student' ? 'active' : ''}`}
                onClick={() => setManageTab('student')}
              >
                Students
              </button>
              <button 
                className={`manage-tab ${manageTab === 'instructor' ? 'active' : ''}`}
                onClick={() => setManageTab('instructor')}
              >
                Instructors
              </button>
            </div>

            <div className="ia-manage-form-body">
              {manageTab === 'student' ? (
                <div className="manage-form-group">
                  <label htmlFor="manage-student-id">Student ID</label>
                  <input
                    id="manage-student-id"
                    type="text"
                    placeholder="e.g. stu-cu-001"
                    value={manageStudentId}
                    onChange={(e) => setManageStudentId(e.target.value)}
                    className="ia-modal-input"
                  />
                  <div className="ia-manage-buttons">
                    <button 
                      className="ia-btn-action enroll" 
                      onClick={handleEnrollStudent}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Enrolling...' : 'Enroll Student'}
                    </button>
                    <button 
                      className="ia-btn-action unenroll" 
                      onClick={handleUnenrollStudent}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Unenrolling...' : 'Unenroll Student'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="manage-form-group">
                  <label htmlFor="manage-instructor-id">Instructor ID</label>
                  <input
                    id="manage-instructor-id"
                    type="text"
                    placeholder="e.g. inst-cu-01"
                    value={manageInstructorId}
                    onChange={(e) => setManageInstructorId(e.target.value)}
                    className="ia-modal-input"
                  />
                  <div className="ia-manage-buttons">
                    <button 
                      className="ia-btn-action enroll" 
                      onClick={handleAssignInstructor}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Assigning...' : 'Assign Staff'}
                    </button>
                    <button 
                      className="ia-btn-action unenroll" 
                      onClick={handleUnassignInstructor}
                      disabled={processingAction}
                    >
                      {processingAction ? 'Unassigning...' : 'Unassign Staff'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="ia-modal-overlay" onClick={() => setShowAddCourseModal(false)}>
          <div className="ia-modal ia-modal--compact" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <h2>Add New Course</h2>
              <button className="ia-modal-close" onClick={() => setShowAddCourseModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAddCourse}>
              <div className="ia-modal-field-block">
                <label htmlFor="new-course-id">Course Code / ID</label>
                <input
                  id="new-course-id"
                  type="text"
                  placeholder="e.g. inst-cairo-0001-C6"
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="ia-modal-input"
                  required
                />
              </div>

              <div className="ia-modal-field-block">
                <label htmlFor="new-course-name">Course Name</label>
                <input
                  id="new-course-name"
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="ia-modal-input"
                  required
                />
              </div>

              <div className="ia-modal-field-block">
                <label>Institution ID</label>
                <div className="ia-modal-static-value font-mono">{adminData.instituteId}</div>
              </div>

              <div className="ia-modal-actions-row">
                <button type="submit" className="ia-modal-submit" disabled={addingCourse}>
                  {addingCourse ? 'Creating...' : 'Create Course'}
                </button>
                <button type="button" className="ia-modal-cancel" onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="ia-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="ia-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <h2>Choose data type</h2>
              <button className="ia-modal-close" onClick={() => setShowImportModal(false)}>✕</button>
            </div>

            <div className="ia-modal-type-grid">
              <div className="ia-modal-type-card selected">
                <div className="ia-modal-type-icon excel">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" fill="#059669" />
                    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">XLS</text>
                  </svg>
                </div>
                <span className="ia-modal-type-label">Excel (.xlsx)</span>
                <span className="ia-modal-type-desc">Best for bulk upload</span>
              </div>
            </div>

            <h3 className="ia-modal-section-title">Fields to include</h3>
            <div className="ia-modal-fields">
              {[
                { key: 'id', label: 'Course ID' },
                { key: 'name', label: 'Course Name' },
                { key: 'instituteId', label: 'Institute ID' },
                { key: 'isActive', label: 'Active Status' },
              ].map((field) => (
                <label key={field.key} className="ia-modal-field-item">
                  <input
                    type="checkbox"
                    checked={importFields[field.key]}
                    onChange={() => setImportFields(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                  />
                  <span className="ia-modal-checkbox"></span>
                  <span>{field.label}</span>
                </label>
              ))}
            </div>

            <label className="ia-modal-file-input">
              <input type="file" accept=".xlsx,.xls" onChange={(e) => setImportFile(e.target.files[0])} />
              <span>{importFile ? importFile.name : 'Choose Excel file...'}</span>
            </label>

            <button className="ia-modal-submit" onClick={handleImportSubmit}>
              Import Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstCourses;

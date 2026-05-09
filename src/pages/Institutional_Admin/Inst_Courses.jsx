import React, { useState, useEffect } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import './inst_courses.css';

const InstCourses = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Import modal fields
  const [importFields, setImportFields] = useState({
    ssn: true,
    firstName: true,
    secondName: true,
    thirdName: true,
    phoneNumber: true,
    email: true,
    gender: true,
  });

  const [importFile, setImportFile] = useState(null);

  // Courses data from backend
  // eslint-disable-next-line no-unused-vars
  const [courses, setCourses] = useState([
    // Sample static course
    {
      id: 1,
      title: 'AI and Machine Learning Essentials',
      image: '',
      instructorName: 'Eslam Taha',
      instructorAvatar: '',
      lectures: 15,
      weeks: 10,
      students: 120,
    },
  ]);

  useEffect(() => {
    // TODO: Fetch courses from backend
    // fetch('/api/inst-admin/courses')
    //   .then(res => res.json())
    //   .then(data => setCourses(data));
  }, []);

  const handleEdit = (id) => {
    console.log('Edit course:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete course:', id);
  };

  const handleAddCourse = () => {
    console.log('Add new course');
  };

  const handleFieldToggle = (field) => {
    setImportFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) setImportFile(file);
  };

  const handleImportSubmit = () => {
    const selectedFields = Object.entries(importFields)
      .filter(([, v]) => v)
      .map(([k]) => k);
    console.log('Import file:', importFile, 'Fields:', selectedFields);
    setShowImportModal(false);
    setImportFile(null);
  };

  const selectedCount = Object.values(importFields).filter(Boolean).length;

  return (
    <div className="ia-layout">
      <button className="ia-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      <div className={`ia-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'ia-sidebar-wrapper open' : 'ia-sidebar-wrapper'}>
        <InstAdminSideBar />
      </div>

      <main className="ia-main-content">
        <header className="ia-header">
          <div className="ia-header-logo">
            <svg className="ia-edu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="ia-edu-text">Edu<span className="ia-nexus-text">Nexus</span></span>
          </div>
          <div className="ia-user-profile">
            <span className="ia-user-role-label">Institutional Admin</span>
            <div className="ia-user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </header>

        <div className="ia-page-content">
          {/* Import / Export */}
          <div className="ia-action-bar">
            <button className="ia-btn-import" onClick={() => setShowImportModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Import data
            </button>
            <button className="ia-btn-export">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Export data
            </button>
          </div>

          <div className="ia-courses-header">
            <h1 className="ia-page-title">Courses</h1>
            <button className="ia-btn-add-course" onClick={handleAddCourse}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Course
            </button>
          </div>

          {/* Course Cards Grid */}
          <div className="ia-courses-grid">
            {courses.length === 0 ? (
              <div className="ia-courses-empty">No courses available yet</div>
            ) : (
              courses.map((course) => (
                <div className="ia-course-card" key={course.id}>
                  <div className="ia-course-image">
                    {course.image ? (
                      <img src={course.image} alt={course.title} />
                    ) : (
                      <div className="ia-course-image-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ia-course-body">
                    <h4 className="ia-course-title">{course.title}</h4>
                    <div className="ia-course-instructor">
                      <div className="ia-course-instructor-avatar">
                        {course.instructorAvatar ? (
                          <img src={course.instructorAvatar} alt={course.instructorName} />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <span>by {course.instructorName}</span>
                      <span className="ia-course-lectures">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        {course.lectures}
                      </span>
                    </div>
                    <div className="ia-course-stats">
                      <span className="ia-course-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        {course.weeks}
                      </span>
                      <span className="ia-course-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {course.students}
                      </span>
                    </div>
                    <div className="ia-course-actions">
                      <button className="ia-course-btn edit" onClick={() => handleEdit(course.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                      <button className="ia-course-btn delete" onClick={() => handleDelete(course.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="ia-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="ia-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <button className="ia-modal-close" onClick={() => setShowImportModal(false)}>✕</button>
              <h2>Choose data type</h2>
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
                <span className="ia-modal-type-desc">Best for data analysis</span>
              </div>
            </div>

            <h3 className="ia-modal-section-title">Fields to include</h3>
            <div className="ia-modal-fields">
              {[
                { key: 'ssn', label: 'SSN' },
                { key: 'firstName', label: 'First Name' },
                { key: 'secondName', label: 'Second Name' },
                { key: 'thirdName', label: 'Third Name' },
                { key: 'phoneNumber', label: 'Phone Number' },
                { key: 'email', label: 'Email' },
                { key: 'gender', label: 'Gender' },
              ].map((field) => (
                <label key={field.key} className="ia-modal-field-item">
                  <input
                    type="checkbox"
                    checked={importFields[field.key]}
                    onChange={() => handleFieldToggle(field.key)}
                  />
                  <span className="ia-modal-checkbox"></span>
                  <span>{field.label}</span>
                </label>
              ))}
            </div>

            <label className="ia-modal-file-input">
              <input type="file" accept=".xlsx,.xls" onChange={handleImportFile} />
              <span>{importFile ? importFile.name : 'Choose Excel file...'}</span>
            </label>

            <div className="ia-modal-ready">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <strong>Ready to export</strong>
                <p>{courses.length} courses be exported with {selectedCount} fields in EXCEL</p>
              </div>
            </div>

            <button className="ia-modal-submit" onClick={handleImportSubmit}>
              Import Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstCourses;

import React, { useState, useEffect } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import './inst_students.css';

const InstStudents = () => {
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

  // Students data from backend
  // eslint-disable-next-line no-unused-vars
  const [students, setStudents] = useState([
    // Sample static row
    {
      id: 1,
      name: 'John Games',
      email: 'johngames042@gmail.com',
      enrolledCourses: 5,
      avatar: '',
    },
  ]);

  useEffect(() => {
    // TODO: Fetch students from backend
    // fetch('/api/inst-admin/students')
    //   .then(res => res.json())
    //   .then(data => setStudents(data));
  }, []);

  const handleFieldToggle = (field) => {
    setImportFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImportSubmit = () => {
    // TODO: Send import to backend
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

          <div className="ia-page-header-section">
            <h1 className="ia-page-title">Student Management</h1>
            <p className="ia-page-subtitle">Manage all students within the system, track their academic levels, view their registered courses, and efficiently handle enrollment operations.</p>
          </div>

          {/* Students Table */}
          <div className="ia-table-card">
            <div className="ia-table-wrapper">
              <table className="ia-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Enrolled Courses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ia-table-empty">No students found</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="ia-person-info">
                            <div className="ia-person-avatar">
                              {student.avatar ? (
                                <img src={student.avatar} alt={student.name} />
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              )}
                            </div>
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td>{student.email}</td>
                        <td>{student.enrolledCourses} Courses</td>
                        <td>
                          <div className="ia-actions">
                            <button className="ia-action-btn edit" title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button className="ia-action-btn delete" title="Delete">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                            <button className="ia-action-btn assign">Assign to Course</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                <p>{students.length} students be exported with {selectedCount} fields in EXCEL</p>
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

export default InstStudents;

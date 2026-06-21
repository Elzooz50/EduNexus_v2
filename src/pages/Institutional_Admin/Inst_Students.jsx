import React, { useState, useEffect } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import apiClient from '../../services/apiClient';
import './inst_students.css';

const InstStudents = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [adminData, setAdminData] = useState({ fullName: '', email: '', instituteId: '', firstName: '' });

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

  // Search
  const [searchId, setSearchId] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searching, setSearching] = useState(false);

  // Assign modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCourseId, setAssignCourseId] = useState('');
  const [assignStudentId, setAssignStudentId] = useState(null);

  // Unassign modal
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [unassignCourseId, setUnassignCourseId] = useState('');
  const [unassignStudentId, setUnassignStudentId] = useState(null);

  // Students data from backend
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    // load admin user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminData({
          fullName: user.fullName || `${user.firstName || ''} ${user.secondName || ''} ${user.thirdName || ''} ${user.lastName || ''}`,
          email: user.email || '',
          instituteId: user.instituteId || '',
          firstName: user.firstName || 'Admin'
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // fetch all students
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        const res = await apiClient.get('/Students');
        const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.students || [];
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents([]);
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
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

  const handleSearch = async () => {
    if (!searchId) return;
    setSearching(true);
    setSearchError(null);
    setSearchedStudent(null);
    try {
      const res = await apiClient.get(`/Students/${encodeURIComponent(searchId)}`);
      const student = res.data?.data || res.data;
      if (!student) {
        setSearchError('Student not found');
      } else {
        setSearchedStudent(student);
      }
    } catch (err) {
      console.error('Search error', err);
      setSearchError(err.response?.data?.message || 'Error searching student');
    } finally {
      setSearching(false);
    }
  };

  const openAssignModal = (studentId) => {
    setAssignStudentId(studentId);
    setAssignCourseId('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!assignCourseId || !assignStudentId) return alert('Course ID required');
    try {
      const res = await apiClient.post(`/Courses/${encodeURIComponent(assignCourseId)}/students/${encodeURIComponent(assignStudentId)}`);
      if (res.data?.success) {
        alert('Student assigned to course successfully');
        // refresh students list
        const refreshed = await apiClient.get('/Students');
        const data = Array.isArray(refreshed.data) ? refreshed.data : refreshed.data?.data || refreshed.data?.students || [];
        setStudents(data);
      } else {
        alert(res.data?.message || 'Failed to assign student to course');
      }
    } catch (err) {
      console.error('Assign error', err);
      alert(err.response?.data?.message || 'Error assigning student');
    } finally {
      setShowAssignModal(false);
    }
  };

  const handleDelete = async (studentId) => {
    setUnassignStudentId(studentId);
    setUnassignCourseId('');
    setShowUnassignModal(true);
  };

  const handleUnassignSubmit = async () => {
    if (!unassignCourseId || !unassignStudentId) return alert('Course ID required');
    try {
      const res = await apiClient.delete(`/Courses/${encodeURIComponent(unassignCourseId)}/students/${encodeURIComponent(unassignStudentId)}`);
      if (res.data?.success) {
        alert('Student unassigned from course successfully');
        const refreshed = await apiClient.get('/Students');
        const data = Array.isArray(refreshed.data) ? refreshed.data : refreshed.data?.data || refreshed.data?.students || [];
        setStudents(data);
      } else {
        alert(res.data?.message || 'Failed to unassign student from course');
      }
    } catch (err) {
      console.error('Unassign error', err);
      alert(err.response?.data?.message || 'Error unassigning student from course');
    } finally {
      setShowUnassignModal(false);
    }
  };

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
            <div className="ia-user-info">
              <span className="ia-user-name">{adminData.fullName || 'Institutional Admin'}</span>
              <span className="ia-user-email">{adminData.instituteId}</span>
            </div>
            <div className="ia-user-avatar">{(adminData.fullName || '').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'IA'}</div>
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
            <div className="ia-search">
              <input
                type="text"
                placeholder="Search student by ID (e.g. stu-alex-002)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="ia-search-btn" onClick={handleSearch} disabled={searching}>{searching ? 'Searching...' : 'Search'}</button>
            </div>
          </div>

          <div className="ia-page-header-section">
            <h1 className="ia-page-title">Student Management</h1>
            <p className="ia-page-subtitle">Manage all students within the system, track their academic levels, view their registered courses, and efficiently handle enrollment operations.</p>
          </div>

          {/* Dynamic header info (admin name + institute id) */}
          <div className="ia-header-inline">
            <div className="ia-admin-name">{adminData.fullName || 'Institutional Admin'}</div>
            <div className="ia-admin-id">{adminData.instituteId}</div>
          </div>

          {/* Search result: show enrolled courses for searched student */}
          {searchedStudent && (
            <div className="ia-search-result">
              <h3>Student: {searchedStudent.fullName || searchedStudent.name || searchedStudent.id}</h3>
              <p>Email: {searchedStudent.email}</p>
              <h4>Enrolled Courses</h4>
              {Array.isArray(searchedStudent.enrolledCourses) && searchedStudent.enrolledCourses.length > 0 ? (
                <ul>
                  {searchedStudent.enrolledCourses.map(c => (
                    <li key={c.id}>{c.name} — {c.id}</li>
                  ))}
                </ul>
              ) : (
                <p>No enrolled courses</p>
              )}
            </div>
          )}
          {searchError && <div className="ia-search-error">{searchError}</div>}

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
                  {studentsLoading ? (
                    <tr>
                      <td colSpan={4} className="ia-table-empty">Loading students...</td>
                    </tr>
                  ) : students.length === 0 ? (
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
                                <img src={student.avatar} alt={student.fullName || student.name} />
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              )}
                            </div>
                            <span>{student.fullName || student.name}</span>
                          </div>
                        </td>
                        <td>{student.email}</td>
                        <td>{Array.isArray(student.enrolledCourses) ? student.enrolledCourses.length : student.enrolledCourses || 0} Courses</td>
                        <td>
                          <div className="ia-actions">
                            <button className="ia-action-btn delete" title="Unassign from Course" onClick={() => handleDelete(student.id)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                            <button className="ia-action-btn assign" onClick={() => openAssignModal(student.id)}>Assign to Course</button>
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

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="ia-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="ia-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <button className="ia-modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
              <h2>Assign Student to Course</h2>
            </div>
            <div style={{marginBottom:12}}>
              <label>Student ID</label>
              <div style={{padding:8,background:'#f9fafb',borderRadius:6}}>{assignStudentId}</div>
            </div>
            <div style={{marginBottom:12}}>
              <label>Course ID</label>
              <input type="text" value={assignCourseId} onChange={(e)=>setAssignCourseId(e.target.value)} placeholder="inst-cairo-0001-C1" />
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="ia-modal-submit" onClick={handleAssignSubmit}>Assign</button>
              <button className="ia-modal-close" onClick={() => setShowAssignModal(false)} style={{background:'#eee',color:'#333'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUnassignModal && (
        <div className="ia-modal-overlay" onClick={() => setShowUnassignModal(false)}>
          <div className="ia-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ia-modal-header">
              <button className="ia-modal-close" onClick={() => setShowUnassignModal(false)}>✕</button>
              <h2>Unassign Student from Course</h2>
            </div>
            <div style={{marginBottom:12}}>
              <label>Student ID</label>
              <div style={{padding:8,background:'#f9fafb',borderRadius:6}}>{unassignStudentId}</div>
            </div>
            <div style={{marginBottom:12}}>
              <label>Course ID</label>
              <input type="text" value={unassignCourseId} onChange={(e)=>setUnassignCourseId(e.target.value)} placeholder="inst-cairo-0001-C1" />
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="ia-modal-submit" onClick={handleUnassignSubmit}>Unassign</button>
              <button className="ia-modal-close" onClick={() => setShowUnassignModal(false)} style={{background:'#eee',color:'#333'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstStudents;

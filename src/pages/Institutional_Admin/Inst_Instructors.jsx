import React, { useEffect, useState } from 'react';
import InstAdminSideBar from '../../components/Institutional_Admin_SideBar/Inst_Admin_SideBar';
import apiClient from '../../services/apiClient';
import './inst_instructors.css';

const InstInstructors = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [adminData, setAdminData] = useState({ fullName: '', email: '', instituteId: '' });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchedInstructor, setSearchedInstructor] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [assignInstructorId, setAssignInstructorId] = useState(null);
  const [assignCourseId, setAssignCourseId] = useState('');
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [unassignInstructorId, setUnassignInstructorId] = useState(null);
  const [unassignCourseId, setUnassignCourseId] = useState('');
  const [importFile, setImportFile] = useState(null);
  const [importFields, setImportFields] = useState({
    ssn: true,
    firstName: true,
    secondName: true,
    thirdName: true,
    phoneNumber: true,
    email: true,
    gender: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminData({
          fullName: user.fullName || [user.firstName, user.secondName, user.thirdName, user.lastName].filter(Boolean).join(' '),
          email: user.email || '',
          instituteId: user.instituteId || '',
        });
      } catch (error) {
        console.error('Error parsing admin user:', error);
      }
    }

    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/Instructors');
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setInstructors(data);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const selectedCount = Object.values(importFields).filter(Boolean).length;

  const refreshInstructors = async () => {
    const response = await apiClient.get('/Instructors');
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    setInstructors(data);
  };

  const handleFieldToggle = (field) => {
    setImportFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (file) setImportFile(file);
  };

  const handleImportSubmit = () => {
    const selectedFields = Object.entries(importFields)
      .filter(([, value]) => value)
      .map(([key]) => key);
    console.log('Import instructors file:', importFile, 'Fields:', selectedFields);
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleSearch = async () => {
    const trimmedId = searchId.trim();
    if (!trimmedId) return;

    setSearching(true);
    setSearchError('');
    setSearchedInstructor(null);

    try {
      const response = await apiClient.get(`/Instructors/${encodeURIComponent(trimmedId)}`);
      const instructor = response.data?.data || response.data;
      if (!instructor) {
        setSearchError('Instructor not found');
      } else {
        setSearchedInstructor(instructor);
      }
    } catch (error) {
      console.error('Error searching instructor:', error);
      setSearchError(error.response?.data?.message || 'Error searching instructor');
    } finally {
      setSearching(false);
    }
  };

  const openAssignModal = (instructorId) => {
    setAssignInstructorId(instructorId);
    setAssignCourseId('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    const trimmedCourseId = assignCourseId.trim();
    if (!trimmedCourseId || !assignInstructorId) return;

    try {
      const response = await apiClient.post(
        `/Courses/${encodeURIComponent(trimmedCourseId)}/instructors/${encodeURIComponent(assignInstructorId)}`
      );
      if (response.data?.success) {
        alert('Instructor assigned to course successfully');
        await refreshInstructors();
      } else {
        alert(response.data?.message || 'Failed to assign instructor to course');
      }
    } catch (error) {
      console.error('Error assigning instructor:', error);
      alert(error.response?.data?.message || 'Error assigning instructor');
    } finally {
      setShowAssignModal(false);
    }
  };

  const handleDelete = async (instructorId) => {
    setUnassignInstructorId(instructorId);
    setUnassignCourseId('');
    setShowUnassignModal(true);
  };

  const handleUnassignSubmit = async () => {
    const trimmedCourseId = unassignCourseId.trim();
    if (!trimmedCourseId || !unassignInstructorId) return;

    try {
      const response = await apiClient.delete(
        `/Courses/${encodeURIComponent(trimmedCourseId)}/instructors/${encodeURIComponent(unassignInstructorId)}`
      );
      if (response.data?.success) {
        alert('Instructor unassigned from course successfully');
        await refreshInstructors();
      } else {
        alert(response.data?.message || 'Failed to unassign instructor from course');
      }
    } catch (error) {
      console.error('Error unassigning instructor:', error);
      alert(error.response?.data?.message || 'Error unassigning instructor from course');
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
            <div className="ia-user-avatar">
              {(adminData.fullName || 'IA')
                .split(' ')
                .filter(Boolean)
                .map((part) => part[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'IA'}
            </div>
          </div>
        </header>

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
                placeholder="Search instructor by ID (e.g. inst-cu-01)"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              />
              <button className="ia-search-btn" onClick={handleSearch} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="ia-page-header-section">
            <h1 className="ia-page-title">Instructors</h1>
            <p className="ia-page-subtitle">Manage all instructors within the system, view their assigned courses, and efficiently handle enrollment operations.</p>
          </div>

          <div className="ia-header-inline">
            <div className="ia-admin-name">{adminData.fullName || 'Institutional Admin'}</div>
            <div className="ia-admin-id">{adminData.instituteId}</div>
          </div>

          {searchedInstructor && (
            <div className="ia-search-result">
              <h3>{searchedInstructor.fullName || searchedInstructor.name || searchedInstructor.id}</h3>
              <p>{searchedInstructor.email}</p>
              <p className="ia-search-meta">ID: {searchedInstructor.id}</p>
              <h4>Assigned Courses</h4>
              {Array.isArray(searchedInstructor.assignedCourses) && searchedInstructor.assignedCourses.length > 0 ? (
                <ul className="ia-result-list">
                  {searchedInstructor.assignedCourses.map((course) => (
                    <li key={course.id}>
                      <span>{course.name}</span>
                      <span>{course.id}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No assigned courses</p>
              )}
            </div>
          )}

          {searchError && <div className="ia-search-error">{searchError}</div>}

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
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="ia-table-empty">Loading instructors...</td>
                    </tr>
                  ) : instructors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ia-table-empty">No instructors found</td>
                    </tr>
                  ) : (
                    instructors.map((inst) => {
                      const courseCount = Array.isArray(inst.assignedCourses) ? inst.assignedCourses.length : 0;
                      return (
                        <tr key={inst.id}>
                          <td>
                            <div className="ia-person-info">
                              <div className="ia-person-avatar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </div>
                              <div>
                                <span>{inst.fullName || inst.name}</span>
                                <div className="ia-entity-id">{inst.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{inst.email}</td>
                          <td>{courseCount} Courses</td>
                          <td>
                            <div className="ia-actions">
                              <button className="ia-action-btn delete" title="Unassign from Course" type="button" onClick={() => handleDelete(inst.id)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                              <button className="ia-action-btn assign" type="button" onClick={() => openAssignModal(inst.id)}>Assign to Course</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showImportModal && (
        <div className="ia-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="ia-modal" onClick={(event) => event.stopPropagation()}>
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
                <strong>Ready to import</strong>
                <p>{instructors.length} instructors can be imported with {selectedCount} selected fields in Excel</p>
              </div>
            </div>

            <button className="ia-modal-submit" onClick={handleImportSubmit}>
              Import Data
            </button>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="ia-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="ia-modal ia-modal--compact" onClick={(event) => event.stopPropagation()}>
            <div className="ia-modal-header">
              <button className="ia-modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
              <h2>Assign Instructor to Course</h2>
            </div>

            <div className="ia-modal-field-block">
              <label>Instructor ID</label>
              <div className="ia-modal-static-value">{assignInstructorId}</div>
            </div>

            <div className="ia-modal-field-block">
              <label htmlFor="assign-course-id">Course ID</label>
              <input
                id="assign-course-id"
                className="ia-modal-input"
                type="text"
                value={assignCourseId}
                onChange={(event) => setAssignCourseId(event.target.value)}
                placeholder="inst-cairo-0001-C1"
              />
            </div>

            <div className="ia-modal-actions-row">
              <button className="ia-modal-submit" type="button" onClick={handleAssignSubmit}>Assign</button>
              <button className="ia-modal-cancel" type="button" onClick={() => setShowAssignModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUnassignModal && (
        <div className="ia-modal-overlay" onClick={() => setShowUnassignModal(false)}>
          <div className="ia-modal ia-modal--compact" onClick={(event) => event.stopPropagation()}>
            <div className="ia-modal-header">
              <button className="ia-modal-close" onClick={() => setShowUnassignModal(false)}>✕</button>
              <h2>Unassign Instructor from Course</h2>
            </div>

            <div className="ia-modal-field-block">
              <label>Instructor ID</label>
              <div className="ia-modal-static-value">{unassignInstructorId}</div>
            </div>

            <div className="ia-modal-field-block">
              <label htmlFor="unassign-course-id">Course ID</label>
              <input
                id="unassign-course-id"
                className="ia-modal-input"
                type="text"
                value={unassignCourseId}
                onChange={(event) => setUnassignCourseId(event.target.value)}
                placeholder="inst-cairo-0001-C1"
              />
            </div>

            <div className="ia-modal-actions-row">
              <button className="ia-modal-submit" type="button" onClick={handleUnassignSubmit}>Unassign</button>
              <button className="ia-modal-cancel" type="button" onClick={() => setShowUnassignModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstInstructors;
// src/hooks/useMeetingAuth.js
// Bridges EduNexus_v2's AuthContext to the shape expected by meeting components

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../services/authStorage';
import { getAuthToken } from '../services/authStorage';

const MEETING_ROLES = {
  [ROLES.SUPER_ADMIN]: 'SuperAdmin',
  [ROLES.INST_ADMIN]: 'Admin',
  [ROLES.INSTRUCTOR]: 'Instructor',
  [ROLES.STUDENT]: 'Student',
};

export function useMeetingAuth() {
  const { user, isAuthenticated } = useAuth();

  const meetingUser = useMemo(() => {
    if (!user) return null;

    const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest';
    const id = user.ssn || user.userId || user.id || '';
    const email = user.email || '';
    const roleId = user.roleId ? Number(user.roleId) : null;
    const roleName = MEETING_ROLES[roleId] || null;
    const roles = roleName ? [roleName] : [];

    return { id, name, email, roles, roleId, roleName };
  }, [user]);

  const isInstructor = useMemo(() => {
    if (!meetingUser) return false;
    return meetingUser.roles.some((r) =>
      r.toLowerCase() === 'instructor' ||
      r.toLowerCase() === 'admin' ||
      r.toLowerCase() === 'superadmin'
    );
  }, [meetingUser]);

  const token = useMemo(() => getAuthToken(), [isAuthenticated]);

  return {
    user: meetingUser,
    isAuthenticated,
    isInstructor,
    token,
  };
}

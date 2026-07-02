// src/pages/Edit_Meeting/Edit_Meeting.jsx
// Redirects to the meeting lobby

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditMeeting() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/lobby');
  }, [navigate]);
  return null;
}

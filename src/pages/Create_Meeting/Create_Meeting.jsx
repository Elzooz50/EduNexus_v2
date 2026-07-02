// src/pages/Create_Meeting/Create_Meeting.jsx
// Redirects to the meeting lobby

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateMeeting() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/lobby');
  }, [navigate]);
  return null;
}

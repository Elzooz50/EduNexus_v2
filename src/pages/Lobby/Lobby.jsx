// src/pages/Lobby/Lobby.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetingAuth } from '../../hooks/useMeetingAuth';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../services/apiClient';

export default function Lobby() {
  const { user, isInstructor } = useMeetingAuth();
  const navigate = useNavigate();

  const [meetingId, setMeetingId] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = () => {
    const id = meetingId.trim();
    if (id) {
      navigate(`/meeting/${id}`);
    }
  };

  const handleCreate = async () => {
    if (!meetingName.trim()) return;
    setIsCreating(true);
    setError(null);

    try {
      const response = await apiClient.post('/Meetings/create', { meetingName });
      const data = response.data;
      if (data.id) {
        navigate(`/meeting/${data.id}?create=1&name=${encodeURIComponent(meetingName)}`);
      } else {
        throw new Error('No meeting ID returned from server');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create meeting');
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          Back to Home
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome, {user.name}</h2>

        {isInstructor && (
          <div className="mb-8 border-b pb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Create a Meeting</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter meeting name..."
              />
              {error && (
                <div className="text-red-600 text-sm font-medium">{error}</div>
              )}
              <button
                onClick={handleCreate}
                disabled={isCreating || !meetingName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Meeting'}
              </button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Join a Meeting</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter meeting ID..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && meetingId.trim()) {
                  handleJoin();
                }
              }}
            />
            <button
              onClick={handleJoin}
              disabled={!meetingId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

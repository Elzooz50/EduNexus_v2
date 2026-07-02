// src/services/meetingApi.js
// Meeting-related API calls (chat, quiz, attachments, recordings)
// Uses the existing apiClient (Axios) for consistency

import apiClient from './apiClient';
import { getAuthToken } from './authStorage';

/**
 * Fetch chat history for a meeting
 * @param {string} meetingId
 * @returns {Promise<import('../types/meeting.js').ChatMessage[]>}
 */
export async function fetchChatHistory(meetingId) {
  const response = await apiClient.get(`/Chat/history/${encodeURIComponent(meetingId)}`);
  return response.data;
}

/**
 * Submit a quiz answer
 * @param {number} questionId
 * @param {string} selectedOption
 * @returns {Promise<any>}
 */
export async function submitQuizAnswer(questionId, selectedOption) {
  const response = await apiClient.post(`/Quiz/questions/${questionId}/answer`, {
    selectedOption,
  });
  return response.data;
}

/**
 * Fetch quiz results for a session
 * @param {number} sessionId
 * @returns {Promise<import('../types/meeting.js').QuizResultsDto>}
 */
export async function fetchQuizResults(sessionId) {
  const response = await apiClient.get(`/Quiz/sessions/${sessionId}/results`);
  return response.data;
}

/**
 * Stop a quiz session
 * @param {number} sessionId
 * @returns {Promise<any>}
 */
export async function stopQuizSession(sessionId) {
  const response = await apiClient.post(`/Quiz/sessions/${sessionId}/stop`);
  return response.data;
}

/**
 * Upload a lecture material (PDF) to a meeting
 * @param {File} file
 * @param {string} meetingId
 * @returns {Promise<import('../types/meeting.js').LectureMaterialDto>}
 */
export async function uploadLectureMaterial(file, meetingId) {
  const fd = new FormData();
  fd.append('file', file);

  const token = getAuthToken();
  const response = await apiClient.post(
    `/Meetings/${encodeURIComponent(meetingId)}/attachments`,
    fd,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  return response.data;
}

/**
 * Fetch meeting materials
 * @param {string} meetingId
 * @returns {Promise<import('../types/meeting.js').LectureMaterialDto[]>}
 */
export async function fetchMeetingMaterials(meetingId) {
  const response = await apiClient.get(`/Meetings/${encodeURIComponent(meetingId)}/attachments`);
  return response.data;
}

/**
 * Upload a meeting recording
 * @param {Blob} blob
 * @param {string} meetingId
 * @param {string} fileName
 * @returns {Promise<any>}
 */
export async function uploadRecording(blob, meetingId, fileName) {
  const fd = new FormData();
  fd.append('File', blob, fileName);
  fd.append('MeetingId', meetingId);

  const token = getAuthToken();
  const response = await apiClient.post('/Recordings/upload', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
}

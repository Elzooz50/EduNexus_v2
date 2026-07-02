// src/services/studentService.js

import apiClient from './apiClient';

/**
 * Fetch full course details for a single course
 * @param {string} courseId
 * @returns {Promise<Object>} Course details
 */
export const fetchCourseDetails = async (courseId) => {
  const response = await apiClient.get(`/Courses/${courseId}`);
  return response.data;
};

/**
 * Fetch all available courses in the system (fallback when student has none)
 * @returns {Promise<Array>} Array of courses
 */
export const fetchAllCourses = async () => {
  const response = await apiClient.get('/Courses');
  return response.data;
};

/**
 * Fetch full details for all courses a student is enrolled in
 * @param {Array} studentCourses - Array of student course enrollment objects from the profile
 * @returns {Promise<Array>} Array of enriched course details
 */
export const fetchAllStudentCourses = async (studentCourses = []) => {
  if (!studentCourses.length) return [];

  // Extract unique course IDs from the studentCourses join objects
  const courseIds = [...new Set(
    studentCourses
      .map(sc => sc.courseId || sc.id)
      .filter(Boolean)
  )];

  // Fetch all courses in parallel, gracefully handle individual failures
  const results = await Promise.allSettled(
    courseIds.map(id => fetchCourseDetails(id))
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => {
      const data = r.value;
      // The API may wrap in { data: ... } or return directly
      return data?.data || data;
    });
};

/**
 * Fetch meeting details by ID
 * @param {string} meetingId
 * @returns {Promise<Object>} Meeting details
 */
export const fetchMeetingDetails = async (meetingId) => {
  const response = await apiClient.get(`/Meetings/${meetingId}`);
  return response.data;
};

/**
 * Fetch all meetings for the student
 * @param {Array} meetings - Array of meeting objects from the profile
 * @returns {Promise<Array>} Array of enriched meeting details
 */
export const fetchAllStudentMeetings = async (meetings = []) => {
  if (!meetings.length) return [];

  const meetingIds = [...new Set(
    meetings
      .map(m => m.meetingId || m.id)
      .filter(Boolean)
  )];

  const results = await Promise.allSettled(
    meetingIds.map(id => fetchMeetingDetails(id))
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => {
      const data = r.value;
      return data?.data || data;
    });
};

// src/services/instructorService.js

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
 * Fetch all available courses in the system (fallback when instructor has none assigned)
 * @returns {Promise<Array>} Array of courses
 */
export const fetchAllCourses = async () => {
  const response = await apiClient.get('/Courses');
  return response.data;
};

/**
 * Fetch full details for all courses an instructor is assigned to
 * @param {Array} courseInstructors - Array of instructor course assignment objects from the profile
 * @returns {Promise<Array>} Array of enriched course details
 */
export const fetchAllInstructorCourses = async (courseInstructors = []) => {
  if (!courseInstructors.length) return [];

  // Extract unique course IDs from the courseInstructors join objects
  const courseIds = [...new Set(
    courseInstructors
      .map(ci => ci.courseId || ci.id)
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
 * Fetch all meetings for the instructor
 * @param {Array} meetings - Array of meeting objects from the profile
 * @returns {Promise<Array>} Array of enriched meeting details
 */
export const fetchAllInstructorMeetings = async (meetings = []) => {
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

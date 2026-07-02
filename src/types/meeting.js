// src/types/meeting.js
// JSDoc type definitions for meeting-related data structures

/**
 * @typedef {Object} ParticipantInfo
 * @property {string} participantId
 * @property {string} fullName
 * @property {boolean} isAudioEnabled
 * @property {boolean} isVideoEnabled
 * @property {boolean} [isScreenSharing]
 * @property {boolean} [isHandRaised]
 */

/**
 * @typedef {Object} ChatMessage
 * @property {number} [id]
 * @property {string} [senderId]
 * @property {string} senderDisplayName
 * @property {string} content
 * @property {string} sentAt
 * @property {string} [SenderDisplayName]
 * @property {string} [Content]
 * @property {string} [SentAt]
 */

/**
 * @typedef {Object} SignalMessage
 * @property {'offer'|'answer'|'candidate'} type
 * @property {string} [from]
 * @property {string} [to]
 * @property {string} [sdp]
 * @property {RTCIceCandidateInit} [candidate]
 */

/**
 * @typedef {Object} QuizQuestionDto
 * @property {number} id
 * @property {string} questionText
 * @property {string} optionA
 * @property {string} optionB
 * @property {string} optionC
 * @property {string} optionD
 */

/**
 * @typedef {Object} QuizResultsDto
 * @property {number} totalAnswers
 * @property {number} correctAnswers
 * @property {number} optionACount
 * @property {number} optionBCount
 * @property {number} optionCCount
 * @property {number} optionDCount
 */

/**
 * @typedef {Object} LectureMaterialDto
 * @property {string} id
 * @property {string} [meetingId]
 * @property {string} fileName
 * @property {string} [title]
 * @property {string} fileUrl
 * @property {string} uploadedAt
 */

/**
 * @typedef {Object} ParticipantJoinedPayload
 * @property {string} participantId
 * @property {string} fullName
 * @property {boolean} isAudioEnabled
 * @property {boolean} isVideoEnabled
 * @property {boolean} isScreenSharing
 * @property {boolean} isHandRaised
 */

/**
 * @typedef {Object} ParticipantLeftPayload
 * @property {string} participantId
 * @property {string} [fullName]
 */

/**
 * @typedef {Object} ParticipantKickedPayload
 * @property {string} participantId
 * @property {string} fullName
 */

/**
 * @typedef {Object} YouWereKickedPayload
 * @property {string} kickedBy
 */

/**
 * @typedef {Object} AllParticipantsMutedPayload
 * @property {string} mutedBy
 */

/**
 * @typedef {Object} MeetingEndedPayload
 * @property {string} endedBy
 */

/**
 * @typedef {Object} MeetingLockToggledPayload
 * @property {boolean} locked
 * @property {string} toggledBy
 */

/**
 * @typedef {Object} ChatToggledPayload
 * @property {boolean} enabled
 * @property {string} toggledBy
 */

/**
 * @typedef {Object} ParticipantHandRaisedPayload
 * @property {string} participantId
 * @property {string} fullName
 * @property {boolean} raised
 */

/**
 * @typedef {Object} ParticipantReactionPayload
 * @property {string} emoji
 * @property {string} fullName
 */

/**
 * @typedef {Object} QuizStartedPayload
 * @property {number} sessionId
 * @property {string} meetingId
 * @property {string} status
 * @property {string|null} startedAt
 * @property {QuizQuestionDto[]} questions
 */

/**
 * @typedef {Object} QuizEndedPayload
 * @property {number} sessionId
 */

/**
 * @typedef {Object} LectureMaterialAttachedPayload
 * @property {string} fileName
 * @property {string} fileUrl
 */

/**
 * @typedef {Object} RemoteStreamEntry
 * @property {string} participantId
 * @property {MediaStream} stream
 */

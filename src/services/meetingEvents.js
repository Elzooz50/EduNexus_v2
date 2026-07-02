// src/services/meetingEvents.js
// SignalR event names — single source of truth for both client and server.
// Keep this in sync with backend/Hubs/MeetingHub.cs

export const HubEvents = {
  ParticipantJoined: 'ParticipantJoined',
  ParticipantLeft: 'ParticipantLeft',
  ExistingParticipants: 'ExistingParticipants',

  ParticipantAudioToggled: 'ParticipantAudioToggled',
  ParticipantVideoToggled: 'ParticipantVideoToggled',
  ScreenSharingStarted: 'ScreenSharingStarted',
  ScreenSharingStopped: 'ScreenSharingStopped',
  UserScreenSharing: 'UserScreenSharing',

  ParticipantHandRaised: 'ParticipantHandRaised',
  ParticipantReaction: 'ParticipantReaction',
  ParticipantKicked: 'ParticipantKicked',
  YouWereKicked: 'YouWereKicked',
  AllParticipantsMuted: 'AllParticipantsMuted',

  MeetingEnded: 'MeetingEnded',
  MeetingLockToggled: 'MeetingLockToggled',
  ChatToggled: 'ChatToggled',

  ReceiveChatMessage: 'ReceiveChatMessage',
  ReceiveMessage: 'ReceiveMessage',

  QuizStarted: 'QuizStarted',
  QuizEnded: 'QuizEnded',
  QuizResultsUpdated: 'QuizResultsUpdated',

  LectureMaterialAttached: 'LectureMaterialAttached',

  ReceiveSignal: 'ReceiveSignal',
  ReceiveScreenSharingSignal: 'ReceiveScreenSharingSignal',

  SfuProducerCreated: 'SfuProducerCreated',
  SfuProducerClosed: 'SfuProducerClosed',
};

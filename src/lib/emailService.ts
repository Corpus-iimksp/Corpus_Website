import { useStore } from './store';

// Helper to log and trigger an in-app notification representing the email
const dispatchMockEmail = (subject: string, to: string, content: string) => {
  console.log(`[SendGrid Email Sent]\nFrom: teamcorpus@iimkashipur.ac.in\nTo: ${to}\nSubject: ${subject}\nBody:\n${content}\n-------------------`);
};

export const emailService = {
  sendApprovalEmail: (studentName: string, studentEmail: string, mentorName: string, time: string, zoomLink: string) => {
    const subject = 'Mentorship Session Approved';
    const content = `Hi ${studentName},\n\nYour mentorship request with ${mentorName} has been approved!\n\nDetails:\n- Time: ${time}\n- Zoom Join Link: ${zoomLink}\n\nGood luck with your preparation!\n\nBest,\nTeam CORPUS`;
    dispatchMockEmail(subject, studentEmail, content);
  },

  sendRejectionEmail: (studentName: string, studentEmail: string, mentorName: string) => {
    const subject = 'Mentorship Request Update';
    const content = `Hi ${studentName},\n\nUnfortunately, your requested mentoring session with ${mentorName} could not be scheduled at this time. Please browse other slots or mentors.\n\nBest,\nTeam CORPUS`;
    dispatchMockEmail(subject, studentEmail, content);
  },

  sendSessionConfirmationEmail: (studentName: string, studentEmail: string, mentorName: string, mentorEmail: string, time: string, zoomLink: string) => {
    const zoomId = zoomLink.split('/').pop() || 'N/A';
    
    // To student
    const studentSubject = 'Mentorship Session Confirmed';
    const studentContent = `Hi ${studentName},\n\nYour session with ${mentorName} is confirmed for ${time}.\nZoom Link: ${zoomLink}\nZoom Meeting ID: ${zoomId}\n\nPrepare your questions and pitch deck beforehand.`;
    dispatchMockEmail(studentSubject, studentEmail, studentContent);

    // To mentor
    const mentorSubject = 'Mentorship Session Booked';
    const mentorContent = `Hi ${mentorName},\n\nYou have a confirmed mentoring session with ${studentName} on ${time}.\nZoom Link: ${zoomLink}\nZoom Meeting ID: ${zoomId}\n\nPlease join the meeting on time.`;
    dispatchMockEmail(mentorSubject, mentorEmail, mentorContent);
  },

  sendRescheduleEmail: (studentName: string, studentEmail: string, mentorName: string, newTime: string) => {
    const subject = 'Session Rescheduled';
    const content = `Hi ${studentName},\n\nYour mentorship session with ${mentorName} has been rescheduled to a new time: ${newTime}.\n\nPlease check your student dashboard for details.\n\nBest,\nTeam CORPUS`;
    dispatchMockEmail(subject, studentEmail, content);
  },

  sendMentorApprovalEmail: (mentorName: string, mentorEmail: string) => {
    const subject = 'Mentor Application Approved';
    const content = `Welcome to the CORPUS Mentor Network, ${mentorName}!\n\nYour application has been approved by the Admin team. Your profile is now live, and students can view your accomplishments and book slots.\n\nPlease log in to set up your availability.\n\nBest,\nTeam CORPUS`;
    dispatchMockEmail(subject, mentorEmail, content);
  }
};

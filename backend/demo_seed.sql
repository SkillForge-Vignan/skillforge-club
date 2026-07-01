
-- EVENTS
insert into events (title, description, date, time, venue, category, capacity, registered, tags, is_active) values
  ('Web Dev Bootcamp', 'Learn HTML, CSS, JS from scratch in one day.', '2025-08-10', '10:00 AM', 'Lab 101', 'Web Development', 100, 45, '{"html","css","javascript"}', true),
  ('AI & ML Workshop', 'Hands-on session on machine learning basics.', '2025-08-20', '2:00 PM', 'Seminar Hall', 'AI/ML', 80, 60, '{"python","ml","ai"}', true),
  ('Hackathon 2025', '24-hour coding competition. Build something amazing!', '2025-09-05', '9:00 AM', 'Main Auditorium', 'Hackathon', 200, 120, '{"hackathon","coding","teamwork"}', true);

-- PROJECTS
insert into projects (title, description, tech_stack, github_url, category, team_members, status, featured) values
  ('SkillForge Portal', 'Student skill tracking and mentorship platform.', '{"React","Node.js","Supabase"}', 'https://github.com/skillforge/portal', 'Web Development', '{"Alice","Bob","Charlie"}', 'In Progress', true),
  ('Campus AI Bot', 'AI chatbot for answering campus-related queries.', '{"Python","FastAPI","OpenAI"}', 'https://github.com/skillforge/ai-bot', 'AI/ML', '{"David","Eve"}', 'Completed', true),
  ('Event Manager App', 'Mobile app to manage and track college events.', '{"React Native","Firebase"}', 'https://github.com/skillforge/event-app', 'Mobile', '{"Frank","Grace"}', 'In Progress', false);

-- TEAM MEMBERS
insert into team_members (name, role, department, year, bio, linkedin, github, "order") values
  ('Arjun Sharma', 'President', 'Computer Science', '4th Year', 'Passionate about full-stack development and open source.', 'https://linkedin.com/in/arjun', 'https://github.com/arjun', 1),
  ('Priya Nair', 'Vice President', 'Information Technology', '3rd Year', 'AI/ML enthusiast and competitive programmer.', 'https://linkedin.com/in/priya', 'https://github.com/priya', 2),
  ('Rahul Verma', 'Tech Lead', 'Computer Science', '4th Year', 'Backend developer with expertise in Node.js and databases.', 'https://linkedin.com/in/rahul', 'https://github.com/rahul', 3),
  ('Sneha Patel', 'Design Lead', 'IT', '3rd Year', 'UI/UX designer who loves creating beautiful interfaces.', 'https://linkedin.com/in/sneha', 'https://github.com/sneha', 4);

-- ANNOUNCEMENTS
insert into announcements (title, body, type, is_pinned) values
  ('Welcome to SkillForge 2025!', 'We are excited to kick off the new academic year. Register for upcoming events and start your learning journey.', 'general', true),
  ('Hackathon Registrations Open', 'Registrations for Hackathon 2025 are now open. Form a team of 2-4 and register before August 30th.', 'event', true),
  ('New Mentors Onboarded', 'We have onboarded 5 new industry mentors this semester. Check the mentor section in your portal.', 'general', false);

-- USERS (students for demo)
insert into users (name, email, password, role) values
  ('Demo Student', 'student@skillforge.club', '$2a$10$abcdefghijklmnopqrstuuVGZzQwErTyUiOpAsDfGhJkLzXcVbNm2', 'student'),
  ('Demo Mentor', 'mentor@skillforge.club', '$2a$10$abcdefghijklmnopqrstuuVGZzQwErTyUiOpAsDfGhJkLzXcVbNm2', 'mentor');

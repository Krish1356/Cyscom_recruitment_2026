import { PrismaClient, DepartmentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old QuestionBank entries...");
  await prisma.questionBank.deleteMany({});

  console.log("Seeding Social Media...");
  const socialMedia = [
    "What software or app do you edit on?",
    "What experience do you have with social media management and video editing?",
    "Take a look at cyscom's instagram page and tell us 2 things that we can improve to make our page better?",
    "Any previous work ? if so then attach it",
    "How good are you in making short form content scripts for marketing or promoting an event?",
    "Which social media platforms are you most active on?",
    "How do you stay updated with the latest social media trends?"
  ];
  for (const q of socialMedia) {
    await prisma.questionBank.create({ data: { department: "SOCIAL_MEDIA", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Event Management...");
  const eventManagement = [
    "Describe situation where u organized or coordinated an event in school",
    "What qualities do u think are most imp for someone in em? Which of those do u possess",
    "30mins before an event starts only two of the 10 volunteers show up what do u do",
    "10 mins before an event chief guest stuck in traffic",
    "Would you rather be the person on stage or the one making everything run behind the scenes? Why",
    "What's the best advertisement you've seen recently, and why did it work?"
  ];
  for (const q of eventManagement) {
    await prisma.questionBank.create({ data: { department: "EVENT_MANAGEMENT", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Design...");
  const design = [
    "What Software application do you use for designing?",
    "Do you have any past experience in designing?",
    "If CYSCOM had a mascot, what would it be and why?",
    "If we assign you a task and you are not able to complete it before due time then what will you do?",
    "Have you ever gotten feedback you disagreed with? How did you handle that?",
    "Can you can upload design or portfolio or something like that? attach link"
  ];
  for (const q of design) {
    await prisma.questionBank.create({ data: { department: "DESIGN", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Outreach...");
  const outreach = [
    "You’ve sent 20 messages and gotten exactly 0 replies. What’s your next move?",
    "CYSCOM is conducting a Web Exploitation Workshop. Write one promotional line for each:\nA. A hardcore CTF player\nB. A first-year student who knows nothing about cybersecurity\nC. Someone who thinks cybersecurity isn't for them\n\nYou cannot use the same pitch twice.",
    "You have to get another VIT club to collaborate with CYSCOM for an event. They already have:\n- bigger Instagram following\n- more members\n- better-known events\nYou have no budget and they aren't particularly interested in cybersecurity. How would you convince them to collaborate?",
    "How would you approach a company you've never contacted before?",
    "One huge sponsor or five smaller sponsors? Explain the reason.",
    "A company replies:\n\"Why should we sponsor a college cybersecurity club when we can spend that money on a much bigger tech event?\"\nWhat would you reply?",
    "If you could get one person/company to say “YES” to us instantly, who would it be and why?"
  ];
  for (const q of outreach) {
    await prisma.questionBank.create({ data: { department: "OUTREACH", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Web Dev (General)...");
  const webDevGen = [
    "Why do you wanna join CYSCOM, especially the Dev Dept?",
    "What are tech stacks you know about? Have you worked on any projects in the past?",
    "Have you built any websites or personal projects? Tell us about your favorite one.",
    "What's the biggest challenge you've faced while developing something?",
    "Imagine a feature isn't working right before deployment. What would you do?"
  ];
  for (const q of webDevGen) {
    await prisma.questionBank.create({ data: { department: "WEB_DEVELOPMENT", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Web Dev (Timed)...");
  const webDevTimed = [
    { q: "Which protocol should be used to securely transmit login credentials?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], answer: "HTTPS" },
    { q: "Which is the safest place to store a user's password?", options: ["Plain text", "Encrypted", "Hashed", "Base64 encoded"], answer: "Hashed" },
    { q: "Which response leaks the least information?", options: ["Password is incorrect.", "Username doesn't exist.", "Invalid username or password.", "Try another username."], answer: "Invalid username or password." },
    { q: "You accidentally commit an API key to GitHub. What should you do FIRST?", options: ["Delete the repository.", "Change (rotate) the API key immediately.", "Rename the file.", "Ignore it if the repository is private."], answer: "Change (rotate) the API key immediately." },
    { q: "A login page allows unlimited password attempts. What vulnerability does this create?", options: ["XSS", "Brute-force attack", "Clickjacking", "DNS Spoofing"], answer: "Brute-force attack" },
    { q: "Your website works perfectly, but a dependency has a known critical security vulnerability. What should you prioritize?", options: ["Ignore it until users complain.", "Update or patch the dependency after testing.", "Redesign the UI first.", "Hide the warning."], answer: "Update or patch the dependency after testing." },
    { q: "You find a bug that exposes another user's data. What's your first action?", options: ["Share it with friends.", "Report it responsibly to the team.", "Ignore it.", "Post it on social media."], answer: "Report it responsibly to the team." }
  ];
  for (const item of webDevTimed) {
    await prisma.questionBank.create({ data: { department: "WEB_DEVELOPMENT", type: "TIMED", title: "MCQ Question", description: item.q, content: { options: item.options, answer: item.answer } } });
  }

  console.log("Seeding Technical (General)...");
  const techGen = [
    "Why do you want to join the Technical Department?",
    "Have you ever participated in a CTF? If yes, tell us about your experience. If not, what do you know about CTFs?",
    "How do you approach learning something completely new?",
    "Imagine If a website behaves unexpectedly, what kinds of things would you investigate first?",
    "If Google didn't exist for a day, how would you solve technical problems?",
    "What motivates you more: winning competitions or learning new things?"
  ];
  for (const q of techGen) {
    await prisma.questionBank.create({ data: { department: "TECHNICAL", type: "GENERAL", title: "General Question", content: q } });
  }

  console.log("Seeding Technical (Timed)...");
  const techTimed = [
    "You've been given a CTF challenge and have 30 minutes. What do you prioritize first?\nA. Trying random tools immediately\nB. Understanding the challenge statement\nC. Searching for write-ups before attempting\nD. Writing your own script from scratch",
    "A challenge gives almost no information. Your first instinct is to:\nA. Gather as much information as possible\nB. Guess the answer\nC. Search the exact title online\nD. Skip immediately",
    "A challenge behaves differently than expected. Your first assumption is:\nA. The challenge is broken\nB. I'm missing some information\nC. The organizers made a mistake\nD. My laptop is faulty",
    "You're given a webpage that simply says: 'Access Denied'. What do you investigate first?\nA. HTTP headers\nB. Page source\nC. Cookies\nD. Network requests",
    "You're given a CTF challenge with only the following: challenge.zip, password.txt, README.md. The password.txt file contains: 'The password is not in this file.' What would you do first?\nA. Ignore password.txt completely.\nB. Check whether the statement itself is a clue or misdirection.\nC. Delete password.txt.\nD. Search online for the password."
  ];
  for (const q of techTimed) {
    await prisma.questionBank.create({ data: { department: "TECHNICAL", type: "TIMED", title: "Timed Question", content: q } });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

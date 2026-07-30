import { DepartmentType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Cleaning up old question bank data...");
  await prisma.question.deleteMany();
  await prisma.questionBank.deleteMany();

  console.log("Seeding new question bank data...");

  // ==========================================
  // SOCIAL MEDIA (GENERAL)
  // ==========================================
  const smQuestions = [
    { title: "Software/App", content: "What software or app do you edit on?" },
    { title: "Experience", content: "What experience do you have with social media management and video editing?" },
    { title: "IG Page Review", content: "Take a look at cyscom's instagram page and tell us 2 things that we can improve to make our page better?" },
    { title: "Previous Work", content: "Any previous work ? if so then attach it" },
    { title: "Script Writing", content: "How good are you in making short form content scripts for marketing or promoting an event?" }
  ];
  for (const q of smQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.SOCIAL_MEDIA,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER",
        difficulty: 1,
        points: 10,
        content: {},
      }
    });
  }

  // ==========================================
  // EVENT MANAGEMENT (GENERAL)
  // ==========================================
  const emQuestions = [
    { title: "Past Experience", content: "Describe situation where u organized or coordinated an event in school" },
    { title: "Qualities", content: "What qualities do u think are most imp for someone in em? Which of those do u possess" },
    { title: "Volunteer Crisis", content: "30mins before an event starts only two of the 10 volunteers show up what do u do" },
    { title: "Chief Guest Delay", content: "10 mins before an event chief guest stuck in traffic" },
    { title: "Stage vs Behind-scenes", content: "Would you rather be the person on stage or the one making everything run behind the scenes? Why" },
    { title: "Best Advertisement", content: "What's the best advertisement you've seen recently, and why did it work?" }
  ];
  for (const q of emQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.EVENT_MANAGEMENT,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER",
        difficulty: 1,
        points: 10,
        content: {},
      }
    });
  }

  // ==========================================
  // DESIGN (GENERAL)
  // ==========================================
  const designQuestions = [
    { title: "Software Application", content: "What Software application do you use for designing?" },
    { title: "Past Experience", content: "Do you have any past experience in designing?" },
    { title: "Mascot Design", content: "If CYSCOM had a mascot, what would it be and why?" },
    { title: "Missing Deadline", content: "If we assign you a task and you are not able to complete it before due time then what will you do?" },
    { title: "Handling Feedback", content: "Have you ever gotten feedback you disagreed with? How did you handle that?" },
    { title: "Portfolio", content: "Can you can upload design or portfolio or something like that? attach link" }
  ];
  for (const q of designQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.DESIGN,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER",
        difficulty: 1,
        points: 10,
        content: {},
      }
    });
  }

  // ==========================================
  // WEB DEV (GENERAL + TIMED MCQ)
  // ==========================================
  const webGenQuestions = [
    { title: "Motivation", content: "Why do you wanna join CYSCOM, especially the Dev Dept?" },
    { title: "Tech Stacks", content: "What are tech stacks you know about? Have you worked on any projects in the past?" },
    { title: "Past Projects", content: "Have you built any websites or personal projects? Tell us about your favorite one." },
    { title: "Biggest Challenge", content: "What's the biggest challenge you've faced while developing something?" },
    { title: "Broken Feature", content: "Imagine a feature isn't working right before deployment. What would you do?" }
  ];
  for (const q of webGenQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.WEB_DEVELOPMENT,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER",
        difficulty: 1,
        points: 10,
        content: {},
      }
    });
  }

  const webMCQs = [
    {
      title: "Secure Transmission",
      description: "Which protocol should be used to securely transmit login credentials?",
      options: ["HTTP", "HTTPS", "FTP", "SMTP"],
      answer: "HTTPS"
    },
    {
      title: "Password Storage",
      description: "Which is the safest place to store a user's password?",
      options: ["Plain text", "Encrypted", "Hashed", "Base64 encoded"],
      answer: "Hashed"
    },
    {
      title: "Information Leakage",
      description: "Which response leaks the least information?",
      options: ["Password is incorrect.", "Username doesn't exist.", "Invalid username or password.", "Try another username."],
      answer: "Invalid username or password."
    },
    {
      title: "GitHub API Key Leak",
      description: "You accidentally commit an API key to GitHub. What should you do FIRST?",
      options: ["Delete the repository.", "Change (rotate) the API key immediately.", "Rename the file.", "Ignore it if the repository is private."],
      answer: "Change (rotate) the API key immediately."
    },
    {
      title: "Unlimited Login Attempts",
      description: "A login page allows unlimited password attempts. What vulnerability does this create?",
      options: ["XSS", "Brute-force attack", "Clickjacking", "DNS Spoofing"],
      answer: "Brute-force attack"
    },
    {
      title: "Dependency Vulnerability",
      description: "Your website works perfectly, but a dependency has a known critical security vulnerability. What should you prioritize?",
      options: ["Ignore it until users complain.", "Update or patch the dependency after testing.", "Redesign the UI first.", "Hide the warning."],
      answer: "Update or patch the dependency after testing."
    },
    {
      title: "Bug Disclosure",
      description: "You find a bug that exposes another user's data. What's your first action?",
      options: ["Share it with friends.", "Report it responsibly to the team.", "Ignore it.", "Post it on social media."],
      answer: "Report it responsibly to the team."
    }
  ];
  for (const q of webMCQs) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.WEB_DEVELOPMENT,
        title: q.title,
        description: q.description,
        type: "MCQ",
        difficulty: 2,
        points: 5,
        content: { options: q.options }, // UI uses content.options for MCQ
      }
    });
  }

  // ==========================================
  // TECH (GENERAL + TIMED SHORT ANSWER)
  // ==========================================
  const techGenQuestions = [
    { title: "Motivation", content: "Why do you want to join the Technical Department?" },
    { title: "CTF Experience", content: "Have you ever participated in a CTF? If yes, tell us about your experience. If not, what do you know about CTFs?" },
    { title: "Learning Approach", content: "How do you approach learning something completely new?" },
    { title: "Investigating Bugs", content: "Imagine If a website behaves unexpectedly, what kinds of things would you investigate first?" },
    { title: "No-Google Scenario", content: "If Google didn't exist for a day, how would you solve technical problems?" },
    { title: "Motivation Factor", content: "What motivates you more: winning competitions or learning new things?" }
  ];
  for (const q of techGenQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.TECHNICAL,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER",
        difficulty: 1,
        points: 10,
        content: {},
      }
    });
  }

  const techShortQuestions = [
    {
      title: "CTF Prioritization",
      content: "You've been given a CTF challenge and have 30 minutes.\n\nWhat do you prioritize first?\nA. Trying random tools immediately\nB. Understanding the challenge statement\nC. Searching for write-ups before attempting\nD. Writing your own script from scratch\n\n(Write your preferred answer A/B/C/D)"
    },
    {
      title: "No Information Scenario",
      content: "A challenge gives almost no information.\nYour first instinct is to:\nA. Gather as much information as possible\nB. Guess the answer\nC. Search the exact title online\nD. Skip immediately\n\n(Write your preferred answer A/B/C/D)"
    },
    {
      title: "Unexpected Behavior",
      content: "A challenge behaves differently than expected.\nYour first assumption is:\nA. The challenge is broken\nB. I'm missing some information\nC. The organizers made a mistake\nD. My laptop is faulty\n\n(Write your preferred answer A/B/C/D)"
    },
    {
      title: "Access Denied",
      content: "You're given a webpage that simply says:\nAccess Denied\n\nWhat do you investigate first?\nA. HTTP headers\nB. Page source\nC. Cookies\nD. Network requests\n\n(Write your preferred answer A/B/C/D)"
    },
    {
      title: "Misdirection",
      content: "You're given a CTF challenge with only the following:\nchallenge.zip\npassword.txt\nREADME.md\n\nThe password.txt file contains: 'The password is not in this file.'\nWhat would you do first?\nA. Ignore password.txt completely.\nB. Check whether the statement itself is a clue or misdirection.\nC. Delete password.txt.\nD. Search online for the password.\n\n(Write your preferred answer A/B/C/D)"
    }
  ];
  for (const q of techShortQuestions) {
    await prisma.questionBank.create({
      data: {
        department: DepartmentType.TECHNICAL,
        title: q.title,
        description: q.content,
        type: "LONG_ANSWER", // Keeping as LONG_ANSWER so user gets a text box to type in
        difficulty: 2,
        points: 5,
        content: {},
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

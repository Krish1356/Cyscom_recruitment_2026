import { DepartmentType } from '@prisma/client';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Seeding Outreach questions...");

  // Q1
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 1 - Persistence",
      description: "You’ve sent 20 messages and gotten exactly 0 replies. What’s your next move?",
      type: "LONG_ANSWER",
      difficulty: 1,
      points: 10,
      content: {}
    }
  });

  // Q2 (multi-part)
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 2 - Promotional Lines",
      description: "CYSCOM is conducting a Web Exploitation Workshop.\n\nWrite one promotional line for each:\n\nA. A hardcore CTF player\n\nB. A first-year student who knows nothing about cybersecurity\n\nC. Someone who thinks cybersecurity isn't for them\n\nYou cannot use the same pitch twice.",
      type: "MULTI_SHORT_ANSWER",
      difficulty: 2,
      points: 15,
      content: {
        subQuestions: [
          "HARDCORE CTF PLAYER",
          "FIRST-YEAR STUDENT",
          "SOMEONE WHO THINKS CYBERSECURITY ISN'T FOR THEM"
        ]
      }
    }
  });

  // Q3
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 3 - Collaboration",
      description: "You have to get another VIT club to collaborate with CYSCOM for an event.\n\nThey already have:\n- bigger Instagram following\n- more members\n- better-known events\n\nYou have no budget and they aren't particularly interested in cybersecurity.\n\nHow would you convince them to collaborate?",
      type: "LONG_ANSWER",
      difficulty: 2,
      points: 15,
      content: {}
    }
  });

  // Q4
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 4 - Cold Outreach",
      description: "How would you approach a company you've never contacted before?",
      type: "LONG_ANSWER",
      difficulty: 1,
      points: 10,
      content: {}
    }
  });

  // Q5
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 5 - Sponsorship Strategy",
      description: "One huge sponsor or five smaller sponsors? Explain the reason.",
      type: "LONG_ANSWER",
      difficulty: 2,
      points: 15,
      content: {}
    }
  });

  // Q6
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 6 - Objection Handling",
      description: "A company replies: \"Why should we sponsor a college cybersecurity club when we can spend that money on a much bigger tech event?\" What would you reply?",
      type: "LONG_ANSWER",
      difficulty: 2,
      points: 15,
      content: {}
    }
  });

  // Q7
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.OUTREACH,
      title: "Outreach 7 - Ambition",
      description: "If you could get one person/company to say “YES” to us instantly, who would it be and why?",
      type: "LONG_ANSWER",
      difficulty: 1,
      points: 10,
      content: {}
    }
  });

  console.log("Outreach questions seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

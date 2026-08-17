import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Replacing Technical (Timed) questions with MCQs...");
  
  // 0. Delete referencing Question records first
  const techBanks = await prisma.questionBank.findMany({
    where: { department: "TECHNICAL", type: "TIMED" }
  });
  
  await prisma.question.deleteMany({
    where: {
      questionBankId: { in: techBanks.map(qb => qb.id) }
    }
  });

  // 1. Delete all existing TIMED Technical questions in the QuestionBank
  await prisma.questionBank.deleteMany({
    where: {
      department: "TECHNICAL",
      type: "TIMED"
    }
  });

  // 2. Insert new MCQ formatted questions
  const techTimed = [
    { q: "You've been given a CTF challenge and have 30 minutes. What do you prioritize first?", options: ["Trying random tools immediately", "Understanding the challenge statement", "Searching for write-ups before attempting", "Writing your own script from scratch"], answer: "Understanding the challenge statement" },
    { q: "A challenge gives almost no information. Your first instinct is to:", options: ["Gather as much information as possible", "Guess the answer", "Search the exact title online", "Skip immediately"], answer: "Gather as much information as possible" },
    { q: "A challenge behaves differently than expected. Your first assumption is:", options: ["The challenge is broken", "I'm missing some information", "The organizers made a mistake", "My laptop is faulty"], answer: "I'm missing some information" },
    { q: "You're given a webpage that simply says: 'Access Denied'. What do you investigate first?", options: ["HTTP headers", "Page source", "Cookies", "Network requests"], answer: "Page source" },
    { q: "You're given a CTF challenge with only the following: challenge.zip, password.txt, README.md. The password.txt file contains: 'The password is not in this file.' What would you do first?", options: ["Ignore password.txt completely.", "Check whether the statement itself is a clue or misdirection.", "Delete password.txt.", "Search online for the password."], answer: "Check whether the statement itself is a clue or misdirection." }
  ];

  for (const item of techTimed) {
    await prisma.questionBank.create({
      data: { 
        department: "TECHNICAL", 
        type: "TIMED", 
        title: "MCQ Question", 
        description: item.q, 
        content: { options: item.options, answer: item.answer } 
      }
    });
  }

  console.log("Success! Technical Timed questions updated to MCQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

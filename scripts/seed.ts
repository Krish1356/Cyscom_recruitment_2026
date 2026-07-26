import "dotenv/config";
import { DepartmentType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding question bank...");

  // Technical Department
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.TECHNICAL,
      title: "Linux File Permissions",
      description: "Explain what chmod 755 means.",
      type: "LONG_ANSWER",
      difficulty: 1,
      points: 10,
      content: { text: "What do the numbers in 'chmod 755' represent in Linux? Break down the permissions for each user class." },
      hints: ["Think about Read, Write, and Execute values (4, 2, 1)."],
    }
  });

  await prisma.questionBank.create({
    data: {
      department: DepartmentType.TECHNICAL,
      title: "Reverse Engineering Basics",
      description: "Find the flag in the provided binary.",
      type: "CTF",
      difficulty: 3,
      points: 50,
      content: { text: "We have intercepted a suspicious executable. Reverse engineer it and find the hidden string.", downloadUrl: "https://example.com/dummy.exe" },
      hints: ["Try using the 'strings' command first.", "Ghidra might be useful."],
      flag: "CYSCOM{r3v3rs3_3ng1n33r1ng_1s_fun}"
    }
  });

  // Web Development
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.WEB_DEVELOPMENT,
      title: "React Component Lifecycle",
      description: "Explain useEffect.",
      type: "LONG_ANSWER",
      difficulty: 2,
      points: 15,
      content: { text: "Explain how the useEffect hook works in React, and how it replaces the old class-based lifecycle methods (componentDidMount, etc.)." },
      hints: [],
    }
  });

  await prisma.questionBank.create({
    data: {
      department: DepartmentType.WEB_DEVELOPMENT,
      title: "Reverse a String",
      description: "Write a function to reverse a string.",
      type: "CODING",
      difficulty: 1,
      points: 20,
      content: { 
        text: "Write a JavaScript function that takes a string and returns the reversed version of it.",
        initialCode: "function reverseString(str) {\n  // Your code here\n}"
      },
      hints: ["You can split the string into an array, reverse the array, and join it back."],
    }
  });

  // Design
  await prisma.questionBank.create({
    data: {
      department: DepartmentType.DESIGN,
      title: "Color Theory",
      description: "Explain complementary colors.",
      type: "LONG_ANSWER",
      difficulty: 1,
      points: 10,
      content: { text: "What are complementary colors in color theory, and why are they used in UI design? Provide an example." },
      hints: [],
    }
  });

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

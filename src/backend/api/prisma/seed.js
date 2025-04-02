import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data first (optional)
  try {
    await prisma.appointment.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.mentor.deleteMany({});
    console.log('Database cleared');
  } catch (e) {
    console.error('Error clearing database:', e);
  }

  // Create mock mentors
  const mentors = [
    {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      Password: await bcrypt.hash('password123', 10),
      Specialization: 'UI/UX Design',
      Availability: 'Weekdays'
    },
    {
      FirstName: 'Jane',
      LastName: 'Smith',
      Email: 'jane@example.com',
      Password: await bcrypt.hash('password123', 10),
      Specialization: 'Full Stack Development',
      Availability: 'Evenings'
    },
    {
      FirstName: 'Alex',
      LastName: 'Johnson',
      Email: 'alex@example.com',
      Password: await bcrypt.hash('password123', 10),
      Specialization: 'Mobile Development',
      Availability: 'Weekends'
    },
    {
      FirstName: 'Sarah',
      LastName: 'Williams',
      Email: 'sarah@example.com',
      Password: await bcrypt.hash('password123', 10),
      Specialization: 'Data Science',
      Availability: 'Mornings'
    }
  ];

  // Create a demo student
  const demoStudent = {
    FirstName: 'Demo',
    LastName: 'Student',
    Email: 'demo@example.com',
    Password: await bcrypt.hash('password123', 10),
    TargetSchool: 'Demo University',
    Track: 'Web Development'
  };

  for (const mentor of mentors) {
    await prisma.mentor.create({
      data: mentor
    });
  }

  await prisma.student.create({
    data: demoStudent
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

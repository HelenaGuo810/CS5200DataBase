import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.create({
    data: {
      FirstName: 'Lucas',
      LastName: 'Wang',
      TargetSchool: 'RISD',
      Track: 'UI/UX',
      Email: 'lucas@example.com',
      Password: 'test1234'
    }
  });

  const mentor = await prisma.mentor.create({
    data: {
      FirstName: 'Emily',
      LastName: 'Chen',
      Specialization: 'Portfolio Review',
      Availability: 'Weekends',
      Email: 'emily.chen@example.com',
      Password: 'test1234'
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      StudentID: student.StudentID,
      MentorID: mentor.MentorID,
      Date: new Date('2025-04-01T10:00:00Z'),
      Time: '10:00 AM'
    }
  });

  console.log('Seeded:', { student, mentor, appointment });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

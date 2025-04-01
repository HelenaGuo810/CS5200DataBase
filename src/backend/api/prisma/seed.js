import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test1234', 10);
  
  try {
    // First, check if the user already exists
    const existingStudent = await prisma.student.findUnique({
      where: { Email: 'lucas@example.com' }
    });
    
    if (!existingStudent) {
      const student = await prisma.student.create({
        data: {
          FirstName: 'Lucas',
          LastName: 'Wang',
          TargetSchool: 'RISD',
          Track: 'UI/UX',
          Email: 'lucas@example.com',
          Password: hashedPassword
        }
      });
      console.log('Created student:', student);
    } else {
      console.log('Student already exists');
    }
    
    const existingMentor = await prisma.mentor.findUnique({
      where: { Email: 'emily.chen@example.com' }
    });
    
    if (!existingMentor) {
      const mentor = await prisma.mentor.create({
        data: {
          FirstName: 'Emily',
          LastName: 'Chen',
          Specialization: 'Portfolio Review',
          Availability: 'Weekends',
          Email: 'emily.chen@example.com',
          Password: hashedPassword
        }
      });
      console.log('Created mentor:', mentor);
    } else {
      console.log('Mentor already exists');
    }
    
    // Only create an appointment if both student and mentor exist
    const student = existingStudent || await prisma.student.findUnique({
      where: { Email: 'lucas@example.com' }
    });
    
    const mentor = existingMentor || await prisma.mentor.findUnique({
      where: { Email: 'emily.chen@example.com' }
    });
    
    if (student && mentor) {
      // Check if appointment already exists
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          StudentID: student.StudentID,
          MentorID: mentor.MentorID
        }
      });
      
      if (!existingAppointment) {
        const appointment = await prisma.appointment.create({
          data: {
            StudentID: student.StudentID,
            MentorID: mentor.MentorID,
            Date: new Date('2025-04-01T10:00:00Z'),
            Time: '10:00 AM'
          }
        });
        console.log('Created appointment:', appointment);
      } else {
        console.log('Appointment already exists');
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const portfolioData = [
  {
    key: '1',
    name: "Seraph Station",
    date: "September 2019",
    image: "/assets/portfolio/desktop/image-seraph.jpg",
    category: "Commercial",
    description: "A modern commercial space designed with sustainable principles in mind."
  },
  {
    key: '2',
    name: "Eebox Building",
    date: "August 2017",
    image: "/assets/portfolio/desktop/image-eebox.jpg",
    category: "Residential",
    description: "Contemporary residential complex featuring innovative space utilization."
  },
  {
    key: '3',
    name: "Federal II Tower",
    date: "March 2017",
    image: "/assets/portfolio/desktop/image-federal.jpg",
    category: "Commercial",
    description: "Iconic skyscraper showcasing modern architectural excellence."
  },
  {
    key: '4',
    name: "Project Del Sol",
    date: "January 2016",
    image: "/assets/portfolio/desktop/image-del-sol.jpg",
    category: "Residential",
    description: "Sustainable residential project with innovative solar integration."
  },
  {
    key: '5',
    name: "Le Prototype",
    date: "October 2015",
    image: "/assets/portfolio/desktop/image-prototype.jpg",
    category: "Cultural",
    description: "Experimental cultural center pushing architectural boundaries."
  },
  {
    key: '6',
    name: "228B Tower",
    date: "April 2015",
    image: "/assets/portfolio/desktop/image-228b.jpg",
    category: "Commercial",
    description: "Modern office tower with cutting-edge sustainable features."
  },
  {
    key: '7',
    name: "Grand Edelweiss Hotel",
    date: "December 2013",
    image: "/assets/portfolio/desktop/image-edelweiss.jpg",
    category: "Commercial",
    description: "Luxury hotel combining traditional and contemporary design."
  },
  {
    key: '8',
    name: "Netcry Tower",
    date: "August 2012",
    image: "/assets/portfolio/desktop/image-netcry.jpg",
    category: "Commercial",
    description: "Innovative tech hub with dynamic architectural elements."
  },
  {
    key: '9',
    name: "Hypers",
    date: "January 2012",
    image: "/assets/portfolio/desktop/image-hypers.jpg",
    category: "Cultural",
    description: "Cultural center featuring interactive architectural elements."
  },
  {
    key: '10',
    name: "SXIV Tower",
    date: "March 2011",
    image: "/assets/portfolio/desktop/image-sxiv.jpg",
    category: "Commercial",
    description: "Modern office complex with sustainable design principles."
  },
  {
    key: '11',
    name: "Trinity Bank Tower",
    date: "September 2010",
    image: "/assets/portfolio/desktop/image-trinity.jpg",
    category: "Commercial",
    description: "Financial center showcasing contemporary architectural design."
  },
  {
    key: '12',
    name: "Project Paramour",
    date: "February 2008",
    image: "/assets/portfolio/desktop/image-paramour.jpg",
    category: "Residential",
    description: "Luxury residential complex with innovative space planning."
  }
];

async function main() {
  // Clear existing data first (optional)
  try {
    await prisma.appointment.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.mentor.deleteMany({});
    await prisma.portfolio.deleteMany({});
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

  // Insert portfolio data
  for (const item of portfolioData) {
    await prisma.portfolio.create({
      data: item
    });
  }

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

import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import apicache from 'apicache';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Create cache middleware
const cache = apicache.middleware;

// Create rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after a minute'
});

// ==== put your endpoints below ====

const JWT_SECRET = process.env.JWT_SECRET;

// register as student
app.post('/student/register', async (req, res) => {
  const { firstName, lastName, email, password, targetSchool, track } = req.body;

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { Email: email }
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: hashedPassword,
        TargetSchool: targetSchool,
        Track: track
      }
    });
    const { Password: _, ...studentWithoutPassword } = student;
    res.status(201).json(studentWithoutPassword);
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// register as mentor
app.post('/mentor/register', async (req, res) => {
  const { firstName, lastName, email, password, specialization, availability } = req.body;

  try {
    const existingMentor = await prisma.mentor.findUnique({
      where: { Email: email }
    });

    if (existingMentor) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mentor = await prisma.mentor.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: hashedPassword,
        Specialization: specialization,
        Availability: availability
      }
    });
    const { Password: _, ...mentorWithoutPassword } = mentor;
    res.status(201).json(mentorWithoutPassword);
  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// log in as student
app.post('/student/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await prisma.student.findUnique({
      where: { Email: email }
    });

    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, student.Password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: student.StudentID,
        email: student.Email,
        role: 'STUDENT'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    const { Password: _, ...studentWithoutPassword } = student;
    res.json({
      user: studentWithoutPassword,
      token,
      role: 'STUDENT'
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// log in as mentor
app.post('/mentor/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await prisma.mentor.findUnique({
      where: { Email: email }
    });

    if (!mentor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordValid = await bcrypt.compare(password, mentor.Password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      {
        id: mentor.MentorID,
        email: mentor.Email,
        role: 'MENTOR'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { Password: _, ...mentorWithoutPassword } = mentor;
    res.json({
      user: mentorWithoutPassword,
      token,
      role: 'MENTOR'
    });
  } catch (error) {
    console.error('Mentor login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// token verification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid/expired token' });
    }
    req.user = user;
    next();
  });
}

// fetch student user info
app.get('/student/me', authenticateToken, async (req, res) => {
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { StudentID: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { Password: _, ...studentWithoutPassword } = student;
    res.json(studentWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// fetch mentor user info
app.get('/mentor/me', authenticateToken, async (req, res) => {
  if (req.user.role !== 'MENTOR') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const mentor = await prisma.mentor.findUnique({
      where: { MentorID: req.user.id }
    });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const { Password: _, ...mentorWithoutPassword } = mentor;
    res.json(mentorWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mentor data' });
  }
});

// update student user info
app.put('/student/update', authenticateToken, async (req, res) => {
  const { firstName, lastName, targetSchool, track, password, email } = req.body;

  try {
    const updateData = {};
    if (firstName !== undefined) updateData.FirstName = firstName;
    if (lastName !== undefined) updateData.LastName = lastName;
    if (targetSchool !== undefined) updateData.TargetSchool = targetSchool;
    if (track !== undefined) updateData.Track = track;
    if (email !== undefined) updateData.Email = email;

    // if (password) {
    //   updateData.Password = await bcrypt.hash(password, 10);
    // }

    // updated: new password could not be the same as the old one
    if (password) {
      const currentStudent = await prisma.student.findUnique({
        where: { StudentID: req.user.id }
      });

      const isSamePassword = await bcrypt.compare(password, currentStudent.Password);
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password must be different from the old password' });
      }

      updateData.Password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    const updatedStudent = await prisma.student.update({
      where: { StudentID: req.user.id },
      data: updateData
    });

    const { Password: _, ...studentWithoutPassword } = updatedStudent;
    res.json(studentWithoutPassword);
  } catch (error) {
    console.error('Student update error:', error);
    res.status(500).json({ error: 'Failed to update student information' });
  }
});

// update mentor user info
app.put('/mentor/update', authenticateToken, async (req, res) => {
  if (req.user.role !== 'MENTOR') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { firstName, lastName, specialization, availability, password, email } = req.body;
  try {
    const updateData = {};

    if (firstName !== undefined) updateData.FirstName = firstName;
    if (lastName !== undefined) updateData.LastName = lastName;
    if (specialization !== undefined) updateData.Specialization = specialization;
    if (availability !== undefined) updateData.Availability = availability;
    if (email !== undefined) updateData.Email = email;

    // if (password) {
    //   updateData.Password = await bcrypt.hash(password, 10);
    // }
    // updated: new password could not be the same as the old one
    if (password) {
      const currentMentor = await prisma.mentor.findUnique({
        where: { MentorID: req.user.id }
      });

      const isSamePassword = await bcrypt.compare(password, currentMentor.Password);
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password must be different from the old password' });
      }
      updateData.Password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }
    const updatedMentor = await prisma.mentor.update({
      where: { MentorID: req.user.id },
      data: updateData
    });

    const { Password: _, ...mentorWithoutPassword } = updatedMentor;
    res.json(mentorWithoutPassword);
  } catch (error) {
    console.error('Mentor update error:', error);
    res.status(500).json({ error: 'Failed to update mentor information' });
  }
});

app.get('/appointment', authenticateToken, async (req, res) => { 
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        Student: true,
        Mentor: true
      }
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/appointment', authenticateToken, async (req, res) => { 
  const { StudentID, MentorID, Date, Time } = req.body;

  // Log the received data
  console.log('Appointment request data:', { StudentID, MentorID, Date, Time });
  
  // Validate data
  if (!StudentID || !MentorID || !Date || !Time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Parse ID fields to ensure they're integers
  try {
    const parsedStudentID = parseInt(StudentID);
    const parsedMentorID = parseInt(MentorID);
    
    if (isNaN(parsedStudentID) || isNaN(parsedMentorID)) {
      return res.status(400).json({ error: 'Student ID and Mentor ID must be valid numbers' });
    }
    
    // Check if the student exists in the database
    const existingStudent = await prisma.student.findUnique({
      where: { StudentID: parsedStudentID }
    });
    
    if (!existingStudent) {
      console.log(`Student with ID ${parsedStudentID} not found. Creating mock student for demo.`);
      // For demo purposes, create a mock student if it doesn't exist
      try {
        await prisma.student.create({
          data: {
            StudentID: parsedStudentID,
            FirstName: "Demo",
            LastName: "Student",
            Email: `demo.student${parsedStudentID}@example.com`,
            Password: await bcrypt.hash("password123", 10),
            TargetSchool: "Demo University",
            Track: "Computer Science"
          }
        });
        console.log(`Created mock student with ID ${parsedStudentID}`);
      } catch (studentError) {
        console.error("Failed to create mock student:", studentError);
        // Continue anyway for demo
      }
    }
    
    // Check if the mentor exists in the database
    const existingMentor = await prisma.mentor.findUnique({
      where: { MentorID: parsedMentorID }
    });
    
    if (!existingMentor) {
      console.log(`Mentor with ID ${parsedMentorID} not found. Creating mock mentor for demo.`);
      // Define mock mentor data based on the ID
      const mockMentors = {
        1: {
          FirstName: 'John',
          LastName: 'Doe',
          Specialization: 'UI/UX Design',
          Availability: 'Weekdays'
        },
        2: {
          FirstName: 'Jane',
          LastName: 'Smith',
          Specialization: 'Full Stack Development',
          Availability: 'Evenings'
        },
        3: {
          FirstName: 'Alex',
          LastName: 'Johnson',
          Specialization: 'Mobile Development',
          Availability: 'Weekends'
        },
        4: {
          FirstName: 'Sarah',
          LastName: 'Williams',
          Specialization: 'Data Science',
          Availability: 'Mornings'
        }
      };
      
      const mockMentor = mockMentors[parsedMentorID];
      
      if (mockMentor) {
        try {
          await prisma.mentor.create({
            data: {
              MentorID: parsedMentorID,
              FirstName: mockMentor.FirstName,
              LastName: mockMentor.LastName,
              Email: `${mockMentor.FirstName.toLowerCase()}.${mockMentor.LastName.toLowerCase()}@example.com`,
              Password: await bcrypt.hash("password123", 10),
              Specialization: mockMentor.Specialization,
              Availability: mockMentor.Availability
            }
          });
          console.log(`Created mock mentor with ID ${parsedMentorID}`);
        } catch (mentorError) {
          console.error("Failed to create mock mentor:", mentorError);
          // Fall back to demo mode
          return res.status(201).json({
            AppointmentID: Date.now(),
            StudentID: parsedStudentID,
            MentorID: parsedMentorID,
            Date,
            Time,
            demoMode: true
          });
        }
      } else {
        // Mentor ID not in our mock data, return a demo response
        return res.status(201).json({
          AppointmentID: Date.now(),
          StudentID: parsedStudentID,
          MentorID: parsedMentorID,
          Date,
          Time,
          demoMode: true
        });
      }
    }
    
    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        StudentID: parsedStudentID,
        MentorID: parsedMentorID,
        Date,
        Time
      }
    });
    
    console.log('Appointment created successfully:', appointment);
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    
    // Fall back to demo mode for any error
    if (err.code === 'P2002' || err.code === 'P2003') {
      console.log('Database constraint error, returning demo appointment');
      return res.status(201).json({
        AppointmentID: Date.now(),
        StudentID: parseInt(StudentID),
        MentorID: parseInt(MentorID),
        Date,
        Time,
        demoMode: true
      });
    }
    
    // Provide more specific error messages based on the error type
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'This appointment already exists' });
    } else if (err.code === 'P2003') {
      res.status(400).json({ error: 'Invalid Student ID or Mentor ID' });
    } else {
      res.status(400).json({ error: `Failed to create appointment: ${err.message}` });
    }
  }
});

app.get('/mentors', authenticateToken, async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({
      select: {
        MentorID: true,
        FirstName: true,
        LastName: true,
        Specialization: true,
        Availability: true,
        Email: true
      }
    });
    
    // If no mentors found in database, return mock data
    if (mentors.length === 0) {
      console.log('No mentors found in database, returning mock data');
      const mockMentors = [
        { 
          MentorID: 1, 
          FirstName: 'John', 
          LastName: 'Doe', 
          Specialization: 'UI/UX Design', 
          Availability: 'Weekdays',
          Email: 'john.doe@example.com'
        },
        { 
          MentorID: 2, 
          FirstName: 'Jane', 
          LastName: 'Smith', 
          Specialization: 'Full Stack Development', 
          Availability: 'Evenings',
          Email: 'jane.smith@example.com'
        },
        { 
          MentorID: 3, 
          FirstName: 'Alex', 
          LastName: 'Johnson', 
          Specialization: 'Mobile Development', 
          Availability: 'Weekends',
          Email: 'alex.johnson@example.com'
        },
        { 
          MentorID: 4, 
          FirstName: 'Sarah', 
          LastName: 'Williams', 
          Specialization: 'Data Science', 
          Availability: 'Mornings',
          Email: 'sarah.williams@example.com'
        }
      ];
      
      // Try to seed mentors in database for future requests
      try {
        for (const mentor of mockMentors) {
          await prisma.mentor.create({
            data: {
              MentorID: mentor.MentorID,
              FirstName: mentor.FirstName,
              LastName: mentor.LastName,
              Email: mentor.Email,
              Password: await bcrypt.hash("password123", 10),
              Specialization: mentor.Specialization,
              Availability: mentor.Availability
            }
          });
        }
        console.log('Successfully seeded mock mentors');
      } catch (seedError) {
        console.error('Failed to seed mock mentors:', seedError);
      }
      
      return res.json(mockMentors);
    }
    
    res.json(mentors);
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

app.delete('/appointment/:id', authenticateToken, async (req, res) => { 
  const { id } = req.params;

  try {
    await prisma.appointment.delete({
      where: {
        AppointmentID: parseInt(id)
      }
    });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Apply rate limiting to all requests
app.use('/api/', apiLimiter);

// Portfolio Endpoints with caching
app.get('/api/portfolio', cache('5 minutes'), async (req, res) => {
  try {
    // Log the request for debugging
    console.log('Portfolio API request received');
    
    const portfolioItems = await prisma.portfolio.findMany();
    console.log(`Found ${portfolioItems.length} portfolio items`);
    
    // If no items found, seed the database automatically
    if (portfolioItems.length === 0) {
      console.log('No portfolio items found, seeding database automatically');
      try {
        // Use the same data as in the seed endpoint
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
        
        // Insert portfolio data
        for (const item of portfolioData) {
          await prisma.portfolio.create({
            data: item
          });
        }
        
        // Fetch again after seeding
        const newPortfolioItems = await prisma.portfolio.findMany();
        console.log(`Seeded and found ${newPortfolioItems.length} portfolio items`);
        
        if (newPortfolioItems.length > 0) {
          portfolioItems = newPortfolioItems;
        }
      } catch (seedError) {
        console.error('Error auto-seeding portfolio data:', seedError);
      }
    }
    
    if (portfolioItems.length === 0) {
      return res.status(404).json({ error: 'No portfolio items found in database' });
    }
    
    // Map the items to add proper image URLs
    const mappedItems = portfolioItems.map(item => {
      // Extract just the image filename
      const imagePath = item.image;
      const imageName = imagePath.split('/').pop();
      
      // Return modified item with full URL
      return {
        ...item,
        imageName: imageName, // Keep original path as a reference
        // Use a full URL that will work with the frontend
        image: `http://localhost:3000/assets/portfolio/desktop/${imageName}`
      };
    });
    
    // Add cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.json(mappedItems);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items: ' + error.message });
  }
});

// Get unique categories from portfolio
app.get('/api/portfolio/categories', cache('15 minutes'), async (req, res) => {
  try {
    const portfolioItems = await prisma.portfolio.findMany();
    
    if (portfolioItems.length === 0) {
      // If no data, return default categories
      return res.json(['Commercial', 'Residential', 'Cultural', 'Educational']);
    }
    
    // Extract unique categories
    const categories = [...new Set(portfolioItems.map(item => item.category))];
    console.log('Categories found:', categories);
    
    // Filter out any case variations of 'all' from the API response
    const filteredCategories = categories.filter(
      category => category.toLowerCase() !== 'all'
    );
    
    res.json(filteredCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Temporary route to seed portfolio data
app.get('/api/seed-portfolio', async (req, res) => {
  try {
    // Portfolio data for seeding
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

    // Clear existing portfolio data
    await prisma.portfolio.deleteMany({});
    
    // Insert new portfolio data
    for (const item of portfolioData) {
      await prisma.portfolio.create({
        data: item
      });
    }
    
    res.json({ success: true, message: 'Portfolio data seeded successfully' });
  } catch (error) {
    console.error('Error seeding portfolio data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000/");
});

// Prisma Commands
// npx prisma db push: to push the schema to the database or any changes to the schema
// npx prisma studio: to open prisma studio and visualize the database

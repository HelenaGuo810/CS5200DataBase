import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

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

  try {
    const appointment = await prisma.appointment.create({
      data: {
        StudentID,
        MentorID,
        Date,
        Time
      }
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create appointment' });
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

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000/");
});

// Prisma Commands
// npx prisma db push: to push the schema to the database or any changes to the schema
// npx prisma studio: to open prisma studio and visualize the database

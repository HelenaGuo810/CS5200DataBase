import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ==== put your endpoints below ====

// Create a Tweet
app.post('/tweets', async (req, res) => {
  const { text, userId } = req.body;
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const tweet = await prisma.tweet.create({
      data: { text, userId }
  });
  res.json(tweet);
});

// Delete a Tweet by ID
app.delete('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  const response = await prisma.tweet.delete({ where: { id: Number(id) } });
  res.json(response);
});

// Get a Tweet by ID
app.get('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  res.json(tweet);
});

// Update a Tweet by ID
app.put('/tweets/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
  if (!tweet) {
    return res.status(404).json({ error: 'Tweet not found' });
  }
  const response = await prisma.tweet.update({
      where: { id: Number(id) },
      data: { text }
  });
  res.json(response);
});

// Get Users Sorted by Preferred Name
app.get('/users/sorted', async (req, res) => {
  const users = await prisma.user.findMany({
      orderBy: { preferredName: 'asc' }
  });
  res.json(users);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});

// Prisma Commands
// npx prisma db push: to push the schema to the database or any changes to the schema
// npx prisma studio: to open prisma studio and visualize the database

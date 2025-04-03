<div align="center">
<img src='src/images/logo.png' width=170px/> 

<div align="center">

**Vertex Studio**

*- A Portfolio Learning Platform*
</div>
</div>

<div align="center">
  <img src="src/images/homepage.png" alt="HomePage Vertex Studio" width="550" />
</div>

## ✨ Philosophy
- Our platform provides design major applicants with personalized learning resources, access to industry mentors, and courses aimed at improving their admission chances to top design programs globally. 
- It offers features such as 1:1 mentor-student appointments, curated course purchases, and personalized resource recommendations. Students can book appointments, enroll in courses, and receive book recommendations that align with their interests and target universities.
- We believe this would bridge the gap between aspiring design students and mentors by offering personalized guidance through mentorship sessions and curated resources.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A web browser

### Installation

1. Clone the repository

```bash
git clone https://github.com/HelenaGuo810/CS5200DataBase.git
cd CS5200DataBase
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
touch .env    # Linux/Mac
# or
echo. > .env  # Windows
```
4. Edit the `.env` file with your database connection string

```bash
DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
JWT_SECRET=your_jwt_secret_key
```

5. Initialize the database

```bash
npx prisma migrate dev
```

6. Setup your mysql database
```bash
# Log in to MySQL
mysql -u root -p

# Create database
CREATE DATABASE your_database_name;
EXIT;

# Initialize Prisma with your database
npx prisma migrate dev
```
7. Start the development server

```bash
npm start
# or
yarn start
```

> Note: If you encounter the error *Cannot find module 'react'*, make sure you're in the correct directory where the package.json file is located and that you've run the installation step properly.
8. Open your browser and visit `http://localhost:3000`


## 🧩 API Endpoints

The API is available at `http://localhost:8000/api` with the following endpoints:
- `POST /student/login` - Student login
- `POST /student/register` - Student registration
- `GET /student/me` - Get student user info
- `POST /appointment` - Create an appointment
- `DELET /appointment/:id` - Cancel an appointment
- `GET /mentors` - Get mentors info
- `GET /api/portfolio` - Get student portfolio
- `GET /api/portfolio/categories` - Get student portfolio by categories

## 🖥️ Environment Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br>Safari |
| --- | --- | --- | --- |

## 🔧 Tech Stack   
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

## 📄 License

This project is licensed under the [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<!-- ## 🤝 Credits
Zhaohe Guo, Siqin Wang, Minghui Xu  -->

<div align="center">

Made by [Group 6, 5200 DBMS](https://northeastern.instructure.com/courses/211557/groups#)

</div>

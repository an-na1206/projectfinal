import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    // 1. Create Users
    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      name: 'Anna Simon (Admin)',
      email: 'admin@edupulse.com',
      password: 'password123',
      role: 'admin',
      bio: 'Lead Instructor and Academic Coordinator at EduPulse.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    });

    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@edupulse.com',
      password: 'password123',
      role: 'student',
      bio: 'Enthusiastic full-stack learner and developer.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });

    console.log(`[Seed] Created Admin (${adminUser.email}) and Student (${studentUser.email})`);

    // 2. Create Courses
    console.log('[Seed] Creating catalog courses...');
    const courses = [
      {
        title: 'Full Stack MERN Bootcamp: Zero to Hero',
        description: 'Comprehensive, project-driven course covering MongoDB, Express.js, React 18, and Node.js. Build scalable RESTful APIs, JWT authentication, and responsive modern frontends.',
        category: 'Full Stack MERN',
        level: 'Intermediate',
        price: 49.99,
        duration: '10 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. Introduction to MERN Stack Architecture',
            duration: '15 mins',
            content: 'Understand client-server architecture, HTTP protocols, REST conventions, and how React talks to Express and MongoDB.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '2. Express Routing & Controller Design',
            duration: '25 mins',
            content: 'Structure clean Express routers, modular controllers, request handling, and uniform JSON response shaping.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '3. MongoDB Schema Modeling with Mongoose',
            duration: '30 mins',
            content: 'Define schemas, field validations, indexes, embedded subdocuments, and referenced relationships with ObjectId.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '4. Authentication with JWT & Bcrypt',
            duration: '35 mins',
            content: 'Implement salted password hashing, access token generation, Bearer auth headers, and route protection middleware.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '5. React State Management & API Integration',
            duration: '40 mins',
            content: 'Connect React components to the API using Axios, handle loading/empty/error states, and manage global user auth context.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      },
      {
        title: 'Modern React & Component Architecture',
        description: 'Master React functional components, custom hooks, Context API, performance optimization, and modular UI structure with Tailwind CSS.',
        category: 'Web Development',
        level: 'Beginner',
        price: 29.99,
        duration: '6 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. React Foundations: JSX, Props, and State',
            duration: '20 mins',
            content: 'Deep dive into virtual DOM, component lifecycle, rendering rules, and unidirectional data flow.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '2. Hooks In-Depth: useState, useEffect, useMemo',
            duration: '30 mins',
            content: 'Learn when and how to handle side effects, dependency arrays, and memoization techniques.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '3. Custom Hooks & Reusable Logic',
            duration: '25 mins',
            content: 'Encapsulate data fetching, debounce, and form handling in reusable custom React hooks.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      },
      {
        title: 'Enterprise Node.js & REST API Design',
        description: 'Learn enterprise-grade API engineering: robust input validation, centralized error handling, pagination, rate limiting, and security best practices.',
        category: 'Web Development',
        level: 'Advanced',
        price: 59.99,
        duration: '8 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. Architecture & Layered Folder Structure',
            duration: '20 mins',
            content: 'Decoupling routes, business services, controllers, and database models for maximum maintainability.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            title: '2. OWASP Top 10 Security for Express APIs',
            duration: '35 mins',
            content: 'Preventing NoSQL injection, cross-site scripting (XSS), brute force attacks, and securing CORS headers.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      },
      {
        title: 'UI/UX Design Systems with Figma & Tailwind',
        description: 'Design intuitive, accessible digital products. Learn design tokens, typography scales, wireframing, interactive prototyping, and Tailwind CSS implementation.',
        category: 'UI/UX Design',
        level: 'Beginner',
        price: 19.99,
        duration: '4 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. Design Systems & Hierarchy',
            duration: '18 mins',
            content: 'Color contrast, 8pt spatial grid, responsive breakpoints, and WCAG 2.2 accessibility standards.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      },
      {
        title: 'Applied Data Science & Machine Learning with Python',
        description: 'Hands-on journey through NumPy, Pandas, Scikit-Learn, data visualization with Matplotlib, and training predictive machine learning models.',
        category: 'Data Science',
        level: 'Intermediate',
        price: 49.99,
        duration: '8 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. Exploratory Data Analysis with Pandas',
            duration: '22 mins',
            content: 'Cleaning dataframes, handling null values, feature engineering, and statistical distribution.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      },
      {
        title: 'Cloud Deployment, CI/CD & DevOps Essentials',
        description: 'Deploy full-stack web applications to Render, Vercel, and AWS. Configure automated GitHub Actions CI/CD workflows, environment configs, and SSL/HTTPS.',
        category: 'Cloud & DevOps',
        level: 'Advanced',
        price: 39.99,
        duration: '5 Weeks',
        instructor: adminUser._id,
        instructorName: adminUser.name,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        lessons: [
          {
            title: '1. Production Deployment on Render & Vercel',
            duration: '20 mins',
            content: 'Setting build commands, SPA rewrite rules, production environment variables, and MongoDB Atlas IP whitelisting.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log(`[Seed] Created ${createdCourses.length} courses.`);

    // 3. Create Sample Enrollment
    console.log('[Seed] Enrolling sample student in MERN Bootcamp...');
    const mernCourse = createdCourses[0];
    await Enrollment.create({
      student: studentUser._id,
      course: mernCourse._id,
      completedLessons: [mernCourse.lessons[0]._id],
      progress: 20,
      status: 'active'
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('\n--- DEMO CREDENTIALS ---');
    console.log('Admin:   email: admin@edupulse.com   password: password123');
    console.log('Student: email: student@edupulse.com password: password123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();

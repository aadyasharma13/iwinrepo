# I-Win Healthcare Community Platform

A comprehensive healthcare community platform connecting patients, caregivers, and medical professionals.

## 🏗️ Project Structure

```
iwin-main/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js 13+ app directory
│   ├── components/   # React components
│   ├── lib/         # Utility functions and services
│   ├── contexts/    # React contexts
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
├── backend/          # Express.js API server
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   ├── server.js    # Main server file
│   └── package.json # Backend dependencies
└── README.md        # This file
```

## 🚀 Quick Start

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

### Backend (Express.js)
```bash
cd backend
npm install
npm run dev
```
Backend runs on: http://localhost:5000

## ✨ Features

- **🔍 Dynamic Search**: Real-time search through posts, comments, and user profiles
- **💬 Direct Messaging**: Real-time messaging system between community members
- **👥 User Profiles**: Comprehensive user profiles with role-based features
- **📱 Community Posts**: Share experiences, ask questions, and engage with others
- **🏥 Role-Based Access**: Different features for patients, caregivers, and medical professionals
- **🔐 Authentication**: Secure user authentication with Firebase
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Firebase** - Authentication & Database

### Backend
- **Express.js** - Web framework
- **Firebase Admin** - Server-side Firebase integration
- **CORS** - Cross-origin resource sharing

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd iwin-main
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Environment Variables**
- Copy `.env.example` to `.env` in both frontend and backend directories
- Configure your Firebase and other environment variables

5. **Start Development Servers**

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## 🌟 Key Features Implemented

### Search Functionality
- Real-time search across posts, comments, and user profiles
- Categorized search results with highlighting
- Debounced search for optimal performance

### Messaging System
- Real-time direct messaging between users
- Conversation management with unread counts
- Message history and timestamps
- User-friendly chat interface

### User Profiles
- Dynamic user profile pages
- Profile navigation from search results
- Role-based profile information
- Message button integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.
# 🤖 WrddAI Content Generator

<div align="center">

![WrddAI Banner](client/src/assets/WRDD.png)

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-4.0+-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![NestJS](https://img.shields.io/badge/NestJS-9.0+-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-API-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini_1.5-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

A powerful AI-driven content generation platform built with React+Redux frontend and NestJS backend that helps users create high-quality, engaging content with voice input capabilities, centralized state management, and a seamless payment experience.

## ✨ Features

- **🤖 AI-Powered Content Generation**: Create blog posts and articles using Google's Gemini 1.5 Pro
- **🗣️ Voice-to-Text Input**: Generate content through voice using Web Speech API
- **💳 Flexible Subscription Plans**: Multiple tiers with Stripe payment integration
- **📊 Credit Management**: Track usage with centralized Redux state management
- **🔄 History Tracking**: Review and edit previously generated content
- **🎨 Modern UI**: Sleek design with TailwindCSS and smooth animations

## 🧠 AI Integration

The application integrates with Google's Gemini 1.5 Pro model to generate high-quality content:

- **Blog Posts**: Generate full-featured articles with custom tone and category
- **Marketing Copy**: Create compelling ad copy and marketing materials
- **Creative Writing**: Produce stories, poems, and creative content
- **Technical Documentation**: Generate code explanations and technical guides

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (v5.0+)
- Stripe account
- Google AI API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/joewrdd/AIWrdd.git
   cd AIWrdd
   ```

2. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:

   ```bash
   cd client
   npm install
   ```

4. Set up environment variables:

   **Server (.env)**

   ```
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_google_ai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

   **Client (.env)**

   ```
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

5. Start the development servers:

   ```bash
   # Server (in the server directory)
   npm run start:dev

   # Client (in the client directory)
   npm start
   ```

## 📦 Project Structure

```
AIWrdd/
├── client/                      # React frontend
│   ├── public/                  # Static files
│   └── src/
│       ├── apis/                # API service integrations
│       ├── assets/              # Images and static assets
│       ├── auth/                # Authentication context
│       ├── components/          # UI components
│       ├── config/              # Configuration files
│       └── redux/               # Redux state management
│           ├── slices/          # Redux toolkit slices
│           └── store/           # Redux store configuration
│
├── server/                      # NestJS backend
│   ├── src/
│       ├── auth/                # Authentication module
│       ├── history/             # Content history module
│       ├── openai/              # AI integration module
│       ├── stripe/              # Payment processing module
│       ├── users/               # User management module
│       └── app.module.ts        # Main application module
```

## 🌟 Key Features Explained

### Centralized State Management with Redux

The application uses Redux Toolkit for efficient state management:

- **User Slice**: Manages authentication, user profile, and credit information
- **Content Slice**: Handles content generation state and history
- **Voice Slice**: Controls voice input and transcription states
- **UI Slice**: Manages UI-related states like modals and messages
- **Payment Slice**: Handles payment processing states

### Voice Input with Web Speech API

The application leverages the browser's Web Speech API to:

- Convert speech to text in real-time
- Allow editing of transcribed content before generation
- Support continuous speech recognition
- Provide visual feedback during recording

### Subscription Management

The credit-based subscription system includes:

- Monthly credit allocations based on plan tier
- Automatic renewal of credits on billing cycle
- Usage tracking with Redux state
- Payment processing through Stripe

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Verify authentication

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Content Generation

- `POST /api/openai/generate` - Generate AI content
- `GET /api/history` - Get content history
- `PUT /api/history/:id` - Update content history item
- `DELETE /api/history/:id` - Delete content history item

### Payment Processing

- `POST /api/stripe/checkout` - Create payment intent
- `POST /api/stripe/verify-payment/:id` - Verify payment
- `POST /api/stripe/free-plan` - Activate free plan
- `GET /api/stripe/fix-subscription` - Fix subscription issues

## 🙏 Acknowledgements

- [Google's Gemini API](https://ai.google.dev/) for powerful AI content generation
- [NestJS](https://nestjs.com/) for providing a robust backend framework
- [Redux Toolkit](https://redux-toolkit.js.org/) for simplified state management
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for voice recognition capabilities
- [Stripe](https://stripe.com/) for secure payment processing

## 📄 License

This project is available under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Created With ❤️ by Joe Wrdd</p>
</div>

```

```

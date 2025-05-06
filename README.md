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

## 📊 Database Schema

### User Schema

```typescript
{
  username: String,           // Required: User's display name
  email: String,              // Required: User's email address
  password: String,           // Required: Hashed password
  trialPeriod: Number,        // Default: 3 days
  trialActive: Boolean,       // Default: true
  trialExpires: Date,         // When the trial period ends
  subscription: String,       // Enum: "Free", "Basic", "Premium", "Trial"
  apiRequestCount: Number,    // Total lifetime content generations
  monthlyRequestCount: Number, // Remaining credits for current cycle
  nextBillingDate: Date,      // When the next billing occurs
  payments: [ObjectId],       // References to Payment documents
  history: [ObjectId]         // References to ContentHistory documents
}
```

### Content History Schema

```typescript
{
  content: String,           // The generated content
  user: ObjectId,            // Reference to User document
  createdAt: Date,           // When the content was generated
  updatedAt: Date            // When the content was last updated
}
```

### Payment Schema

```typescript
{
  amount: Number,            // Payment amount
  status: String,            // Payment status (completed, failed, etc.)
  subscriptionPlan: String,  // Which plan was purchased
  user: ObjectId,            // Reference to User document
  paymentIntentId: String,   // Stripe payment intent ID
  createdAt: Date,           // When the payment was initiated
  updatedAt: Date            // When the payment status was last updated
}
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

  - Parameters: `{ username, email, password }`
  - Returns: `{ status, message, user }`

- `POST /api/auth/login` - User login

  - Parameters: `{ email, password }`
  - Returns: `{ status, user }` + Sets HTTP-only cookie with JWT

- `POST /api/auth/logout` - User logout

  - Parameters: None
  - Returns: `{ message }` + Clears HTTP-only cookie

- `GET /api/auth/check` - Verify authentication
  - Parameters: None (JWT from cookie)
  - Returns: `{ isAuthenticated }`

### User Management

- `GET /api/users/profile` - Get user profile

  - Parameters: None (JWT from cookie)
  - Returns: `{ status, user }` with populated payment history

- `PUT /api/users/profile` - Update user profile
  - Parameters: `{ username, email, ... }`
  - Returns: `{ status, user }`

### Content Generation

- `POST /api/openai/generate` - Generate AI content

  - Parameters: `{ prompt }`
  - Returns: `{ status, message, content, model }`
  - Side effect: Creates history record & decrements monthly credits

- `GET /api/history` - Get content history

  - Parameters: None (JWT from cookie)
  - Returns: `{ history: [] }` with all user's history items

- `PUT /api/history/:id` - Update content history item

  - Parameters: `{ content }`
  - Returns: `{ status, history }` with updated content

- `DELETE /api/history/:id` - Delete content history item
  - Parameters: None (just ID in URL)
  - Returns: `{ status, message }`

### Payment Processing

- `POST /api/stripe/checkout` - Create payment intent

  - Parameters: `{ amount, subscriptionPlan }`
  - Returns: `{ clientSecret }` for Stripe.js

- `POST /api/stripe/verify-payment/:id` - Verify payment

  - Parameters: None (ID in URL)
  - Returns: `{ verified, message }`

- `POST /api/stripe/free-plan` - Activate free plan

  - Parameters: None (JWT from cookie)
  - Returns: `{ status, message }`

- `GET /api/stripe/fix-subscription` - Fix subscription issues
  - Parameters: None (JWT from cookie)
  - Returns: `{ status, message }`

## 💻 Running and Testing

### Development Environment

1. Start both server and client as described in Installation section
2. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000`

### Testing the Application

1. **Authentication Testing**:

   - Register a new account via the signup form
   - Login with your credentials
   - Verify that you can access protected routes (Dashboard, Content Generation)

2. **Content Generation Testing**:

   - Navigate to the Generate Content page
   - Fill in the form with topic, tone, and category
   - Submit and verify that content is generated and credits are deducted

3. **Voice Input Testing**:

   - Navigate to the Voice-to-Content page
   - Click the microphone button and speak (requires Chrome or supported browser)
   - Verify that your speech is transcribed and can be edited
   - Generate content and confirm that it's based on your transcript

4. **Payment Testing**:

   - Navigate to Plans page and select a subscription
   - Use Stripe test card `4242 4242 4242 4242` with any future date and any CVC
   - Complete payment flow and verify that subscription is activated

5. **Redux State Testing**:
   - Use Redux DevTools browser extension to monitor state changes
   - Verify that user credits update correctly after content generation
   - Check that authentication state persists across page refreshes

## 🛠️ Technical Documentation

### Redux Slices (More Slices In Code)

#### userSlice.js

- `fetchUserProfile()`: Async thunk to retrieve user data from the server

  - Parameters: None
  - Returns: Promise resolving to user data

- `updateCreditUsage()`: Action to update credit counters in Redux state

  - Parameters: None
  - Side effect: Increments total used credits, decrements remaining credits

- `selectCurrentCycleUsedCredits(state)`: Selector to calculate current billing cycle usage

  - Parameters: Redux state
  - Returns: Number of credits used in current billing cycle

- `selectRemainingCredits(state)`: Selector to get remaining credits
  - Parameters: Redux state
  - Returns: Number of remaining credits for current user

#### contentSlice.js

- `generateContent(promptData)`: Async thunk to generate content via AI
  - Parameters: `promptData` (string with generation prompt)
  - Returns: Promise resolving to generated content
  - Side effect: Dispatches `updateCreditUsage()`

#### voiceSlice.js

- `appendTranscript(text)`: Action to add new transcribed text to existing transcript

  - Parameters: `text` (string to append)
  - Returns: Updated Redux state

- `setIsListening(status)`: Action to toggle speech recognition status
  - Parameters: `status` (boolean)
  - Returns: Updated Redux state

### Components

#### VoiceContentGenerator

- Uses Web Speech API to capture and transcribe voice input
- Manages recording state, transcription, and speech recognition errors
- Allows editing transcribed text before generating content

#### BlogPostAIAssistant

- Implements form-based content generation with customizable parameters
- Uses Formik for form validation and submission
- Displays credit usage information and generated content

## 🧪 Third-Party Libraries

### Frontend (Client)

- **React**: UI library
- **Redux Toolkit**: State management
- **Redux Persist**: State persistence across sessions
- **Axios**: HTTP client
- **Formik & Yup**: Form handling and validation
- **Stripe.js & React-Stripe-js**: Payment processing
- **Framer Motion**: Animations
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **React Icons**: Icon components

### Backend (Server)

- **NestJS**: Backend framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Stripe API**: Payment processing
- **Google Generative AI SDK**: AI content generation
- **Class Validator**: DTO validation
- **Passport.js**: Authentication strategies

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
  <p>Created With ❤️ By Joe Wrdd</p>
</div>

```

```

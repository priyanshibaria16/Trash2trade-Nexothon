# Trash2Trade - A Tech-Powered Recycling Ecosystem

## About the Project

Trash2Trade is a comprehensive recycling platform that connects citizens, waste collectors, and NGOs in a sustainable ecosystem. The platform enables citizens to book waste pickups, collectors to manage their routes and earnings, and NGOs to sponsor recycling drives and track environmental impact.

Users can earn "Green Coins" for their recycling activities, which can be redeemed for rewards, creating a gamified experience that encourages sustainable behavior.

## Project Structure

This project consists of two main components:

1. **Frontend** - A React/TypeScript application with Vite, shadcn-ui, and Tailwind CSS
2. **Backend** - A Node.js/Express API with JWT authentication and PostgreSQL database

## Features

### For Citizens
- Book waste pickups from home
- Track recycling history and impact
- Earn Green Coins for recycling activities
- View Eco-Score based on environmental contributions
- Redeem rewards with Green Coins

### For Collectors
- View pickup requests in their area
- Manage active collection routes
- Track earnings from recycling activities
- View performance metrics

### For NGOs/Businesses
- Sponsor recycling drives and campaigns
- Track environmental impact and statistics
- Connect with local communities
- Promote sustainability initiatives

## Technology Stack

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Hook Form
- Yup (Validation)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt (Password Hashing)

## How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Frontend Setup

```sh
# Navigate to the project root directory
cd trash2trade

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:8080

### Backend Setup

```sh
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and update the values

# Initialize the database
npm run init-db

# Start the backend server
npm run dev
```

The backend API will be available at http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)

## Database Schema

The application uses a PostgreSQL database with the following main table:

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'collector', 'ngo')),
  green_coins INTEGER DEFAULT 0,
  eco_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## How to Deploy

### Frontend
You can deploy the frontend using various hosting platforms:
- Vercel
- Netlify
- GitHub Pages

### Backend
You can deploy the backend on:
- Heroku
- AWS EC2
- DigitalOcean
- Any Node.js hosting platform

Make sure to update the environment variables in your deployment environment.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
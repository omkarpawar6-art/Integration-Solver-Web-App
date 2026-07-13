# Integration Solver Web App

A modern web application for solving mathematical integrals with an interactive user interface. Built with React, Express, TypeScript, and powered by Nerdamer for symbolic mathematics.

## Features

- 🧮 **Integral Solver** - Compute integrals with symbolic mathematics
- 🎨 **Modern UI** - Built with React and Radix UI components
- 📊 **Responsive Design** - Tailwind CSS for beautiful, responsive layouts
- 🔐 **Authentication** - User session management with Passport.js
- 💾 **Database Support** - PostgreSQL with Drizzle ORM
- 🌙 **Dark Mode** - Theme switching with next-themes
- ✨ **Smooth Animations** - Framer Motion for polished interactions
- 📱 **Mobile Friendly** - Fully responsive design
- 🔄 **Real-time Updates** - WebSocket support

## Tech Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.3 - Type safety
- **Vite** 7.3.0 - Build tool
- **Tailwind CSS** 3.4.17 - Styling
- **Radix UI** - Accessible component library
- **React Hook Form** - Form state management
- **TanStack React Query** - Data fetching and caching
- **Wouter** - Client-side routing
- **Framer Motion** - Animation library

### Backend
- **Express** 4.21.2 - Web framework
- **Node.js** - Runtime
- **Passport.js** - Authentication
- **Express Session** - Session management

### Database & ORM
- **PostgreSQL** - Database
- **Drizzle ORM** 0.39.3 - Type-safe database access
- **Drizzle Kit** - Schema management

### Mathematics
- **Nerdamer** 1.1.13 - Symbolic mathematics and integral solving
- **KaTeX** 0.16.27 - Math formula rendering

### Additional Libraries
- **ws** 8.18.0 - WebSocket support
- **date-fns** 3.6.0 - Date utilities
- **zod** 3.24.2 - Schema validation
- **Recharts** 2.15.2 - Charts and data visualization

## Project Structure

```
Integration-Solver-Web-App/
├── client/              # React frontend application
├── server/              # Express backend server
├── shared/              # Shared types and utilities
├── script/              # Build scripts
├── package.json         # Project dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── drizzle.config.ts    # Database configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omkarpawar6-art/Integration-Solver-Web-App.git
   cd Integration-Solver-Web-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/integral_solver
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and backend API at `http://localhost:3000`.

### Build

Build the project for production:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm start
```

### Type Checking

Run TypeScript type checking:
```bash
npm run check
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database migrations |

## API Endpoints

### Integration Solver
- `POST /api/solve` - Solve an integral
  - Body: `{ expression: string }`
  - Response: `{ result: string, steps?: string[] }`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

## Configuration Files

- **vite.config.ts** - Vite bundler configuration with React and Cartographer plugins
- **tailwind.config.ts** - Tailwind CSS theme and component customization
- **tsconfig.json** - TypeScript compiler options
- **drizzle.config.ts** - Database ORM configuration

## Features in Development

- [ ] Advanced integral solving algorithms
- [ ] Step-by-step solution explanation
- [ ] Solution history and saved expressions
- [ ] Collaborative solving with real-time updates
- [ ] Export solutions as PDF
- [ ] Math formula editor with LaTeX support

## Demo

Try the live demo: https://replit.com/@omkarsachinpawa/Integral-Solver

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Omkar Pawar** - [GitHub Profile](https://github.com/omkarpawar6-art)

## Support

If you have any questions or encounter issues, please:
- Open an [issue](https://github.com/omkarpawar6-art/Integration-Solver-Web-App/issues)
- Check the [demo](https://replit.com/@omkarsachinpawa/Integral-Solver) for reference

---

Built with ❤️ by Omkar Pawar

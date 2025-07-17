# Insurance Admin Portal

A comprehensive React TypeScript application for managing insurance quotes, agencies, agents, and customers. Built with modern technologies and designed for three distinct user roles.

## 🏗️ Architecture

### Three-Portal System

- **Master Admin Portal**: Complete system administration, manage agencies and agents across the platform
- **Agency Admin Portal**: Manage agents within their agency, oversee quotes and customers
- **Agent Portal**: Direct customer interaction, quote creation and management

### Key Features

- ✅ **Role-based Access Control**: Secure authentication with role-specific navigation
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Modern State Management**: Zustand for client state, React Query for server state
- ✅ **Type-Safe Development**: Full TypeScript implementation
- ✅ **Form Validation**: React Hook Form with Zod validation
- ✅ **Component Library**: Custom UI components built on Radix UI primitives

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom Design System
- **State Management**: Zustand, React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form, Zod validation
- **UI Components**: Custom components based on shadcn/ui patterns
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   └── Layout.tsx      # Main layout with sidebar navigation
├── pages/              # Page components
│   ├── Login.tsx       # Authentication page
│   └── Dashboard.tsx   # Role-specific dashboard
├── stores/             # State management
│   └── authStore.ts    # Authentication state with Zustand
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions and utilities
└── hooks/              # Custom React hooks
```

## 🔐 Authentication & Demo Accounts

The application includes three demo accounts for testing different user roles:

| Role         | Email            | Password    | Access Level                |
| ------------ | ---------------- | ----------- | --------------------------- |
| Master Admin | admin@master.com | password123 | Full system access          |
| Agency Admin | admin@agency.com | password123 | Agency-level management     |
| Agent        | agent@demo.com   | password123 | Customer & quote management |

## 🛠️ Installation & Setup

1. **Clone and navigate to the project**:

   ```bash
   cd insurance
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🎯 Features by Role

### Master Admin

- Complete dashboard with system-wide statistics
- Agency management (create, edit, view all agencies)
- Agent management across all agencies
- System-wide quote analytics
- User management and permissions

### Agency Admin

- Agency-specific dashboard and analytics
- Manage agents within their agency
- Quote oversight for agency operations
- Customer management for agency clients
- Agency performance metrics

### Agent

- Personal dashboard with individual metrics
- Customer relationship management
- Quote creation and management
- Personal performance tracking
- Customer communication tools

## 🔧 Development Guidelines

### Component Patterns

- Use functional components with hooks
- Implement proper TypeScript typing
- Follow the established UI component patterns
- Use custom utility functions for common operations

### State Management

- **Authentication**: Zustand store with persistence
- **Server State**: React Query for API data
- **Form State**: React Hook Form for form management
- **UI State**: Local component state or Zustand when shared

### Styling

- Tailwind CSS utility classes
- Custom CSS variables for consistent theming
- Responsive design with mobile-first approach
- Consistent spacing and typography scale

## 🚧 Roadmap

### Immediate Next Steps

1. **Quote Management Pages**: Complete CRUD operations for quotes
2. **Agency Management**: Full agency administration interface
3. **Agent Management**: Comprehensive agent management system
4. **Customer Management**: Customer relationship management features
5. **Reports & Analytics**: Advanced reporting and dashboard charts

### Future Enhancements

1. **API Integration**: Connect to real backend services
2. **Advanced Permissions**: Granular permission system
3. **Notification System**: Real-time notifications
4. **Document Management**: File upload and document storage
5. **Email Integration**: Automated email workflows
6. **Mobile App**: React Native mobile application

## 📄 License

This project is part of a demo implementation for an insurance admin portal system.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Insurance Admin Portal - Copilot Instructions

This is a React TypeScript insurance admin portal with three main user roles:

## Project Structure

- **Master Admin Portal**: Complete system administration, manage agencies and agents
- **Agency Admin Portal**: Manage agents within their agency and quotes
- **Agent Portal**: Customer and quote management

## Key Technologies

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- React Query for server state
- React Hook Form for form handling
- Lucide React for icons

## Architecture Patterns

- Use functional components with hooks
- Implement proper TypeScript typing for all props and state
- Follow the established folder structure in src/
- Use the custom UI components in src/components/ui/
- Leverage the utility functions in src/lib/utils.ts
- Follow the established patterns for forms and validation

## Code Style

- Use arrow functions for components
- Implement proper error handling
- Use the established naming conventions
- Follow responsive design principles with Tailwind CSS
- Implement proper loading and error states
- Use the established color scheme and design tokens

## State Management

- Use Zustand for client state (auth, UI state)
- Use React Query for server state (API data)
- Keep components pure when possible
- Use proper TypeScript interfaces from src/types/

## Security Considerations

- Implement role-based access control
- Validate all form inputs
- Handle authentication properly
- Protect sensitive routes

Please generate code that follows these patterns and maintains consistency with the existing codebase.

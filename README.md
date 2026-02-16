# Lost & Found Platform - Frontend

Production-grade React frontend for the Lost & Found Item Recovery Platform.

## 🚀 Features

- **React 18** with TypeScript
- **React Router v7** with object-based routing
- **Redux Toolkit** for state management
- **React Hook Form** + **Yup** validation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** with automatic token refresh
- **Full TypeScript** - Zero `any` types
- **Modular Architecture** - Easy to maintain and scale

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── constants/      # Centralized constants (no magic strings)
├── features/       # Feature-specific components
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── pages/          # Route components
├── services/       # API services
├── store/          # Redux store and slices
├── types/          # TypeScript definitions
├── validators/     # Yup schemas
├── utils/          # Utility functions
└── styles/         # Global styles
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

## 📝 Development Status

**Current Progress: 30%**

### ✅ Completed
- Project setup and configuration
- Constants and types (100% coverage)
- API services layer
- Redux store (auth, items)
- Validators (Yup schemas)
- Custom hooks (useAuth, useDebounce, useToast)
- Utility functions
- Basic layouts and routing
- Error boundary

### 🚧 In Progress
- UI components library
- Authentication pages
- Dashboard pages
- Feature modules

### 📋 TODO
- Complete all feature modules
- Implement React Router loaders/actions
- Add animations
- Responsive design
- Testing
- Documentation

## 🎨 Code Standards

- **No `any` types** - Strict TypeScript
- **No magic strings** - All constants centralized
- **Modular design** - Small, focused files
- **React.memo** for optimization
- **useCallback** and **useMemo** where needed
- **Uncontrolled forms** with React Hook Form

## 📦 Key Dependencies

- react: ^18.3.1
- react-router-dom: ^7.1.1
- @reduxjs/toolkit: ^2.5.0
- react-hook-form: ^7.54.2
- yup: ^1.6.0
- axios: ^1.7.9
- tailwindcss: ^3.4.17
- framer-motion: ^11.15.0

## 🚀 Next Steps

1. Build complete UI component library
2. Implement all feature pages
3. Add React Router loaders/actions
4. Implement animations
5. Add responsive design
6. Write tests
7. Deploy

## 📄 License

MIT

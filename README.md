# WallpaperVerse

A modern, production-ready wallpaper gallery website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Beautiful UI**: Premium dark mode with glassmorphism effects and smooth animations
- **Dynamic Data**: Fetches wallpapers from Supabase storage automatically
- **Smart Downloads**: Automatically detects screen resolution and recommends optimal download size
- **Image Processing**: Canvas API for on-the-fly image resizing
- **Favorites System**: LocalStorage-based favorites with Zustand state management
- **Advanced Search**: Live search with debounce functionality
- **Filtering**: Filter by category, resolution, and sort options
- **Infinite Scrolling**: Load wallpapers in batches for optimal performance
- **Responsive Design**: Mobile, tablet, desktop, and ultrawide monitor support
- **Download Analytics**: Track download statistics via Supabase Edge Functions
- **Performance Optimizations**: Lazy loading, image preloading, React Query caching

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── features/      # Feature-specific components
│   ├── layout/        # Layout components (Navbar, Footer, etc.)
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── store/             # Zustand stores
├── types/             # TypeScript types
├── utils/             # Utility functions
├── App.tsx            # Main App component
└── main.tsx           # Entry point
```

## Features Overview

### Wallpaper Display
- Pinterest-style masonry grid layout
- Hover animations with action buttons
- Blur-up image loading
- Skeleton loaders

### Wallpaper Details
- Fullscreen modal with large preview
- Multiple download resolution options
- Smart resolution recommendation based on screen size
- Tags, category, and metadata display
- Share functionality

### Search & Filter
- Live search with 300ms debounce
- Filter by category (Nature, Mountains, Space, etc.)
- Filter by resolution (Full HD, 2K, 4K, 5K, 8K)
- Sort by latest, popular, most downloaded, or A-Z

### Favorites
- Add/remove wallpapers to favorites
- Persistent storage using localStorage
- Dedicated favorites page

### Performance
- Lazy loading images
- React Query caching with 5-minute stale time
- Code splitting with React.lazy
- Intersection Observer for infinite scrolling

Build a complete production-ready Wallpaper Gallery Website using React + TypeScript + Vite + Tailwind CSS.

PROJECT NAME:
Jyora

PURPOSE:
Create a modern wallpaper browsing and downloading platform that fetches wallpaper data dynamically from:

https://xbccmcszhnybxzlirjgk.supabase.co/storage/v1/object/public/wallpaper/gallery.json

The website should automatically load all wallpapers from the JSON file and display them in a beautiful, fast, responsive interface similar to WallpaperHub, Wallhaven, Unsplash, and LumiList.

==================================================
TECH STACK
==========

Frontend:

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Query (TanStack Query)
* Framer Motion
* Heroicons
* React Router

Optional:

* Zustand for state management
* React Virtualized for performance

==================================================
UI DESIGN
=========

Theme:

* Premium dark mode
* Black background (#0B0B0B)
* Glassmorphism cards
* Modern gradients
* Smooth animations
* Professional desktop-first design

Layout:

* Sticky navbar
* Hero section
* Search bar
* Wallpaper grid
* Categories section
* Resolution filter section
* Infinite scrolling
* Footer

Responsive:

* Mobile
* Tablet
* Desktop
* Ultrawide monitors

==================================================
NAVBAR
======

Logo:
Jyora

Menu:

* Home
* Latest
* Popular
* Categories
* Resolutions

Right side:

* Search icon
* Theme toggle

==================================================
HERO SECTION
============

Title:
Discover Stunning Desktop Wallpapers

Subtitle:
Browse thousands of high-quality wallpapers for every screen size.

Large search box.

Background:
Featured wallpaper slideshow.

==================================================
DATA SOURCE
===========

Fetch wallpapers from:

https://xbccmcszhnybxzlirjgk.supabase.co/storage/v1/object/public/wallpaper/gallery.json

Create reusable API service:

src/services/wallpaperService.ts

Requirements:

* Automatic fetch
* Loading states
* Error handling
* Retry support
* Cache results

==================================================
WALLPAPER GRID
==============

Pinterest-style responsive masonry layout.

Each card displays:

* Wallpaper preview
* Wallpaper title
* Resolution
* Category
* Download count
* Hover animation

Hover actions:

1. Preview
2. Download
3. Fullscreen

Animations:
Framer Motion

==================================================
WALLPAPER DETAILS MODAL
=======================

When clicked:

Open fullscreen modal.

Show:

* Large preview
* Resolution
* Category
* Tags
* Download count
* Upload date

Buttons:

* Download Original
* Download Full HD (1920x1080)
* Download 2K (2560x1440)
* Download 4K (3840x2160)
* Download 5K
* Download 8K

==================================================
SMART DOWNLOAD SYSTEM
=====================

Automatically detect user screen resolution:

window.screen.width
window.screen.height

Display:

Recommended for your screen:
1920x1080

Primary button:

Download Recommended

Logic:

IF available:
Download matching resolution.

ELSE:
Download highest available resolution.

==================================================
IMAGE PROCESSING
================

Generate downloadable versions dynamically:

1080p
1440p
4K
5K
8K

Using:

Canvas API

Create utility:

src/utils/imageResizer.ts

Features:

* Resize image
* Preserve aspect ratio
* High-quality export
* JPG
* PNG
* WEBP

==================================================
SEARCH
======

Live search.

Search by:

* Title
* Category
* Tags

Debounce:
300ms

==================================================
FILTERS
=======

Sidebar filters:

Categories:

* Nature
* Mountains
* Space
* Gaming
* Cars
* Anime
* Abstract
* Technology

Resolutions:

* Full HD
* 2K
* 4K
* 5K
* 8K

Sort:

* Latest
* Popular
* Most Downloaded
* A-Z

==================================================
INFINITE SCROLL
===============

Load wallpapers in batches.

Initial:
24 wallpapers

Then:
24 more

Use Intersection Observer.

==================================================
FAVORITES
=========

Users can favorite wallpapers.

Store in:

localStorage

Create page:

/favorites

==================================================
FEATURED WALLPAPERS
===================

Top section showing:

* Trending
* Most downloaded
* Newest

Auto-rotating carousel.

==================================================
DOWNLOAD ANALYTICS
==================

Call endpoint:

https://xbccmcszhnybxzlirjgk.supabase.co/functions/v1/wallpaper-download-counter

Whenever download button is clicked.

Track:

* wallpaper id
* timestamp
* resolution selected

==================================================
PERFORMANCE
===========

Implement:

* Lazy loading
* Image preloading
* React Query caching
* Virtual scrolling
* Code splitting

Target:

Lighthouse score >95

==================================================
SEO
===

Generate:

* Dynamic meta tags
* Open Graph tags
* Sitemap
* robots.txt

==================================================
ACCESSIBILITY
=============

* Keyboard navigation
* Proper aria labels
* Focus states
* Screen reader support

==================================================
PAGES
=====

/
Home

/wallpaper/:id
Wallpaper details

/favorites
Favorites

/popular
Popular wallpapers

/latest
Latest wallpapers

/categories
Categories

==================================================
EXTRA FEATURES
==============

Add:

* Blur-up image loading
* Skeleton loaders
* Share wallpaper button
* Copy image URL
* Download progress indicator
* Toast notifications
* Keyboard shortcuts
* Back-to-top button

==================================================
CODE QUALITY
============

Requirements:

* Clean architecture
* Reusable components
* TypeScript interfaces
* Custom hooks
* API abstraction layer
* Modular folder structure
* Production-ready code

Generate ALL files, components, hooks, utilities, routes, Tailwind configuration, TypeScript types, API services, and complete folder structure needed to run the project immediately after npm install and npm run dev.

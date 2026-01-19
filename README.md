# Brands React + Vite App

A modern React application built with Vite, Tailwind CSS, and the Outfit font.

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔤 **Outfit Font** - Modern, clean typography
- 📱 **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (v20.17.0 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Outfit Font** - Typography

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── App.tsx         # Main app component
├── main.tsx        # App entry point
└── index.css       # Global styles with Tailwind
```

## Tailwind Configuration

The project is configured with:
- Custom Outfit font family
- Responsive design utilities
- Modern color palette
- Smooth animations and transitions

## Font Usage

The Outfit font is imported and configured as the default font family. You can use it with the `font-outfit` class or it will be applied globally.

```jsx
<h1 className="font-outfit text-4xl font-bold">
  Hello World
</h1>
```
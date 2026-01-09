<div align="center">
  <p>
    <div style="font-size:18px">Asian Lift Bangladesh</div>
    <div>Admin Monorepo</div>
  </p>
  <p>A TurboRepo dashboard cross-platform applications.</p>
</div>

## Features

- **🔄 Cross-Platform**: Share components between web and mobile
- **📦 Monorepo**: Turborepo with pnpm workspaces
- **🎨 Consistent Styling**: NativeWind (Tailwind for React Native)
- **🌖 Theming**: Light/Dark mode
- **⚡ Fast Development**: Hot reload on all platforms
- **📱 Modern Stack**: Next.js 16, Expo 54, React 19, TypeScript
- **🏗️ Clean Architecture**: Minimal, extensible, production-ready

## Tech Stack

| Technology     | Purpose                 | Version |
| -------------- | ----------------------- | ------- |
| **Turborepo**  | Monorepo build system   | Latest  |
| **Next.js**    | React framework for web | 16.x    |
| **Expo**       | React Native platform   | 54.x    |
| **React**      | Frameowrk               | 19.0    |
| **Tailwind**   | UI library              | 3.0     |
| **NativeWind** | Cross-platform styling  | 4.x     |
| **TypeScript** | Type safety             | 5.x     |
| **pnpm**       | Package manager         | 10.x    |

## Project Structure

```
alb-admin-app/
├── apps/
│   ├── mobile/          # Expo React Native app
│   └── web/             # Next.js web app
├── packages/
│   ├── ui/              # Shared component library
│   └── app/             # Shared functions
├── turbo.json           # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/fnabir/alb-admin-app.git
cd alb-admin-app

# Install dependencies
pnpm install
```

### Development

```bash
# Start all apps (web + mobile)
pnpm dev

# Start individual apps
pnpm --filter web dev      # Next.js web app
pnpm --filter mobile dev   # Expo mobile app
```

### Platform-Specific Commands

```bash
# Mobile development
cd apps/mobile
pnpm ios       # iOS simulator
pnpm android   # Android emulator
pnpm web       # Web browser

# Web development
cd apps/web
pnpm dev       # Development server
pnpm build     # Production build
pnpm start     # Production server
```

## Commands

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `pnpm dev`         | Start all apps in development |
| `pnpm build`       | Build all apps for production |
| `pnpm lint`        | Lint all workspaces           |
| `pnpm check-types` | TypeScript type checking      |

## 🚀 Deployment

### Web App (Vercel)

```bash
cd apps/web
pnpm build
# Deploy to your preferred platform
```

### Mobile App

```bash
cd apps/mobile
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Documentation

### Core Technologies

- **[Next.js](https://nextjs.org/docs)** - React framework with App Router
- **[Expo](https://docs.expo.dev/)** - React Native development platform
- **[Turborepo](https://turbo.build/repo/docs)** - High-performance build system
- **[React Native](https://reactnative.dev/docs/getting-started)** - Cross-platform mobile development
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Type-safe JavaScript

### Styling & UI

- **[Tailwind CSS v3](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[NativeWind](https://www.nativewind.dev/)** - Tailwind CSS for React Native
- **[React Native Web](https://necolas.github.io/react-native-web/)** - RN components for web

### Development Tools

- **[pnpm](https://pnpm.io/motivation)** - Fast, disk space efficient package manager
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based routing for React Native

## Resources

- [Turborepo docs](https://turbo.build/repo/docs)
- [NativeWind docs](https://www.nativewind.dev/)
- [Expo docs](https://docs.expo.dev/)
- [Next.js docs](https://nextjs.org/docs)

## Author

Built by [Farhan Noor Abir](https://github.com/fnabir).

---

**Built with Turborepo • Next.js • Expo • NativeWind**

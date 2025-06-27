# ServiceSwap 🔄

A modern, full-featured service exchange platform built with Next.js, React, and TypeScript. Connect with your community to offer and discover local services through an intuitive, real-time messaging interface.

![ServiceSwap Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-13+-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4)

## ✨ Features

### 🎯 Core Functionality

- **Service Marketplace**: Browse, search, and filter available services by category
- **Real-time Messaging**: Built-in chat system with emoji support and read receipts
- **Smart Scheduling**: Interactive booking system with availability parsing
- **Service Matching**: Intelligent service recommendation and matching system
- **User Profiles**: Comprehensive user avatars with dynamic color generation

### 🎨 User Experience

- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern UI**: Beautiful animations and transitions using Framer Motion
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Real-time Updates**: Live typing indicators and message status updates

### 🔧 Advanced Features

- **Favorites System**: Save and filter favorite services and conversations
- **Booking Management**: Track upcoming appointments with cancellation support
- **Compact View**: Toggle between detailed and compact service card layouts
- **Smart Notifications**: Toast notifications for important actions and updates
- **Search & Filter**: Powerful search with category filtering

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Google Fonts (Poppins)](https://fonts.google.com/)

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ServiceSwap.git
   cd ServiceSwap
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ServiceSwap/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main application
├── components/            # Reusable UI components
│   ├── chat/             # Chat-related components
│   ├── services/         # Service-related components
│   ├── ui/               # Base UI components
│   └── index.ts          # Component exports
├── constants/            # Application constants
├── data/                # Mock data and initial state
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and styles
└── public/              # Static assets
```

## 🎮 Usage

### For Service Providers

1. **List Your Services**: Add your services with detailed descriptions, pricing, and availability
2. **Manage Bookings**: Accept and manage service requests through the messaging system
3. **Build Reputation**: Receive ratings and build your service provider profile

### For Service Seekers

1. **Discover Services**: Browse and search through available services in your area
2. **Book Instantly**: Schedule services directly through the integrated booking system
3. **Stay Connected**: Communicate with providers through real-time messaging
4. **Track Favorites**: Save preferred services and providers for quick access

### Key Interactions

- **Search**: Use the search bar to find specific services or providers
- **Filter**: Click category pills to filter services by type
- **Schedule**: Click "Schedule Now" on any service card to book an appointment
- **Chat**: Contact service providers directly through the messaging interface
- **Theme**: Toggle between dark and light modes using the theme switcher

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Customization

- **Theme Colors**: Modify colors in `tailwind.config.js`
- **Mock Data**: Update service data in `data/mockData.ts`
- **Styling**: Global styles in `app/globals.css`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper TypeScript types for new features
- Ensure responsive design across all screen sizes
- Test accessibility with screen readers
- Follow the existing code style and formatting

## 📋 Roadmap

- [ ] **User Authentication**: Add user registration and login
- [ ] **Real Database**: Replace mock data with persistent storage
- [ ] **Payment Integration**: Add payment processing for bookings
- [ ] **Geolocation**: Location-based service discovery
- [ ] **Reviews System**: User reviews and ratings
- [ ] **Push Notifications**: Real-time browser notifications
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Search**: Filters by price, location, availability
- [ ] **Service Categories**: Expanded category management
- [ ] **Admin Dashboard**: Service moderation and analytics

## 🐛 Known Issues

- **Theme Flash**: Brief theme flash on initial load (being optimized)
- **Mobile Keyboard**: Minor layout shifts with mobile keyboards
- **Emoji Picker**: Limited emoji selection (expanding soon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations
- **Lucide** for the comprehensive icon library
- **Community** for inspiration and feedback

## 📞 Support

If you have any questions or run into issues:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/ServiceSwap/issues)
- **Discussions**: [Join the discussion](https://github.com/yourusername/ServiceSwap/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ by [Your Name]**

_ServiceSwap - Connecting communities through shared services_

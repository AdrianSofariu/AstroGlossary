# AstroGlossary

Welcome to the Next.js Astrophotography Learning Project! 🌌

AstroGlossary is a visually stunning showcase of astrophotography images, built using the Next.js framework. It serves as a comprehensive learning exercise for exploring advanced Next.js features, routing, dynamic image handling, React context state, and backend integrations, all while bringing the beauty of space photography to the web.

The platform allows users to contribute photos of celestial bodies, creating a community database of the night sky, while serving as a practical environment to experiment with detailed astronomical data rendering, gallery management, and robust real-time API capabilities.

---

## Key Features

### Authentication & Security
- **Secure Access:** Features explicit email and password registration and login flows configured via dedicated clients and API routes.
- **Stateless Sessions:** Utilizes JWT-based authentication stored securely in `localStorage`, effectively protecting user accounts, UI actions, and API interactions.

### Posts & Gallery Views
- **Infinite Gallery:** Browse an ever-growing grid of high-quality astrophotography with lazy loading, infinite scrolling functionality, and a responsive layout.
- **Detailed Views:** Access dedicated post pages featuring large image views.
- **Content Management:** Upload new imagery using the dedicated form, and inline edit or delete your existing posts using robust edit-dialog interfaces and strict role/ownership-protected frontend configurations.

### Search, Filters & Pagination
- **Advanced Searching:** Rapidly locate specific targets using the integrated search bar and categorical type filters.
- **Stateful Pagination:** Seamless page-size controls and state synchronization natively communicate with the Context layer for smooth chunking of data.

### Real-Time & Live Updates
- **Socket.io Integration:** Harnesses live WebSocket connections for real-time statistical chart updates and seamless server-driven events.
- **Live Server Toggles:** Includes dynamic UI controls granting users the capability to manually toggle server-side data generation on or off.

### Statistics & Data Visualization
- **Dynamic Dashboards:** Leverages strictly interactive `Recharts`-based visualizations to display rich data metrics like pie charts categorizing the database by specific post type.

### Offline Support & Sync
- **Connection Resiliency:** Actively monitors `navigator.onLine` combined with targeted backend health polling.
- **Offline Mode:** Falls back securely to rendering locally cached posts and configurations directly from `localStorage` seamlessly.
- **Background Actions Queue:** Completely supports mutation caching (Add, Edit, Delete operations) stored to disk while offline, followed by executing background data flushes the moment internet service is fully restored.

### Direct File Uploads & Downloads
- **File Management:** Beyond static imagery, includes a versatile file uploader component enabling generic file ingestion, displaying available lists, and serving direct downloads backed natively by the REST endpoints.

### UI Design & Accessibility
- **Modern Design:** Constructed explicitly via Tailwind CSS v4 alongside accessible Radix UI primitives.
- **Fluid Animation:** Provides seamless micro-interactions using Framer Motion and maintains systematic component variants through `cva` (Class Variance Authority).

---

## Tech Stack & Tooling

**Frontend Core:**
- **Framework:** [Next.js](https://nextjs.org/) (React 19) utilizing robust TypeScript typing
- **Styling:** Tailwind CSS v4 & Class Variance Authority
- **Animations:** Framer Motion
- **UI Architecture:** Radix UI

**Data & Networking:**
- **Fetching Pipelines:** Axios
- **Real-Time Engine:** Socket.io
- **Visualization:** Recharts

**Backend Interactions:**
- **Custom API:** Front end expects and networks heavily with a specifically developed Express/Node API backend covering all core application logic.
- **Extensible Configuration:** Can be scaled dynamically to utilize external environments like Supabase gracefully if scopes expand beyond local testing.

**Developer Features & Utilities:**
- **Diagnostics:** Custom top-level health/status-banner verifying backend database connectivity.
- **Workflow Tools:** Complex pagination helpers and dynamically calculated date UI cues (highlighting items logged newly within this week).
- **Validation Blocks:** Explicit role enforcement preventing edit/delete component rendering to protect state out-of-the-box.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v20 or higher)
- npm or yarn
- Custom AstroGlossary Express API server up, running, and accessible for calls.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/astroglossary.git
   cd astroglossary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory. You must supply your standard targets:
   ```env
   NEXT_PUBLIC_API_CONNECTION_STRING=http://localhost:8000/api
   NEXT_PUBLIC_API_SOCKET=http://localhost:3001
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:** Navigate to [http://localhost:3000](http://localhost:3000) to begin browsing. 🚀

---

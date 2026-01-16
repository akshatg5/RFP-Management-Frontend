# AI-Powered RFP Management System - Frontend

A modern React frontend for an AI-powered Request for Proposal (RFP) management system that helps procurement managers create, manage, and compare vendor proposals using natural language processing and AI-driven recommendations.

## Features

### Core Functionality
- **Natural Language RFP Creation**: Generate structured RFPs from plain English descriptions using AI
- **Vendor Management**: Add and manage vendor contacts and information
- **RFP Distribution**: Send RFPs to multiple vendors with professional email templates
- **Manual Proposal Processing**: AI-powered parsing of vendor email responses
- **Proposal Comparison**: Side-by-side comparison with AI scoring and recommendations

### AI-Powered Features
- **Smart RFP Structuring**: Convert natural language requirements into organized RFP documents
- **Proposal Analysis**: Extract pricing, terms, and specifications from vendor emails
- **Scoring System**: 0-100 AI scoring based on multiple criteria
- **Recommendation Engine**: AI-driven vendor selection recommendations
- **Comparison Insights**: Detailed analysis of proposal strengths and weaknesses

## Tech Stack

- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **React Router v6** for client-side routing
- **TanStack Query (React Query)** for efficient data fetching and caching
- **React Hook Form** for form management
- **Axios** for API communication
- **Recharts** for data visualization
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── Badge.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── rfp/             # RFP-related components
│   ├── vendor/          # Vendor-related components
│   └── proposal/        # Proposal-related components
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── RFPsPage.tsx
│   ├── CreateRFPPage.tsx
│   ├── RFPDetailPage.tsx
│   ├── VendorsPage.tsx
│   ├── ComparisonPage.tsx
│   └── SettingsPage.tsx
├── services/            # API service layer
│   ├── api.ts
│   ├── rfpService.ts
│   ├── vendorService.ts
│   ├── proposalService.ts
│   └── emailService.ts
├── hooks/               # Custom React hooks
│   ├── useRFPs.ts
│   ├── useVendors.ts
│   ├── useProposals.ts
│   └── useEmailPolling.ts
├── types/               # TypeScript type definitions
│   ├── rfp.types.ts
│   ├── vendor.types.ts
│   └── proposal.types.ts
├── utils/               # Utility functions
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx
├── main.tsx
└── index.css
```

## API Integration

The frontend connects to a backend API with the following endpoints:

### RFP Endpoints
- `POST /rfps` - Create RFP from natural language
- `GET /rfps` - Get all RFPs
- `GET /rfps/:id` - Get RFP by ID
- `GET /rfps/:id/vendors` - Get RFP with vendors
- `POST /rfps/:id/send` - Send RFP to vendors
- `GET /rfps/:id/compare` - Compare proposals

### Vendor Endpoints
- `POST /vendors` - Create vendor
- `GET /vendors` - Get all vendors
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Proposal Endpoints
- `GET /proposals/rfp/:rfpId` - Get proposals by RFP
- `POST /rfps/:id/proposals` - Process manual proposal
- `GET /proposals/rfp/:rfpId/stats` - Get proposal statistics


## Usage Workflow

1. **Create RFP**: Use natural language to describe procurement needs
2. **Add Vendors**: Build your vendor database
3. **Send RFP**: Distribute to selected vendors
4. **Process Proposals**: Manually input vendor proposal emails for AI processing
5. **Compare Proposals**: View AI-powered comparison and recommendations
6. **Make Decision**: Select the best vendor based on AI insights

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Code Style

- Use TypeScript for all components and utilities
- Follow React functional component patterns with hooks
- Use Tailwind CSS classes for styling
- Implement proper error handling and loading states
- Write descriptive commit messages

### Testing

Add tests for critical business logic and API interactions:

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

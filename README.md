# Pregnancy Tracker Web App

A responsive web application to track pregnancy-related information including shopping lists, appointments, baby names, and hospital bag items.

## Tech Stack

- **Frontend**: React with Next.js, TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Chakra UI
- **Authentication**: Supabase Auth (Email/Password and Google OAuth)
- **Database**: Supabase
- **Data Backup**: Google Sheets API
- **Additional Features**: PWA capabilities, offline support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Cloud Platform account (for Google OAuth and Sheets API)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Database Setup

The application uses Supabase for database storage. You need to apply the database schema to your Supabase project. There are two ways to do this:

#### Option 1: Use the Supabase Dashboard (Recommended)

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to your project
3. Go to the SQL Editor
4. Copy the contents of the `supabase/migrations/001_initial_schema.sql` file
5. Paste it into the SQL Editor and run it

#### Option 2: Use the Supabase CLI (Requires Docker)

1. Start Docker
2. Run `npx supabase login` to authenticate
3. Run `npx supabase link --project-ref your_project_ref` to link your project
4. Run `npx supabase db push` to push the migrations

### Google OAuth Setup

1. Go to the Google Cloud Console
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/auth/callback` to the Authorized redirect URIs
6. Add `http://localhost:3000` to the Authorized JavaScript origins
7. Copy the Client ID and add it to your `.env.local` file

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication (Email/Password and Google OAuth)
- Shopping list management
- Appointment tracking
- Baby name suggestions and voting
- Hospital bag checklist
- Partner sharing functionality
- Google Sheets backup integration
- Offline support and PWA capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

- `/app` - Next.js app directory
- `/components` - Reusable UI components
- `/store` - Redux store and slices
- `/lib` - Utility functions and API clients
- `/types` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
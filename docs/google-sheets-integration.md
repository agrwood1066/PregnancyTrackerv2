# Google Sheets Integration Setup

This document provides instructions for setting up the Google Sheets integration for the Pregnancy Tracker app.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project with the Google Sheets API enabled

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type and click "Create"
3. Fill in the required information:
   - App name: "Pregnancy Tracker"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Add the following scopes:
   - `https://www.googleapis.com/auth/spreadsheets`
6. Click "Save and Continue"
7. Add test users if needed and click "Save and Continue"
8. Review your settings and click "Back to Dashboard"

### 3. Create OAuth Client ID

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add a name for your OAuth client
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (e.g., `https://your-app.vercel.app`)
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (for development)
   - `https://your-app.vercel.app/auth/google/callback` (for production)
7. Click "Create"
8. Copy the Client ID

### 4. Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
```

Replace `your-client-id` with the Client ID you copied in the previous step.

## Usage

The Google Sheets integration allows users to:

1. Backup their shopping list data to Google Sheets
2. Restore their shopping list data from a previously created backup

### Backup Process

1. Click the "Backup to Google Sheets" button
2. If not already authenticated, you'll be redirected to Google's OAuth consent screen
3. After authentication, a new Google Sheet will be created with your shopping list data
4. You'll be redirected back to the app with a link to view the created spreadsheet

### Restore Process

1. Click the "Restore from Google Sheets" button
2. Enter the Spreadsheet ID of a previously created backup
3. If not already authenticated, you'll be redirected to Google's OAuth consent screen
4. After authentication, your shopping list will be updated with the data from the spreadsheet

## Troubleshooting

- **Authentication Issues**: If you encounter authentication issues, try clearing your browser's local storage and cookies for the app domain.
- **API Quotas**: Be aware of Google's API quotas. The free tier includes 500 requests per day per project.
- **CORS Issues**: Ensure your authorized JavaScript origins and redirect URIs are correctly configured. 
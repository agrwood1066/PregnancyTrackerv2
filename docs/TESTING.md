# Testing Guide

This document provides instructions for testing the Pregnancy Tracker application.

## Prerequisites

Before running tests, make sure you have:

1. Set up your Supabase project and configured the environment variables
2. Installed all dependencies with `npm install`
3. Authenticated with Supabase (for tests that require authentication)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Running Tests

### Running All Tests

To run all tests, use the following command:

```bash
npm test
```

This will execute all test scripts in the `scripts` directory.

### Running Specific Tests

To run a specific test, use one of the following commands:

```bash
# Test Supabase connection
npm run test:supabase

# Test shopping list feature
npm run test:shopping
```

## Test Scripts

### Supabase Connection Test

The `test-supabase-connection.js` script tests:

1. Authentication with Supabase
2. Access to all database tables
3. Basic CRUD operations on the `shopping_items` table

### Shopping List Feature Test

The `test-shopping-feature.js` script tests:

1. Authentication with Supabase
2. Creating a household (if none exists)
3. Creating a shopping list
4. Adding items to the shopping list
5. Updating items in the shopping list
6. Fetching items from the shopping list
7. Deleting the shopping list

## Data Validation

The application includes data validation utilities in `lib/validation.ts` that ensure:

1. Required fields are present
2. Field types are correct
3. Field values are within acceptable ranges
4. Enum values are valid

These validation utilities are used in the Redux slices to validate data before sending it to Supabase.

## Manual Testing

In addition to automated tests, you should manually test:

1. User authentication flow
2. Shopping list functionality
3. Appointments functionality
4. Baby names functionality
5. Hospital bag functionality
6. Google Sheets backup and restore
7. Offline functionality
8. PWA installation and usage

## Reporting Issues

If you encounter any issues during testing, please:

1. Document the issue in detail
2. Include steps to reproduce
3. Include any error messages
4. Submit an issue in the GitHub repository 
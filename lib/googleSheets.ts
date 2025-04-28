import { ShoppingItem } from './supabase';

// Google Sheets API configuration
const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Function to initialize Google Sheets API
export const initGoogleSheets = async () => {
  try {
    // Check if the user is already authenticated
    const token = localStorage.getItem('google_sheets_token');
    if (token) {
      return token;
    }
    
    // If not authenticated, redirect to Google OAuth
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${SCOPES.join(' ')}`;
    
    window.location.href = authUrl;
    return null;
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw error;
  }
};

// Function to create a backup of shopping list items
export const backupShoppingList = async (items: ShoppingItem[]) => {
  try {
    const token = await initGoogleSheets();
    if (!token) return { success: false, message: 'Authentication required' };
    
    // Create a new spreadsheet
    const response = await fetch(`${SHEETS_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `Pregnancy Tracker Backup - ${new Date().toISOString().split('T')[0]}`,
        },
        sheets: [
          {
            properties: {
              title: 'Shopping List',
              gridProperties: {
                rowCount: items.length + 1,
                columnCount: 5,
              },
            },
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create spreadsheet');
    }
    
    const data = await response.json();
    const spreadsheetId = data.spreadsheetId;
    
    // Add headers
    await fetch(`${SHEETS_API_URL}/${spreadsheetId}/values/Shopping List!A1:E1?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [['ID', 'Name', 'Completed', 'Created At', 'Updated At']],
      }),
    });
    
    // Add data
    const values = items.map(item => [
      item.id,
      item.name,
      item.completed ? 'Yes' : 'No',
      item.created_at,
      item.updated_at,
    ]);
    
    await fetch(`${SHEETS_API_URL}/${spreadsheetId}/values/Shopping List!A2:E${items.length + 1}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values,
      }),
    });
    
    return { 
      success: true, 
      message: 'Backup created successfully',
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    };
  } catch (error) {
    console.error('Error backing up shopping list:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create backup',
    };
  }
};

// Function to restore shopping list items from a backup
export const restoreShoppingList = async (spreadsheetId: string) => {
  try {
    const token = await initGoogleSheets();
    if (!token) return { success: false, message: 'Authentication required' };
    
    // Get the data from the spreadsheet
    const response = await fetch(`${SHEETS_API_URL}/${spreadsheetId}/values/Shopping List!A2:E`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from spreadsheet');
    }
    
    const data = await response.json();
    if (!data.values || data.values.length === 0) {
      return { success: false, message: 'No data found in spreadsheet' };
    }
    
    // Convert the data to ShoppingItem objects
    const items: ShoppingItem[] = data.values.map((row: any[]) => ({
      id: row[0],
      name: row[1],
      completed: row[2] === 'Yes',
      created_at: row[3],
      updated_at: row[4],
      user_id: '', // This will be set when the items are added to the database
    }));
    
    return { success: true, items };
  } catch (error) {
    console.error('Error restoring shopping list:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to restore backup',
    };
  }
}; 
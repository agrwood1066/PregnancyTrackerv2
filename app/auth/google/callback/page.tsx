'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = () => {
      // Get the access token from the URL hash
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // Store the token in localStorage
        localStorage.setItem('google_sheets_token', accessToken);
        
        // Redirect back to the previous page or home
        const returnTo = localStorage.getItem('google_sheets_return_to') || '/';
        localStorage.removeItem('google_sheets_return_to');
        router.push(returnTo);
      } else {
        // Handle error
        console.error('Failed to get access token');
        router.push('/');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="50vh"
      p={4}
    >
      <Spinner size="xl" mb={4} />
      <Heading size="md" mb={2}>Authenticating with Google</Heading>
      <Text>Please wait while we complete the authentication process...</Text>
    </Box>
  );
} 
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={4}>
        <Heading size="lg">Authentication Error</Heading>
        <Text textAlign="center">
          There was an error processing your authentication request. This could be due to an expired or invalid authentication code.
        </Text>
        <Button as={Link} href="/auth" colorScheme="blue">
          Try Again
        </Button>
      </VStack>
    </Box>
  );
} 
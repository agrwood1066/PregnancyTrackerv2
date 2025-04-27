'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormErrorMessage,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = isSignUp
        ? await signUp(email, password, displayName)
        : await signIn(email, password);

      if (error) throw error;

      toast({
        title: isSignUp ? 'Account created!' : 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (isSignUp) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Sign In</Tab>
          <Tab>Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Heading size="md">Sign In to Your Account</Heading>
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </TabPanel>
          <TabPanel>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Heading size="md">Create a New Account</Heading>
                <FormControl isRequired>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  Sign Up
                </Button>
                <Text fontSize="sm" color="gray.500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </Text>
              </VStack>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider />
      <HStack width="full" spacing={4}>
        <Divider />
        <Text fontSize="sm" color="gray.500">OR</Text>
        <Divider />
      </HStack>
      <Button
        width="full"
        variant="outline"
        leftIcon={<Icon as={FcGoogle} boxSize={5} />}
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      >
        Continue with Google
      </Button>
      <Button
        variant="link"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </Button>
    </Box>
  );
} 
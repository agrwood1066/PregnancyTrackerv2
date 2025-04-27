'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast({
        title: 'Signed out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Welcome, {profile.display_name || 'User'}</Heading>
          <Button onClick={handleSignOut} colorScheme="red" variant="outline">
            Sign Out
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Shopping Lists</Heading>
            </CardHeader>
            <CardBody>
              <Text>Manage your pregnancy shopping lists</Text>
              <Button mt={4} colorScheme="blue" size="sm">
                View Lists
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Appointments</Heading>
            </CardHeader>
            <CardBody>
              <Text>Track your medical appointments</Text>
              <Button mt={4} colorScheme="blue" size="sm">
                View Appointments
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Baby Names</Heading>
            </CardHeader>
            <CardBody>
              <Text>Browse and save baby name ideas</Text>
              <Button mt={4} colorScheme="blue" size="sm">
                View Names
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Hospital Bag</Heading>
            </CardHeader>
            <CardBody>
              <Text>Prepare your hospital bag checklist</Text>
              <Button mt={4} colorScheme="blue" size="sm">
                View Checklist
              </Button>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
} 
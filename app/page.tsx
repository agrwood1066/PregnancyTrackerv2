'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import AuthForm from '@/components/auth/AuthForm'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Text>Loading...</Text>
          </Box>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Pregnancy Tracker
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={8}>
            Track your pregnancy journey with ease
          </Text>
          <AuthForm />
        </Box>
      </VStack>
    </Container>
  )
} 
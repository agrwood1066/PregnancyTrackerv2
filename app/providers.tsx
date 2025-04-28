'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthProvider } from '@/lib/auth'
import StoreProvider from './StoreProvider'
import Navbar from '@/components/navigation/Navbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <CacheProvider>
          <ChakraProvider>
            <Navbar />
            {children}
          </ChakraProvider>
        </CacheProvider>
      </AuthProvider>
    </StoreProvider>
  )
} 
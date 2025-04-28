'use client'

import { VStack, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react'
import { ShoppingItem } from '@/lib/supabase'
import ShoppingListItem from './ShoppingListItem'

interface ShoppingListProps {
  items: ShoppingItem[]
  loading: boolean
  error: string | null
}

export default function ShoppingList({ items, loading, error }: ShoppingListProps) {
  if (loading) {
    return (
      <VStack spacing={4} align="center" py={8}>
        <Spinner size="xl" />
        <Text>Loading items...</Text>
      </VStack>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  if (items.length === 0) {
    return (
      <VStack spacing={4} align="center" py={8}>
        <Text>No items in your shopping list yet.</Text>
      </VStack>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {items.map((item) => (
        <ShoppingListItem key={item.id} item={item} />
      ))}
    </VStack>
  )
} 
'use client'

import { useEffect } from 'react'
import { Container, VStack, Heading, Button, useDisclosure } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setItems, setLoading, setError } from '@/lib/features/shopping/shoppingSlice'
import ShoppingList from '@/components/shopping/ShoppingList'
import AddItemModal from '@/components/shopping/AddItemModal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

export default function ShoppingListPage() {
  const dispatch = useAppDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuth()
  const { items, loading, error } = useAppSelector((state) => state.shoppingList)

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) return

      dispatch(setLoading(true))
      try {
        const { data, error } = await supabase
          .from('shopping_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        dispatch(setItems(data))
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch items'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchItems()
  }, [dispatch, user])

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Shopping List</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Add Item
        </Button>
        <ShoppingList items={items} loading={loading} error={error} />
        <AddItemModal isOpen={isOpen} onClose={onClose} />
      </VStack>
    </Container>
  )
} 
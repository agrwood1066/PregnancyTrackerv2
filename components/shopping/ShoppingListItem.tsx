'use client'

import { Box, HStack, Text, IconButton, Checkbox, useToast } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { ShoppingItem } from '@/lib/supabase'
import { useDispatch } from 'react-redux'
import { deleteItem, toggleItem } from '@/store/shoppingSlice'

interface ShoppingListItemProps {
  item: ShoppingItem
}

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  const dispatch = useDispatch()
  const toast = useToast()

  const handleToggle = async () => {
    try {
      await dispatch(toggleItem(item.id))
      toast({
        title: 'Item updated',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Error updating item',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteItem(item.id))
      toast({
        title: 'Item deleted',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Error deleting item',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={item.completed ? 'gray.50' : 'white'}
    >
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Checkbox
            isChecked={item.completed}
            onChange={handleToggle}
            colorScheme="green"
          />
          <Text
            textDecoration={item.completed ? 'line-through' : 'none'}
            color={item.completed ? 'gray.500' : 'black'}
          >
            {item.name}
          </Text>
        </HStack>
        <HStack>
          <IconButton
            aria-label="Edit item"
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Delete item"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={handleDelete}
          />
        </HStack>
      </HStack>
    </Box>
  )
} 
'use client'

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Shopping List',
    href: '/shopping-list',
  },
  {
    label: 'Appointments',
    href: '/appointments',
  },
  {
    label: 'Baby Names',
    href: '/baby-names',
  },
  {
    label: 'Hospital Bag',
    href: '/hospital-bag',
  },
]

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link href="/">
            <Box
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              fontWeight="bold"
            >
              Pregnancy Tracker
            </Box>
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <HStack spacing={4}>
              {NAV_ITEMS.map((navItem) => (
                <Link key={navItem.label} href={navItem.href}>
                  <Box
                    p={2}
                    fontSize={'sm'}
                    fontWeight={pathname === navItem.href ? 600 : 400}
                    color={pathname === navItem.href ? 'blue.500' : 'gray.600'}
                    _hover={{
                      textDecoration: 'none',
                      color: 'blue.500',
                    }}
                  >
                    {navItem.label}
                  </Box>
                </Link>
              ))}
            </HStack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                {user.email}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link href="/auth/signin">
              <Button
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                Sign In
              </Button>
            </Link>
          )}
        </Stack>
      </Flex>

      {/* Mobile nav */}
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        pb={4}
        bg={useColorModeValue('white', 'gray.800')}
      >
        <Stack as={'nav'} spacing={4}>
          {NAV_ITEMS.map((navItem) => (
            <Link key={navItem.label} href={navItem.href}>
              <Box
                px={2}
                py={1}
                fontSize={'sm'}
                fontWeight={pathname === navItem.href ? 600 : 400}
                color={pathname === navItem.href ? 'blue.500' : 'gray.600'}
                _hover={{
                  textDecoration: 'none',
                  color: 'blue.500',
                }}
              >
                {navItem.label}
              </Box>
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  )
} 
'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  useToast, 
  Input, 
  FormControl, 
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { backupShoppingList, restoreShoppingList } from '@/lib/googleSheets';
import { useAppSelector } from '@/lib/hooks';
import { ShoppingItem } from '@/lib/supabase';

export default function GoogleSheetsBackup() {
  const [isLoading, setIsLoading] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [backupResult, setBackupResult] = useState<{
    success: boolean;
    message: string;
    spreadsheetUrl?: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Get shopping items from Redux store
  const items = useAppSelector((state) => state.shopping.items) as ShoppingItem[];

  const handleBackup = async () => {
    setIsLoading(true);
    setBackupResult(null);
    
    try {
      // Store the current page to return to after authentication
      localStorage.setItem('google_sheets_return_to', window.location.pathname);
      
      const result = await backupShoppingList(items);
      setBackupResult(result);
      
      if (result.success) {
        toast({
          title: 'Backup successful',
          description: `Your data has been backed up to Google Sheets.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Backup failed',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during backup:', error);
      toast({
        title: 'Backup failed',
        description: 'An unexpected error occurred during backup.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!spreadsheetId) {
      toast({
        title: 'Missing spreadsheet ID',
        description: 'Please enter a valid Google Sheets ID.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    setBackupResult(null);
    
    try {
      // Store the current page to return to after authentication
      localStorage.setItem('google_sheets_return_to', window.location.pathname);
      
      const result = await restoreShoppingList(spreadsheetId);
      
      if (result.success && result.items) {
        // Here you would typically dispatch an action to update the Redux store
        // For now, we'll just show a success message
        toast({
          title: 'Restore successful',
          description: `Restored ${result.items.length} items from Google Sheets.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Restore failed',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during restore:', error);
      toast({
        title: 'Restore failed',
        description: 'An unexpected error occurred during restore.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Google Sheets Backup</Text>
        
        {backupResult && (
          <Alert 
            status={backupResult.success ? 'success' : 'error'}
            borderRadius="md"
          >
            <AlertIcon />
            {backupResult.message}
            {backupResult.spreadsheetUrl && (
              <Button 
                size="sm" 
                ml={4} 
                colorScheme="blue" 
                onClick={() => window.open(backupResult.spreadsheetUrl, '_blank')}
              >
                Open Spreadsheet
              </Button>
            )}
          </Alert>
        )}
        
        <HStack spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={handleBackup} 
            isLoading={isLoading}
            loadingText="Backing up..."
          >
            Backup to Google Sheets
          </Button>
          
          <Button 
            colorScheme="green" 
            onClick={onOpen}
            isDisabled={isLoading}
          >
            Restore from Google Sheets
          </Button>
        </HStack>
      </VStack>
      
      {/* Restore Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Restore from Google Sheets</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Spreadsheet ID</FormLabel>
              <Input 
                placeholder="Enter Google Sheets ID" 
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                You can find the spreadsheet ID in the URL of your Google Sheet:
                https://docs.google.com/spreadsheets/d/<strong>spreadsheet-id</strong>/edit
              </Text>
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleRestore}
              isLoading={isLoading}
              loadingText="Restoring..."
            >
              Restore
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 
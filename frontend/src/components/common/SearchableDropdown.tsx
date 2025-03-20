import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { FaCaretDown } from 'react-icons/fa';
import { MdOutlineDone } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

interface ISearchableDropdown {
  options: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<string>>;
  label?: string;
}

const SearchableDropdown: React.FC<ISearchableDropdown> = ({
  options,
  selectedOption,
  setSelectedOption,
  label,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setIsOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Box w="300px" position="relative">
      {label && (
        <Text textStyle={'sm'} fontWeight={'bold'}>
          {label}
        </Text>
      )}
      <Flex
        justify={'space-between'}
        align="center"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        cursor="pointer"
        onClick={toggleDropdown}
        h={10}
        px={3}
        ref={dropdownRef}
        bg={'white'}
      >
        <Text textStyle={'sm'} color={'gray.600'}>
          {selectedOption || 'Select'}
        </Text>
        <Flex alignItems={'center'}>
          {selectedOption && (
            <IoMdClose
              onClick={() => setSelectedOption('')}
              cursor={'pointer'}
              color="black"
            />
          )}
          <FaCaretDown color="black" />
        </Flex>
      </Flex>

      {isOpen && (
        <Box
          position="absolute"
          mt={1}
          bg="white"
          w="100%"
          maxH="250px"
          overflowY="auto"
          boxShadow="md"
          borderRadius="md"
          zIndex="10"
        >
          <Flex flexDir="column">
            <Box bg={'white'} position="sticky" top={0} zIndex={2} p={2}>
              <Input
                placeholder="Search contacts"
                value={search}
                onChange={handleSearchChange}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
            </Box>
            {filteredOptions.map((option) => (
              <Flex
                key={option}
                py={2}
                px={4}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => handleOptionSelect(option)}
                justify={'space-between'}
                alignItems={'center'}
                borderTop={'1px solid #DCDCDC'}
                color="gray.600"
                fontWeight={'bold'}
              >
                {option}
                {option === selectedOption && <MdOutlineDone />}
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default SearchableDropdown;

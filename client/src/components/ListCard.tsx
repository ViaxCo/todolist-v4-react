import { useContext } from "react";
import { GlobalContext, List } from "../context/GlobalState";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  ChakraProps,
  Flex,
  forwardRef,
  IconButton,
  Link,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { isValidMotionProp, motion, MotionProps } from "framer-motion";

type Props = {
  list: List;
  i: number;
};

// Create a custom motion component from Flex
const MotionFlex = motion.custom(
  forwardRef<MotionProps & ChakraProps, "div">((props, ref) => {
    const chakraProps = Object.fromEntries(
      // do not pass framer props to DOM element
      Object.entries(props).filter(([key]) => !isValidMotionProp(key))
    );
    return <Flex ref={ref} {...chakraProps} />;
  })
);

const ListCard = ({ list, i }: Props) => {
  const { deleteList, setIsLoading } = useContext(GlobalContext);

  return (
    <MotionFlex
      align="center"
      minH="70px"
      borderBottom="1px solid"
      borderColor={useColorModeValue("#f1f1f1", "viaxco.400")}
      // Mount and exit animations of each card
      opacity="0"
      variants={{
        hidden: (i: number) => ({ opacity: 0, y: -50 * i }),
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.025,
          },
        }),
        exit: {
          opacity: 0,
          x: -50,
        },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={i}
    >
      <Box
        w={{ base: "82%", md: "83%" }}
        cursor="pointer"
        display="flex"
        alignItems="center"
      >
        {/* Combine react-router-dom Link and @chakra-ui Link props together */}
        <Link
          as={RouterLink}
          to={{ pathname: `/api/${list.name}` }}
          flex="1"
          textAlign="center"
          borderRadius="5px"
          onClick={() => setIsLoading && setIsLoading(true)}
        >
          <Text
            p="20px"
            fontSize="1.2rem"
            fontWeight={400}
            color={useColorModeValue("main.blue", "white")}
          >
            {list.name}
          </Text>
        </Link>
      </Box>
      <IconButton
        m="auto"
        aria-label="Delete List"
        variant="ghost"
        size={useBreakpointValue({ base: "sm", md: "md" })}
        colorScheme="red"
        onClick={() => list._id && deleteList && deleteList(list._id)}
        icon={<DeleteIcon />}
      />
    </MotionFlex>
  );
};

export default ListCard;

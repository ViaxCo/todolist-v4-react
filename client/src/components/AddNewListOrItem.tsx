import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  IconButton,
  Input,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { getDay } from "../utils/date";

type Props = {
  customListName?: string;
};

const AddNewListOrItem = ({ customListName }: Props) => {
  const [value, setValue] = useState("");
  const [adding, setAdding] = useState(false);
  const { listTitle, addList, addListItem, setIsLoading } = useContext(
    GlobalContext
  );
  const day = getDay();

  // Control the value of the input component
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // If on the home page
    if (listTitle === day) {
      setIsLoading && setIsLoading(true);
      addList && addList(value);
    }
    // If on the individual lists page
    if (customListName) {
      setAdding(true);
      setValue("");
      addListItem && (await addListItem(customListName, value));
      setAdding(false);
    }
  };

  return (
    <Flex
      as="form"
      method="post"
      action={listTitle === day ? "/api" : `/api/${customListName}`}
      onSubmit={handleSubmit}
      align="center"
      minH="70px"
      ml="10px"
    >
      <FormControl>
        <Input
          textAlign="center"
          height="50px"
          w={{ base: "80%", md: "85%" }}
          border="none"
          borderRadius={0}
          bg="transparent"
          fontSize="1.2rem"
          fontWeight={400}
          color={useColorModeValue("main.blue", "white")}
          name="text"
          type="text"
          value={value}
          onChange={handleChange}
          isRequired={true}
          // autoFocus={listTitle === day ? true : false}
          autoComplete="off"
          placeholder={listTitle === day ? "New List" : "New Item"}
          _focus={{
            outline: "none",
            boxShadow: useColorModeValue(
              "inset 0 -2.5px 0 0 #32469b",
              "inset 0 -2.5px 0 0 #9eabe3"
            ),
          }}
          _placeholder={{
            color: useColorModeValue("grey", "viaxco.300"),
            opacity: 1,
          }}
        />
        <IconButton
          type="submit"
          aria-label={listTitle === day ? "Add List" : "Add Item"}
          borderRadius="50%"
          minW="50px"
          minH="50px"
          colorScheme="viaxco"
          icon={adding ? <Spinner /> : <AddIcon />}
        />
      </FormControl>
    </Flex>
  );
};

export default AddNewListOrItem;

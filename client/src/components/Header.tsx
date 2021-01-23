import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Box, Heading } from "@chakra-ui/react";

const Header = () => {
  const { listTitle } = useContext(GlobalContext);

  return (
    <Box
      boxShadow="3px 3px 5px 0px rgba(4,16,68,0.5)"
      bg="main.blue"
      textAlign="center"
      className="box"
    >
      <Heading as="h1" color="white" p="10px">
        {listTitle}
      </Heading>
    </Box>
  );
};

export default Header;

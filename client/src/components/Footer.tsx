import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Box, Link } from "@chakra-ui/react";
import { Link as RouterLink, Route, Switch } from "react-router-dom";

const Footer = () => {
  const { setIsLoading } = useContext(GlobalContext);
  return (
    <Box
      as="footer"
      className="box"
      boxShadow="5px 5px 15px -5px rgba(0, 0, 0, 0.3)"
      bg="main.blue"
      color="white"
      w="fit-content"
      textAlign="center"
      mt={{ md: "150px" }}
      p="10px"
    >
      &copy; Created by{" "}
      <Switch>
        <Route exact path="/about">
          {/* Combine react-router-dom Link and @chakra-ui Link props together */}
          <Link as={RouterLink} to="/" textDecor="underline">
            ViaxCo
          </Link>
        </Route>
        <Route path="/">
          <Link
            as={RouterLink}
            to="/about"
            textDecor="underline"
            onClick={() => setIsLoading && setIsLoading(true)}
          >
            ViaxCo
          </Link>
        </Route>
      </Switch>
    </Box>
  );
};

export default Footer;

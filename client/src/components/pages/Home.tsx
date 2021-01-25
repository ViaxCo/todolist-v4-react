import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalState";
import Header from "../Header";
import HeaderTwo from "../HeaderTwo";
import Card from "../Card";
import Footer from "../Footer";
import { Spinner, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Home = () => {
  const { getLists, isLoading } = useContext(GlobalContext);
  // useColorMode for color mode check
  const { colorMode } = useColorMode();

  useEffect(() => {
    getLists && getLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {/* Show spinner when fetching Lists */}
      {isLoading ? (
        <Spinner
          color={colorMode === "light" ? "main.blue" : "viaxco.50"}
          size="xl"
          thickness="4px"
          position="absolute"
          top="-35%"
          left="0"
          bottom="0"
          right="0"
          margin="auto"
        />
      ) : (
        <div
          style={{ position: "relative", overflow: "hidden" }}
          className="container"
        >
          <motion.div
            initial={{ y: -20, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.2,
            }}
          >
            <Header />
            <HeaderTwo />
            <Card />
          </motion.div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Toaster } from "react-hot-toast";
import Main from "./components/Main";
import { Container } from "@mui/material";

function App() {
  return (
    <Container maxWidth="xl" sx={{ paddingTop: 5 }}>
      <Toaster />
      <Main />
    </Container>
  );
}

export default App;

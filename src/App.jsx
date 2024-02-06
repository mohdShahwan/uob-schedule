import { Edit as EditIcon } from "@mui/icons-material";
import { Box, Container, Fab, Stack } from "@mui/material";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Calendar from "./components/Calendar";
import CoursesCard from "./components/CoursesCard";
import { useGenerateSchedule } from "./hooks/useGenerateSchedule";
import { Toaster } from "react-hot-toast";

const startOfClassesDate = new Date(2024, 1, 11);
// const holidays = []
const endOfClassesDate = new Date(2024, 4, 28);
const today = new Date();

function App() {
  const [courses, setCourses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const { events, maxTime, minTime } = useGenerateSchedule({
    courses,
    setCurrentDate,
    startOfClassesDate,
    endOfClassesDate,
  });

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 5 }}>
      <Toaster />
      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        <Box sx={{ width: { xs: "100%", lg: "75%" } }}>
          <Calendar
            events={events}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            minTime={minTime}
            maxTime={maxTime}
          />
        </Box>
        <Box sx={{ display: { xs: "none", lg: "block" }, width: "25%" }}>
          <CoursesCard setCourses={setCourses} />
        </Box>
      </Stack>
      <Fab
        sx={{
          position: "fixed",
          top: "0.75rem",
          right: "0.75rem",
          display: {
            xs: "inline-block",
            lg: "none",
          },
        }}
        variant="extended"
        color="primary"
      >
        <EditIcon />
      </Fab>
    </Container>
  );
}

export default App;

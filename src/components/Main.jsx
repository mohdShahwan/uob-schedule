import { Edit as EditIcon } from "@mui/icons-material";
import { Box, Fab, Stack } from "@mui/material";
import Calendar from "../components/Calendar";
import CoursesCard from "../components/CoursesCard";
import { useState } from "react";
import { useGenerateSchedule } from "../hooks/useGenerateSchedule";

const startOfClassesDate = new Date(2024, 8, 8);
// const holidays = []
const endOfClassesDate = new Date(2024, 11, 19);
const today = new Date();

function Main() {
  const [courses, setCourses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const { events, maxTime, minTime } = useGenerateSchedule({
    courses,
    setCurrentDate,
    startOfClassesDate,
    endOfClassesDate,
  });

  return (
    <>
      <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
        <Box
          className="schedule"
          sx={{ width: { xs: "100%", lg: "75%" }, height: "95dvh" }}
        >
          <Calendar
            events={events}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            minTime={minTime}
            maxTime={maxTime}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: "25%",
          }}
        >
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
    </>
  );
}

export default Main;
import { Grid } from "@mui/material";
import Calendar from "./components/Calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CoursesCard from "./components/CoursesCard";
import { useState } from "react";
import { useGenerateSchedule } from "./hooks/useGenerateSchedule";

const startOfClassesDate = new Date(2024, 1, 11);
// const holidays = []
const endOfClassesDate = new Date(2024, 4, 28);

function App() {
  const [courses, setCourses] = useState([]);
  const { events, currentDate, maxTime, minTime } = useGenerateSchedule({
    courses,
    startOfClassesDate,
    endOfClassesDate,
  });

  console.log(courses);

  return (
    <Grid sx={{ paddingLeft: 5, paddingTop: 5 }} container spacing={4}>
      <Grid item xs={8}>
        <Calendar
          events={events}
          currentDate={currentDate}
          minTime={minTime}
          maxTime={maxTime}
        />
      </Grid>
      <Grid item xs={3}>
        <CoursesCard setCourses={setCourses} />
      </Grid>
    </Grid>
  );
}

export default App;

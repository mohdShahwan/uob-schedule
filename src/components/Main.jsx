import { Edit as EditIcon } from "@mui/icons-material";
import { Box, Card, Fab, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Calendar from "../components/Calendar";
import CoursesCard from "../components/CoursesCard";
import CoursesForm from "../components/CoursesForm";
import { useGenerateSchedule } from "../hooks/useGenerateSchedule";

const startOfClassesDate = new Date(2024, 1, 11);
const endOfClassesDate = new Date(2024, 4, 28);
const today = new Date();

function Main() {
  const [courses, setCourses] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [showCoursesForm, setShowCoursesForm] = useState(false);

  const { events, maxTime, minTime } = useGenerateSchedule({
    courses,
    setCurrentDate,
    startOfClassesDate,
    endOfClassesDate,
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={4}
        sx={{
          padding: isSmallScreen ? 1 : 2,
          width: "100%",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Box
          className="schedule"
          sx={{
            flex: 1,
            height: "100%",
            overflow: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            boxShadow: theme.shadows[2],
          }}
        >
          <Calendar
            events={events}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            minTime={minTime}
            maxTime={maxTime}
          />
        </Box>
        {!isSmallScreen && (
          <Box
            sx={{
              width: "25%",
              height: "100%",
              overflow: "auto",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: theme.shadows[2],
            }}
          >
            <CoursesCard setCourses={setCourses} />
          </Box>
        )}
      </Stack>
      {showCoursesForm && (
        <Card
          variant="outlined"
          sx={{
            position: "fixed",
            top: "5rem",
            right: "3rem",
            width: '90vw',
            maxWidth: '500px',
            zIndex: theme.zIndex.tooltip + 1, // Ensure it is above other elements
            padding: 2,
          }}
        >
          <CoursesForm setCourses={setCourses} />
        </Card>
      )}
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
        onClick={() => setShowCoursesForm(prev => !prev)}
      >
        <EditIcon />
      </Fab>
    </>
  );
}

export default Main;

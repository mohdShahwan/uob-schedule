import { Grid } from "@mui/material";
import Calendar from "./components/calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CoursesCard from "./components/CoursesCard";
import { useEffect, useState } from "react";

const today = new Date();
const startOfClassesDate = new Date(2023, 11, 3);
// const startOfClassesDate = new Date(2024, 2, 11);
// const holidays = []
// const endOfClassesDate = new Date(2023, 11, 7);
const endOfClassesDate = new Date(2024, 5, 28);

function App() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [minTime, setMinTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7)
  );
  const [maxTime, setMaxTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22)
  );

  useEffect(() => {
    const generateSchedule = () => {
      const newEvents = [];
      // generate lectures events
      for (
        const date = new Date(startOfClassesDate);
        date <= endOfClassesDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayNumber = date.getDay();
        for (const course of courses) {
          const searchDate = course.courseTimes.filter(
            (reccurance) => dayNumber === reccurance.day
          );
          if (searchDate.length > 0) {
            for (const reccurance of searchDate) {
              const startTime = reccurance.startTime.split(":");
              const endTime = reccurance.endTime.split(":");
              const start = new Date(date);
              const end = new Date(date);
              start.setHours(+startTime[0], +startTime[1]);
              end.setHours(+endTime[0], +endTime[1]);
              newEvents.push({
                title: course.courseDetails.code,
                start,
                end,
                location: reccurance.location,
                instructor: course.courseDetails.instructor,
                color: course.courseDetails.color,
              });
            }
          }
        }
      }
      // generate exams events
      for (const course of courses) {
        if (course.courseDetails.exam) {
          const start = course.courseDetails.exam.time.start;
          const end = course.courseDetails.exam.time.end;
          newEvents.push({
            title: `${course.courseDetails.code} Final Exam`,
            start,
            end,
            color: course.courseDetails.color,
          });
        }
      }
      setCurrentDate(newEvents[0].start);
      setEvents(newEvents);
    };
    const findMinMaxDate = () => {
      const startTimeArray = [];
      const endTimeArray = [];
      for (const course of courses) {
        for (const time of course.courseTimes) {
          const startTime = time.startTime.split(":");
          const endTime = time.endTime.split(":");
          const start = new Date(today);
          const end = new Date(today);
          start.setHours(+startTime[0], +startTime[1]);
          end.setHours(+endTime[0], +endTime[1]);
          startTimeArray.push(start);
          endTimeArray.push(end);
        }
        if (course.courseDetails.exam) {
          startTimeArray.push(course.courseDetails.exam.time.start);
          endTimeArray.push(course.courseDetails.exam.time.end);
        }
      }
      setMinTime(new Date(Math.min(...startTimeArray)));
      setMaxTime(new Date(Math.max(...endTimeArray)));
    };
    if (courses.length > 0) {
      generateSchedule();
      findMinMaxDate();
    }
  }, [courses]);

  return (
    <Grid
      sx={{ flexGrow: 1, paddingLeft: 5, paddingTop: 5 }}
      container
      spacing={4}
    >
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

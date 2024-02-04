import { useEffect, useState } from "react";

const today = new Date();

export function useGenerateSchedule({
  courses,
  startOfClassesDate,
  endOfClassesDate,
}) {
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
            (recurrence) => dayNumber === recurrence.day
          );
          if (searchDate.length > 0) {
            for (const recurrence of searchDate) {
              const startTime = recurrence.startTime.split(":");
              const endTime = recurrence.endTime.split(":");
              const start = new Date(date);
              const end = new Date(date);
              start.setHours(+startTime[0], +startTime[1]);
              end.setHours(+endTime[0], +endTime[1]);
              newEvents.push({
                title: course.courseDetails.code,
                start,
                end,
                location: recurrence.location,
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
  }, [courses, startOfClassesDate, endOfClassesDate]);

  return { events, currentDate, minTime, maxTime };
}

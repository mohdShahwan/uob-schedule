import { useEffect, useState } from "react";

const today = new Date();

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return [
    `${hours.toString().padStart(2, "0")}`,
    `${mins.toString().padStart(2, "0")}`,
  ];
};

export function useGenerateSchedule({
  courses,
  setCurrentDate,
  startOfClassesDate,
  endOfClassesDate,
}) {
  const [events, setEvents] = useState([]);
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
                type: "lecture",
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
            type: "exam",
          });
        }
      }
      setCurrentDate(newEvents[0].start);
      setEvents(newEvents);
    };
    const findMinMaxDate = () => {
      let minStartTime = Infinity;
      let maxStartTime = -Infinity;
      for (const course of courses) {
        for (const time of course.courseTimes) {
          const startTime = time.startTime.split(":");
          const endTime = time.endTime.split(":");
          const start = new Date(today);
          const end = new Date(today);
          start.setHours(+startTime[0], +startTime[1]);
          end.setHours(+endTime[0], +endTime[1]);
          const startMinutesSinceMidnight =
            start.getHours() * 60 + start.getMinutes();
          const endMinutesSinceMidnight =
            end.getHours() * 60 + end.getMinutes();
          if (startMinutesSinceMidnight < minStartTime) {
            minStartTime = startMinutesSinceMidnight;
          }
          if (endMinutesSinceMidnight > maxStartTime) {
            maxStartTime = endMinutesSinceMidnight;
          }
        }
        if (course.courseDetails.exam) {
          const examTimeObj = course.courseDetails.exam.time;
          const start = new Date(examTimeObj.start);
          const end = new Date(examTimeObj.end);
          const startMinutesSinceMidnight = start.getHours() * 60 + 0;
          const endMinutesSinceMidnight =
            end.getHours() * 60 + end.getMinutes();
          if (startMinutesSinceMidnight < minStartTime) {
            minStartTime = startMinutesSinceMidnight;
          }
          if (endMinutesSinceMidnight > maxStartTime) {
            maxStartTime = endMinutesSinceMidnight;
          }
        }
      }
      // get proper format HH:mm
      const [minHours, minMinutes] = formatTime(minStartTime);
      const [maxHours, maxMinutes] = formatTime(maxStartTime);
      const minDateObj = new Date();
      const maxDateObj = new Date();
      minDateObj.setHours(minHours, minMinutes, 0, 0);
      maxDateObj.setHours(maxHours, maxMinutes, 0, 0);
      setMinTime(minDateObj);
      setMaxTime(maxDateObj);
    };
    if (courses.length > 0) {
      generateSchedule();
      findMinMaxDate();
    }
  }, [courses, setCurrentDate, startOfClassesDate, endOfClassesDate]);

  return { events, minTime, maxTime };
}

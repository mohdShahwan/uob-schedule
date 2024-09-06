import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import toast from "react-hot-toast";
import { colors } from "../constants/colors";
import { convertNumToTime } from "../utils/convertNumToTime";
import { getDayNum } from "../utils/getDayNum";

const MIN_COURSES = 1;
const MAX_COURSES = 7;

function CoursesForm({ setCourses }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [isLoadingYearSem, setIsLoadingYearSem] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      courses: Array.from({ length: 4 }, () => ({ code: "", section: "" })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
    rules: { minLength: MIN_COURSES, maxLength: MAX_COURSES },
  });

  useFormPersist("courses", { watch, setValue, storage: window.localStorage });

  const fetchScheduleInfo = async (params) => {
    try {
      const response = await axios.get(
        "https://usis.uob.edu.bh/uob_sis_WS/IntegrationModule.asmx/GetScheduleInfo",
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching schedule info: " + error.message);
    }
  };

  const parseCourseData = (data, courses) => {
    const coursesData = [];
    const [requestedCourses, requestedCoursesTimes] = data;
    for (const [index, courseData] of requestedCourses.entries()) {
      const courseCode = courseData[0].c;
      const neededSection = +courses.find(
        (course) => course.code.toLowerCase() === courseCode.toLowerCase()
      ).section;
      const sectionIndex = courseData.findIndex(
        (section) => +section.s === neededSection
      );
      const courseDetails = courseData[sectionIndex];
      const courseTimes = requestedCoursesTimes[index][sectionIndex].map(
        (recurrence) => ({
          day: getDayNum(recurrence.d),
          startTime: convertNumToTime(recurrence.f),
          endTime: convertNumToTime(recurrence.t),
          campus: recurrence.c === "S" ? "Sakhir" : "Salmaniya",
          location: recurrence.i.split("  ")[0],
        })
      );
      let exam = null;
      if (courseDetails.e) {
        const [examDate, examTime] = courseDetails.e.split(" ");
        const [day, month, year] = examDate.split("-").map(Number);
        const [startTime, endTime] = examTime.split("-").map((t) =>
          t.split(":").map(Number)
        );
        exam = {
          date: new Date(year, month - 1, day),
          time: {
            start: new Date(year, month - 1, day, ...startTime),
            end: new Date(year, month - 1, day, ...endTime),
          },
        };
      }
      coursesData.push({
        courseDetails: {
          code: courseDetails.c,
          section: +courseDetails.s,
          exam,
          instructor: courseDetails.i,
          color: colors[index],
        },
        courseTimes,
      });
    }
    return coursesData;
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const params = values.courses.reduce((acc, course, index) => {
        if (course.code) acc[`p${index + 1}`] = course.code;
        return acc;
      }, { p1: "null", p2: "null", p3: "null", p4: "null", p5: "null", p6: "null", p7: "null" });

      const data = await fetchScheduleInfo(params);
      const coursesData = parseCourseData(data, values.courses);
      setCourses(coursesData);
      toast.success("Schedule generated successfully");
    } catch (error) {
      console.error("Error occurred: " + error.message);
      toast.error(
        "Please make sure you entered correct course codes and section numbers"
      );
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchYearAndSemester = async () => {
    setIsLoadingYearSem(true);
    try {
      const response = await axios.get(
        "https://usis.uob.edu.bh/uob_sis_WS/IntegrationModule.asmx/GetPLANNER_YERSMS"
      );
      const data = response.data[0];
      const currentAcademicYear = data.YER;
      const nextAcademicYear = +currentAcademicYear + 1;
      const academicYearFullFormat = `${currentAcademicYear}/${nextAcademicYear}`;
      const academicSemester = data.SMS;
      const semester = academicSemester === "3" ? "Summer" : academicSemester;
      setCurrentYear(academicYearFullFormat);
      setCurrentSemester(semester);
    } catch (error) {
      console.error("Error occurred: " + error.message);
      toast.error("Error while getting current year and semester");
    } finally {
      setIsLoadingYearSem(false);
    }
  };

  useEffect(() => {
    fetchYearAndSemester();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Typography variant="h3">Courses 📚</Typography>
        <Typography
          sx={{ mb: 1.5, ml: 1.5 }}
          color="text.secondary"
          gutterBottom
          isLoading={isLoadingYearSem}
        >
          {currentYear} - {currentSemester}
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} useFlexGap flexWrap="wrap">
          {fields.map((field, index) => (
            <Stack
              key={field.id}
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <TextField
                fullWidth
                label="Course"
                {...register(`courses.${index}.code`, { required: true })}
                InputProps={{
                  style: { textTransform: 'uppercase' },
                }}
                onChange={(event) => {
                  setValue(
                    `courses.${index}.code`,
                    event.target.value.toUpperCase()
                  );
                }}
              />
              <TextField
                fullWidth
                label="Section"
                {...register(`courses.${index}.section`, {
                  required: true,
                  pattern: /^\d{1,3}$/,
                })}
              />
              {fields.length > MIN_COURSES && (
                <IconButton
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="success"
          fullWidth
          type="submit"
          disabled={isLoading}
        >
          Generate My Schedule
        </Button>
        {fields.length < MAX_COURSES && (
          <Button variant="contained" onClick={() => append()}>
            <AddIcon />
          </Button>
        )}
      </CardActions>
    </form>
  );
}

CoursesForm.propTypes = {
  setCourses: PropTypes.func.isRequired,
};

export default CoursesForm;

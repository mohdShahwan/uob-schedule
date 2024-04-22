import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CardActions,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import toast from "react-hot-toast";
import { convertNumToTime } from "../utils/convertNumToTime";
import { getDayNum } from "../utils/getDayNum";
import { colors } from "../constants/colors";

function CoursesForm({ setCourses }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      courses: Array.from({ length: 4 }, () => {
        return { code: "", section: "" };
      }),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
    rules: { minLength: 4, maxLength: 7 },
  });
  useFormPersist("courses", { watch, setValue, storage: window.localStorage });

  const onSubmit = async (values) => {
    try {
      const params = {
        p1: "null",
        p2: "null",
        p3: "null",
        p4: "null",
        p5: "null",
        p6: "null",
        p7: "null",
      };
      const courses = values.courses;
      for (const index in courses) {
        if (courses[index].code) params[`p${+index + 1}`] = courses[index].code;
      }
      setIsLoading(true);
      const response = await axios.get(
        "https://usis.uob.edu.bh/uob_sis_WS/IntegrationModule.asmx/GetScheduleInfo",
        { params }
      );
      const coursesData = [];
      const data = response.data;
      // data will always contain two arrays
      // first array will have different arrays for each course
      // each course array will contain all sections
      const requestedCourses = data[0];
      const requestedCoursesTimes = data[1];
      for (const index in requestedCourses) {
        // each element in requested courses is an array of sections
        const courseCode = requestedCourses[index][0].c;
        // get user section from all sections
        const neededSection = +courses.find(
          (course) => course.code.toLowerCase() === courseCode.toLowerCase()
        ).section;
        const sectionIndex = requestedCourses[index].findIndex(
          (section) => +section.s === neededSection
        );
        const courseDetails = requestedCourses[index][sectionIndex];
        const courseTimes = requestedCoursesTimes[index][sectionIndex].map(
          (recurrence) => {
            return {
              day: getDayNum(recurrence.d),
              startTime: convertNumToTime(recurrence.f),
              endTime: convertNumToTime(recurrence.t),
              campus: recurrence.c === "S" ? "Sakhir" : "Salmaniya",
              location: recurrence.i.split("  ")[0],
            };
          }
        );
        // Exam
        let exam = null;
        if (courseDetails.e) {
          const courseExam = courseDetails.e.split(" ");
          const courseExamDate = courseExam[0].split("-");
          const courseExamDateJs = new Date(
            courseExamDate[2],
            courseExamDate[1] - 1,
            courseExamDate[0]
          );
          const courseExamTime = courseExam[1].split("-");
          const courseExamStartTime = courseExamTime[0].split(":");
          const courseExamStartTimeJs = new Date(courseExamDateJs);
          courseExamStartTimeJs.setHours(
            courseExamStartTime[0],
            courseExamStartTime[1],
            courseExamStartTime[2]
          );
          const courseExamEndTime = courseExamTime[1].split(":");
          const courseExamEndTimeJs = new Date(courseExamDateJs);
          courseExamEndTimeJs.setHours(
            courseExamEndTime[0],
            courseExamEndTime[1],
            courseExamEndTime[2]
          );
          exam = {
            date: courseExamDateJs,
            time: { start: courseExamStartTimeJs, end: courseExamEndTimeJs },
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
      setCourses(coursesData);
      toast.success("Schedule generated successfully");
    } catch (error) {
      console.error("Error Ocurred! " + error);
      toast.error(
        "Please make sure you entered correct course codes and section numbers"
      );
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          Courses 📚
        </Typography>
        {/* TODO: For better UX, use helpertext to show error messages */}
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
                onKeyUp={(event) => {
                  setValue(
                    `courses.${index}.code`,
                    event.target.value.toUpperCase()
                  );
                }}
                {...register(`courses.${index}.code`, { required: true })}
              />
              <TextField
                fullWidth
                label="Section"
                {...register(`courses.${index}.section`, {
                  required: true,
                  pattern: /^\d{1,3}$/,
                })}
              />
              {fields.length > 4 && (
                <IconButton
                  onClick={() => {
                    if (fields.length > 4) remove(index);
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
        {fields.length < 7 && (
          <Button variant="contained" onClick={() => append()}>
            <AddIcon />
          </Button>
        )}
      </CardActions>
    </form>
  );
}

export default CoursesForm;

CoursesForm.propTypes = {
  setCourses: PropTypes.func,
};

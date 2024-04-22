import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import CoursesForm from "./CoursesForm";

const CoursesCard = ({ setCourses }) => {
  return (
    <Card variant="outlined">
      <CoursesForm setCourses={setCourses} />
    </Card>
  );
};

export default CoursesCard;

CoursesCard.propTypes = {
  setCourses: PropTypes.func,
};

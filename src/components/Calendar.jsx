import { Box } from "@mui/material";
import moment from "moment";
import { darken } from "polished";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { Calendar as RBC, momentLocalizer } from "react-big-calendar";
import "../styles/calendar.scss";
import Event from "./Event";

const localizer = momentLocalizer(moment);

const Calendar = ({
  events,
  currentDate,
  setCurrentDate,
  minTime,
  maxTime,
}) => {
  const eventPropGetter = (event) => {
    // let backgroundColor = "#fef1ef";
    let backgroundColor = event.color;

    const borderStyle = {
      borderLeft: `4px solid ${darken(0.3, backgroundColor)}`, // Use the same background color for the border
      borderTop: `0px solid `, // Use the same background color for the border
      borderRight: `0px solid `, // Use the same background color for the border
      borderBottom: `0px solid `, // Use the same background color for the border
      color: "#003C83",
    };

    return {
      style: {
        backgroundColor,
        ...borderStyle, // Merge the border style with the background color
      },
    };
  };

  const components = useMemo(
    () => ({
      event: (props) => <Event {...props} />,
    }),
    []
  );
  return (
    <Box
      className="schedule"
      style={{
        height: "95dvh",
      }}
    >
      <RBC
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        timeslots={4}
        step={15}
        min={minTime}
        max={maxTime}
        defaultView="week"
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        components={components}
        tooltipAccessor={({ instructor }) => `${instructor}`}
      />
    </Box>
  );
};

Calendar.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.object,
  setCurrentDate: PropTypes.func,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
};

export default Calendar;

import { Calendar as RBC, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import PropTypes from "prop-types";
import "../styles/calendar.scss";
import { useMemo } from "react";
import { darken } from "polished";
import { Container } from "@mui/material";
import Event from "./Event";

const localizer = momentLocalizer(moment);

const Calendar = ({ events, currentDate, minTime, maxTime }) => {
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
    <Container
      className="schedule"
      style={{
        height: "95dvh",
      }}
    >
      <RBC
        localizer={localizer}
        events={events}
        //   events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        timeslots={4}
        step={15}
        min={minTime}
        max={maxTime}
        defaultView="week"
        defaultDate={currentDate}
        components={components}
      />
    </Container>
  );
};

Calendar.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.object,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
};

export default Calendar;

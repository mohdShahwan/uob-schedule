import moment from "moment";
import { darken } from "polished";
import PropTypes from "prop-types";
import { Calendar as RBC, momentLocalizer } from "react-big-calendar";
import "../styles/calendar.scss";
import CustomToolbar from "./CustomToolbar";
import Event from "./Event";

const localizer = momentLocalizer(moment);

Calendar.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.object,
  setCurrentDate: PropTypes.func,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
};

function Calendar({ events, currentDate, setCurrentDate, minTime, maxTime }) {
  const eventPropGetter = (event) => {
    // let backgroundColor = "#fef1ef";
    let backgroundColor = event.color;

    const borderStyle = {
      borderLeft: `4px solid ${darken(0.3, backgroundColor)}`,
      borderTop: `0px solid `,
      borderRight: `0px solid `,
      borderBottom: `0px solid `,
      color: "#003C83",
    };

    return {
      style: {
        backgroundColor,
        ...borderStyle,
      },
    };
  };

  const components = {
    event: (props) => <Event {...props} />,
    toolbar: (props) => (
      <CustomToolbar
        {...props}
        setCurrentDate={setCurrentDate}
        events={events}
      />
    ),
  };

  return (
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
      tooltipAccessor={({ instructor }) => instructor || ""}
    />
  );
}

export default Calendar;

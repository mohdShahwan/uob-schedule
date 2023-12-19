import { Calendar as RBC, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import PropTypes from "prop-types";
import "../styles/calendar.scss";
import { useMemo } from "react";
import { darken } from "polished";

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
      event: ({ title, event }) => {
        return (
          <div className="h-full relative rbc-event-content-container">
            <div className="time">
              {moment(event.start).format("h:mm A")} -{" "}
              {moment(event.end).format("h:mm A")}
            </div>
            <div className="title">{title}</div>
            <div className="location">{event.location}</div>
            {/* <div className="absolute bottom-0">{event.instructor}</div> */}
          </div>
        );
      },
    }),
    []
  );
  return (
    <div className="schedule overflow-auto">
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
        // date={currentDate}
        defaultView="week"
        defaultDate={currentDate}
        components={components}
      />
    </div>
  );
};

Calendar.propTypes = {
  events: PropTypes.array,
  currentDate: PropTypes.object,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
};

export default Calendar;

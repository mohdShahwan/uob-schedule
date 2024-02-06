import moment from "moment";
import PropTypes from "prop-types";

function Event({ title, event }) {
  return (
    <div className="h-full relative rbc-event-content-container">
      <div className="time">
        <span className="truncate">
          {moment(event.start).format("h:mm A")} -{" "}
          {moment(event.end).format("h:mm A")}
        </span>
      </div>
      <div className="title">{title}</div>
      <div className="location">{event.location}</div>
      {/* <div className="absolute bottom-0">{event.instructor}</div> */}
    </div>
  );
}

Event.propTypes = {
  title: PropTypes.string,
  event: PropTypes.string,
};

export default Event;

import PropTypes from "prop-types";

CustomToolbar.propTypes = {
  localizer: PropTypes.object,
  label: PropTypes.string,
  onNavigate: PropTypes.func,
  onView: PropTypes.func,
  setCurrentDate: PropTypes.func,
  views: PropTypes.string,
  view: PropTypes.string,
  events: PropTypes.array,
};

function CustomToolbar({
  localizer: { messages },
  label,
  onNavigate,
  onView,
  setCurrentDate,
  view,
  views,
  events,
}) {
  // console.log(props);
  // const {
  //   localizer: { messages },
  //   label,
  //   onNavigate,
  //   onView,
  //   setCurrentDate,
  //   views,
  // } = props;

  const sortedExams = events
    ?.filter((event) => event.type === "exam")
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  function navigate(action) {
    switch (action) {
      case "PREV":
        onNavigate("PREV");
        break;
      case "NEXT":
        onNavigate("NEXT");
        break;
      case "TODAY":
        onNavigate("TODAY");
        break;
      default:
        setCurrentDate(sortedExams.at(-1).start);
        onView("month");
        break;
    }
  }

  const handleViewChange = (view) => {
    onView(view);
  };

  function viewNamesGroup(messages) {
    let viewNames = views;

    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <button
          type="button"
          key={name}
          className={`${view === name ? "rbc-active" : ""}`}
          onClick={() => handleViewChange(name)}
        >
          {messages[name]}
        </button>
      ));
    }
  }

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => navigate("TODAY")}>
          {messages?.today}
        </button>
        {sortedExams.length > 0 && (
          <button type="button" onClick={() => navigate("EXAMS")}>
            Exams
          </button>
        )}
        <button type="button" onClick={() => navigate("PREV")}>
          {messages?.previous}
        </button>
        <button type="button" onClick={() => navigate("NEXT")}>
          {messages?.next}
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group">{viewNamesGroup(messages)}</span>
    </div>
  );
}

export default CustomToolbar;

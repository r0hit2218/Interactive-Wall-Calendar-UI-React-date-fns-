import React from "react";

const Notes = ({ notes, setNotes, startDate, endDate }) => {
  // Create unique key for selected date range
  const key =
    startDate && endDate
      ? `${startDate.toDateString()}-${endDate.toDateString()}`
      : "default";

  const handleChange = (e) => {
    const updatedNotes = {
      ...notes,
      [key]: e.target.value,
    };

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Notes</h3>

      {/* No selection state */}
      {!startDate || !endDate ? (
        <p style={{ color: "#777" }}>
          Select a date range to add notes
        </p>
      ) : (
        <>
          <p style={{ fontSize: "14px", marginBottom: "5px" }}>
            Notes for:{" "}
            <strong>
              {startDate.toDateString()} → {endDate.toDateString()}
            </strong>
          </p>

          <textarea
            rows="5"
            style={{ width: "100%" }}
            value={notes[key] || ""}
            onChange={handleChange}
            placeholder="Write your notes..."
          />
        </>
      )}
    </div>
  );
};

export default Notes;
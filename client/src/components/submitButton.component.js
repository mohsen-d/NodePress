import React, { useState } from "react";

export default ({
  title = "Save",
  submitInProgressTitle = "Saving...",
  disabled = false,
}) => {
  return (
    <button className="btn btn-primary px-5" type="submit" disabled={disabled}>
      {disabled ? submitInProgressTitle : title}
    </button>
  );
};

import React, { useState } from "react";

export default ({
  title = "Save",
  submitInProgressTitle = "Saving...",
  onClick,
  disabled = false,
}) => {
  const [btnTitle, setBtnTitle] = useState(title);
  const btnDisabled = btnTitle === submitInProgressTitle;

  async function handleClick() {
    setBtnTitle(submitInProgressTitle);
    await onClick();
    setBtnTitle(title);
  }

  return (
    <button disabled={disabled} onClick={handleClick}>
      {btnTitle}
    </button>
  );
};

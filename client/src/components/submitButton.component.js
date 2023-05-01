import React, { useState } from "react";

export default ({
  title = "Save",
  submitInProgressTitle = "Saving...",
  onClick,
}) => {
  const [btnTitle, setBtnTitle] = useState(title);

  async function handleClick() {
    setBtnTitle(submitInProgressTitle);
    await onClick();
    setBtnTitle(title);
  }

  return <button onClick={handleClick}>{btnTitle}</button>;
};

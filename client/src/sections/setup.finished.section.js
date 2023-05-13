import React, { useState } from "react";

export default () => {
  function handleClick() {}
  return (
    <div>
      <h2>SETUP COMPLETED!</h2>
      <div>Hurray! all set. You can now start using your website.</div>
      <div>
        <button onClick={handleClick}>Go to Admin Panel</button>
      </div>
    </div>
  );
};

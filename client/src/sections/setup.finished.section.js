import React, { useState } from "react";

export default () => {
  function handleClick() {}
  return (
    <div className="row">
      <h2 className="mb-2 text-info">SETUP COMPLETED!</h2>
      <div class="col mb-3">
        Hurray! all set. You can now start using your website.
      </div>
      <div className="d-grid gap-3">
        <button type="button" class="btn btn-success" onClick={handleClick}>
          Go to Admin Panel
        </button>
      </div>
    </div>
  );
};

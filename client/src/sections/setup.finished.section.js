import React, { useState } from "react";

export default () => {
  function handleClick() {}
  return (
    <div className="row">
      <h2 className="col-12 col-lg-7 offset-lg-2 mb-2 text-info">
        SETUP COMPLETED!
      </h2>
      <div class="col-12 col-lg-7 offset-lg-2 mb-3">
        Hurray! all set. You can now start using your website.
      </div>
      <div class="col-12 col-lg-7 offset-lg-2 mb-3">
        <div className="d-grid d-lg-block d-lg-flex justify-content-lg-end">
          <button
            type="button"
            class="btn btn-success"
            onClick={handleClick}
            autoFocus
          >
            Go to Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

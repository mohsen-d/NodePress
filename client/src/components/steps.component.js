import React from "react";

import Step from "./step.component";

export default function Steps({ titles }) {
  return (
    <div id="setup-steps">
      {titles.map((t) => (
        <Step title={t} key={t} isCompleted={false} />
      ))}
    </div>
  );
}

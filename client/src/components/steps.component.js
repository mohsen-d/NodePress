import React from "react";

import Step from "./step.component";

export default function Steps({ list }) {
  return (
    <div id="setup-steps">
      {Object.entries(list).map(([k, s]) => (
        <Step title={s.title} key={s.title} isCompleted={s.isCompleted} />
      ))}
    </div>
  );
}

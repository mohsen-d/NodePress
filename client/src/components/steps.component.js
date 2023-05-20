import React from "react";

import Step from "./step.component";

import styles from "../assets/steps.style.css";

export default function Steps({ list, current }) {
  const className = styles.steps + " row mb-4 mt-3";
  return (
    <div className={className}>
      <div className="d-none d-lg-block col-2"></div>
      <div className="col-12 col-lg-8">
        <div className="row">
          {Object.entries(list).map(([k, s]) => (
            <Step
              title={s.title}
              key={s.title}
              isCompleted={s.isCompleted}
              isCurrent={current.title === s.title}
            />
          ))}
        </div>
      </div>
      <div className="d-none d-lg-block col-2"></div>
    </div>
  );
}

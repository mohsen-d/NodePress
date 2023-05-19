import React from "react";
import styles from "../assets/step.style.css";

export default function Step({ title, isCompleted, isCurrent = false }) {
  const stepClassName = styles.step + " col-auto position-relative";
  const leftLineClassName =
    styles.left_line +
    " border-top position-absolute z-0 top-50 end-50 start-0";

  const rightLineClassName =
    styles.right_line +
    " border-top position-absolute z-0 top-50 end-0 start-50";
  const statusClassName =
    styles.status +
    " position-relative z-1 rounded-circle d-inline-block " +
    (isCompleted ? "bg-success" : isCurrent ? "bg-warning" : "bg-dark-subtle");

  const titleClassName =
    "ps-1 pe-1 position-relative bg-white d-inline z-2 " +
    (isCompleted ? "text-success" : "text-secondary");

  return (
    <div className={stepClassName}>
      <div className={leftLineClassName}>&nbsp;</div>
      <div className={statusClassName}></div>
      <div className={titleClassName}>{title}</div>
      <div className={rightLineClassName}>&nbsp;</div>
    </div>
  );
}

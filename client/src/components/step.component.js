import React from "react";
import styles from "../assets/step.style.css";

export default function Step({ title, isCompleted, isCurrent = false }) {
  const stepClassName = styles.step + " col-auto col-lg-3 position-relative";
  const leftLineClassName =
    styles.left_line +
    " border-bottom position-absolute z-0 top-50 end-50 start-0 translate-middle";

  const rightLineClassName =
    styles.right_line +
    " border-bottom position-absolute z-0 top-50 end-0 start-50 translate-middle";
  const statusClassName =
    styles.status +
    " position-relative z-1 rounded-circle d-inline-block " +
    (isCompleted ? "bg-success" : isCurrent ? "bg-warning" : "bg-dark-subtle");

  const titleClassName =
    styles.title +
    " ps-1 pe-1 position-relative bg-white d-inline z-2 " +
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

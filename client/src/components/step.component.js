import React from "react";
import styles from "../assets/step.style.css";

export default function Step({ title, isCompleted }) {
  return (
    <div className={styles.step}>
      <div
        className={
          isCompleted ? styles.status_completed : styles.status_not_complete
        }
      ></div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

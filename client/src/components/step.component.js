import React from "react";
import styles from "../assets/step.style.css";

export default function Step({ title, isCompleted }) {
  return (
    <div className={styles.step}>
      <div className={styles.status}></div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

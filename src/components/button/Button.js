import React from "react";
import "./Button.css";

export default function Button({ title, onClick, disabled, type, style }) {
  const classes = `btn ' ${style}`;
  let isDisabled = false;
  if (disabled) {
    isDisabled = true;
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={isDisabled}
    >
      {title}
    </button>
  );
}

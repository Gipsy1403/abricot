import style from "@/app/styles/button.module.css";

export default function Button({ text, onClick, disabled, variant }) {
  return (
     <button
      className={`${style.button} ${variant ? style[variant] : ""}`}
      onClick={onClick}
      disabled={disabled}
     >
      {text}
    </button>
  );
}
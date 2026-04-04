import style from "@/app/styles/button.module.css";

// Component bouton
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
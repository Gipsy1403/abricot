import styles from "./Button.module.css";

// Component bouton
export default function Button({ text, onClick }) {
  return (
    <button className={styles.button} disabled onClick={onClick}>
      {text}
    </button>
  );
}
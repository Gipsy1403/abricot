// Définition des styles par type
const tagStyles = {
  "À faire": { background: "var(--tagRed)", color: "var(--textRed)" }, // rouge pâle
  "En cours": { background: "var(--tagYellow)", color: "var(--textYellow)" }, // jaune/orange
  "Terminée": { background: "var(--tagGreen)", color: "var(--textGreen)" }, // vert
};

export default function Tag({ type }) {
  const style = tagStyles[type] || { background: "#e5e7eb", color: "#6b7280" }; // défaut gris
  return (
    <span
      style={{
        backgroundColor: style.background,
        color: style.color,
        padding: "0.25rem 1rem",
        borderRadius: "3.125rem",
        fontWeight: "500",
        fontSize: "0.85rem",
      }}
    >
      {type}
    </span>
  );
}
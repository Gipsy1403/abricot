// met les initiales du nom pour l'avatar
export function initialAvatar(name) {
  if (!name) return "?";

  // découpe name en mots
  const parts = name.split(" ");

  // prend les 2 premiers mots
  const initials = parts
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
}
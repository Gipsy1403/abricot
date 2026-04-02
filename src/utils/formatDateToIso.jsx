
export function formatDateToISO(dateString) {

	if (!dateString) return null; // sécurité si le champ est vide
	const date = new Date(dateString);
	
	return date.toISOString();
}
// met en francais les titres des statuts
export function statusLabels(status) {
	const labels = {
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
	};

	return labels[status] || "Statut inconnu";
}
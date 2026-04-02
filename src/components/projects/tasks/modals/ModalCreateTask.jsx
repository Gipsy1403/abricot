"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";
import style from "@/app/styles/modals.module.css";
import ContributorsSelect from "@/utils/contributorsSelect";
import { useParams } from "next/navigation";
import { formatDateToISO } from "@/utils/formatDateToIso";


export default function ModalCreateTask({onClose, onTaskCreated, projectId}) {

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [contributors, setContributors] = useState([]);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const statuses = ["A faire","En cours","Terminée"];

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const dueDateISO=formatDateToISO(dueDate); 
			console.log("Données envoyées :", { title, description, dueDate: dueDateISO, contributors, status });
			const response = await axios.post(`http://localhost:8000/projects/${projectId}/tasks`, {
				title,
				description,
				dueDate:dueDateISO,
				contributors,
				status,
				}, { withCredentials: true });

			onTaskCreated(response.data.data.task)

			// reset du formulaire
			setTitle("");
			setDescription("");
			setDueDate("");
			setContributors([]);
			setStatus("");
			onClose();

		} catch (err) {
			setError(
				err.response.data.data.errors[0]?.message ||
				"Erreur serveur"
			);
		}finally {
			setLoading(false);
		}
	};

	return (
		<Dialog.Root open={true}>
			<Dialog.Portal>
			<Dialog.Overlay className={style.overlay} onClick={onClose} />
			<Dialog.Content className={style.content}>
				<Dialog.Title>Créer une tâche</Dialog.Title>

				{error && <p style={{ color: "red" }}>{error}</p>}

				<form onSubmit={handleSubmit}>
					<div className={style.field}>
						<label className={style.label} htmlFor="title">Titre*</label>
						<input
							className={style.input}
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="description">Description</label>
						<textarea
							className={style.input}
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required

						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="dueDate">Echéance</label>
						<input
							className={style.input}
							type="date"
							id="dueDate"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							required

						/>
					</div>

					<div className={style.field}>
						<label className={style.label}>Assigné à : </label>
						<ContributorsSelect
							value={contributors}
							onChange={setContributors}
						/>
					</div>

					{/* <div className={style.field}>
						<label className={style.label} htmlFor="status">Statut</label>
						{statuses.map((s) => (
							<button
								className={`${style.btnStatus} ${status === s ? style.active : ""}`}
								key={s}
								type="button"
								// onClick={() => setStatus(s)}
								onClick={() => {
									console.log("Status choisi :", s); // <--- vérifie ici
									setStatus(s);
								}}
							>
							{s}
							</button>
						))}
					</div> */}
					<button type="submit" disabled={loading}>
						{loading ? "Création..." : "Ajouter une tâche"}
					</button>
				</form>

				<Dialog.Close asChild>
				<button className={style.closeButton} aria-label="Close" onClick={onClose}>X</button>
				</Dialog.Close>
			</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
		);
}
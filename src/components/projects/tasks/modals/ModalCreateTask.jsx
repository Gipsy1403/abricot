"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";
import style from "@/app/styles/modals.module.css";
import ContributorsSelect from "@/utils/contributorsSelect";
import { useParams } from "next/navigation";
import { formatDateToISO } from "@/utils/formatDateToIso";
import Button from "@/components/public/Button";


export default function ModalCreateTask({onClose, onTaskCreated, projectId}) {

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [contributors, setContributors] = useState([]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const dueDateISO=formatDateToISO(dueDate); 
			const infoNewTask={
				title,
				description,
				dueDate: dueDateISO,
				assigneeIds:contributors, // <-- CORRECTION
			};
			const response = await axios.post(`http://localhost:8000/projects/${projectId}/tasks`,
				infoNewTask,
				{ withCredentials: true }
			);
			// -----------------------------------------------------
// BLOC MIS POUR AVOIR LES PERSONNES ASSIGNEES DANS LES TACHES OR PROBLEME COTE BACK !! A VOIR
			// récupère le nouvel ID de la tâche
			const taskId = response.data?.data?.task?.id || response.data?.task?.id;
			if (!taskId) throw new Error("Impossible de récupérer l'ID de la tâche");

			// Re-fetch de la tâche complète avec assignees
			const fullTaskResponse = await axios.get(`http://localhost:8000/projects/${projectId}/tasks/${taskId}`,
				{ withCredentials: true }
			);
			console.log("Réponse GET tâche :", fullTaskResponse);
			const allTask = fullTaskResponse.data?.data?.task || fullTaskResponse.data?.task || fullTaskResponse.data;
			// const allTask = fullTaskResponse.data.data.task;

			console.log("Tâche complète avec assignés :", allTask);
			onTaskCreated(allTask)
			// ------------------------------------------------------------
			// onTaskCreated(response.data.data.task)

			// reset du formulaire
			setTitle("");
			setDescription("");
			setDueDate("");
			setContributors([]);
			onClose();

		} catch (err) {
  console.log("Erreur complète :", err);

  const message =
    err?.response?.data?.details?.[0]?.message || // validation backend
    err?.response?.data?.message ||               // message simple backend
    err?.message ||                               // erreur JS
    "Erreur serveur";

  setError(message);

		}finally {
			setLoading(false);
		}
	};
const formInvalid = title.trim() === "" || description.trim() === "" || dueDate==="";
	return (
		<Dialog.Root open={true}>
			<Dialog.Portal>
			<Dialog.Overlay className={style.overlay} onClick={onClose} />
			<Dialog.Content className={style.content}>
				<p className={style.closeButton} aria-label="Close" onClick={onClose}>X</p>
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
						<label className={style.label} htmlFor="description">Description*</label>
						<textarea
							className={style.input}
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required

						/>
					</div>

					<div className={style.field}>
						<label className={style.label} htmlFor="dueDate">Echéance*</label>
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
					<Button text="+ Ajouter une tâche" type="submit" disabled={loading || formInvalid}
					/>
				</form>

				<Dialog.Close asChild></Dialog.Close>
			</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
		);
}
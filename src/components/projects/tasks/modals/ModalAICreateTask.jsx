import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen} from "@fortawesome/free-solid-svg-icons";
import style from "@/app/styles/modals.module.css";
import Image from "next/image";
import Button from "@/components/public/Button";
import axios from "axios";

export default function ModalAICreateTask({
	onClose,
	iaTask,
	setIaTask,
	iaLoading,
	generateIATask,
	onTaskCreated,
	projectId }) {

	const [input, setInput] = useState("");
	const [error, setError] = useState(null);

	const [currentIndexTaskIA, setCurrentIndexTaskIA] = useState(null);
	const [currentTaskIA, setCurrentTaskIA] = useState({
		title: "",
		description: "",
	});
	const isEditingTask = currentIndexTaskIA !== null;

	const handleCreateTasksBulk = async () => {
		//  console.log("📦 iaTask AVANT envoi :", iaTask);
		try {
			// console.log("🔎 Type iaTask :", typeof iaTask);
			// console.log("🔎 Est tableau ?", Array.isArray(iaTask));

			const requests = iaTask.map((task, index) => {
			// console.log(`📤 Task ${index}`, task);

				return axios.post(
					`http://localhost:8000/projects/${projectId}/tasks`,
					{
						title: task.title,
						description: task.description,
						priority: task.priority?.toUpperCase(),
						dueDate: task.dueDate,
					},
					{ withCredentials: true }
				);
			});
			const responses = await Promise.allSettled(requests);
				// console.log("✅ Réponses API :", responses.map(r => r.data));
				// console.log("📊 Résultat brut :", responses);
				// const createdTasks = responses.map((r) => r.data);
			const createdTasks = responses
				.filter(r => r.status === "fulfilled")
				.map(r => r.value.data);

				createdTasks.forEach((task) => {
					onTaskCreated?.(task);
				});
				setIaTask([]);
				onClose();

		} catch (error) {
			console.error("Erreur création tâches :", error);
			if (error.response) {
				console.log("📨 Status :", error.response.status);
				console.log("📨 Data backend :", error.response.data);
				console.log("📨 Détail erreur backend :", error.response.data.data);
			} else {
				console.log("⚠️ Pas de réponse serveur :", error.message);
			}
		}
	};

	const handleEditTask = (index, newTask) => {
		const updatedTasks = [...iaTask]; // copie du tableau
		updatedTasks[index] = newTask;   // remplace la tâche
		setIaTask(updatedTasks);         // met à jour
	};

	const handleDeleteTask = (index) => {
		const updatedTasks = iaTask.filter((_, i) => i !== index);
		// const updatedTasks = [...(iaTask || [])];
		setIaTask(updatedTasks);
	};

  return (
    	<Dialog.Root open={true} onOpenChange={onClose}>
      	<Dialog.Portal>
			<Dialog.Overlay className={style.overlay} onClick={onClose} />

			<Dialog.Content className={style.content}>
				<p className={style.closeButton} onClick={onClose}>X</p>

				{error && <p style={{ color: "red" }}>{error}</p>}

				{/* SWITCH ENTRE LES 2 MODES */}
				{iaTask?.length > 0 ? (
				<>
				{/*MODE : IA A RÉPONDU */}
				<Dialog.Title className={style.responseIA}>
					Vos tâches...
				</Dialog.Title>

				{/* LISTE DES TÂCHES */}
				<div>
					{iaTask.map((task, i) => (
					<div key={i} className={style.taskIA}>

						{currentIndexTaskIA === i ? (
						<div className={style.modifyTaskIA}>
							{/* MODE MODIFICATION */}
							<h4>Modifier la tâche</h4>
							<textarea
								className={style.modifyTitleTaskIA}
								value={currentTaskIA.title}
								onChange={(e) =>
									setCurrentTaskIA({
										...currentTaskIA,
										title: e.target.value,
									})
								}
							/>
							<textarea
								className={style.modifyDescriptionTaskIA}
								value={currentTaskIA.description}
								onChange={(e) =>
									setCurrentTaskIA({
									...currentTaskIA,
									description: e.target.value,
									})
								}
							/>

							<Button
								onClick={() => {
									handleEditTask(i, currentTaskIA);
									// fermeture du mode modification
									setCurrentIndexTaskIA(null);
									// Reset du formulaire
									setCurrentTaskIA({ title: "", description: "" });
								}}
								text="Sauvegarder"
							/>
						</div>
						) : (
						<div>
							{/* MODE AFFICHAGE 👀 */}

							<h5>{task.title}</h5>
							<p>{task.description}</p>

							<div className={style.link}>
							<button onClick={() => handleDeleteTask(i)}>
							<FontAwesomeIcon icon={faTrash} /> Supprimer
							</button>

							<button
							onClick={() => {
								setCurrentIndexTaskIA(i);
								setCurrentTaskIA(task);
							}}
							>
							<FontAwesomeIcon icon={faPen} /> Modifier
							</button>
							</div>
						</div>
						)}
					</div>
					))}
				</div>

				{/* BOUTON AJOUTER */}
				{!isEditingTask && (
					<Button
						onClick={handleCreateTasksBulk}
						text="+ Ajouter les tâches"
					/>
				)}

				{/* TEXTAREA (reste dispo) */}
				{!isEditingTask && (
  					<div className={style.chat}>
					<textarea
					placeholder="Décrivez les tâches que vous souhaitez ajouter..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
						e.preventDefault();
						generateIATask(input);
						setInput("");
						}
					}}
					/>
					<Image
					src={"/images/IA-button.png"}
					alt="Bouton IA"
					width={24}
					height={24}
					/>
				</div>
				)}
				</>
				) : (
				<>
				{/*MODE : AVANT IA */}
				<Dialog.Title className={style.titleIA}>
					Créer une tâche
				</Dialog.Title>

				{/* espace */}
				<div/>

				{/* TEXTAREA */}
				<div className={style.chat}>
					<textarea
					placeholder="Décrivez les tâches que vous souhaitez ajouter..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
						e.preventDefault();
						generateIATask(input);
						setInput("");
						}
					}}
					/>

					<Image
					src={"/images/IA-button.png"}
					alt="Bouton IA"
					width={24}
					height={24}
					/>
				</div>
				</>
				)}

				{/* LOADING */}
				{iaLoading && <p>⏳ IA en cours...</p>}

			</Dialog.Content>
      	</Dialog.Portal>
    	</Dialog.Root>
  );
}
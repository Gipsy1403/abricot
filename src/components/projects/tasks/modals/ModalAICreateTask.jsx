import { useEffect } from "react";

export default function ModalAICreateTask({
  onClose,
  iaTask,
  setIaTask,
  generateIATask,
  iaLoading,
  onTaskCreated
}) {
  useEffect(() => {
    generateIATask();
  }, []);

  return (
    <div className="modalOverlay">
      <div className="modalContent">

        <h3>💎 Génération IA de tâche</h3>

        {iaLoading && <p>⏳ IA en cours de réflexion...</p>}

        {iaTask && (
          <div>
            <p><strong>Titre :</strong> {iaTask.title}</p>
            <p><strong>Description :</strong> {iaTask.description}</p>
            <p><strong>Priorité :</strong> {iaTask.priority}</p>
            <p><strong>Date :</strong> {iaTask.dueDate}</p>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button onClick={onClose}>Fermer</button>

          {iaTask && (
            <button
              onClick={() => {
                onTaskCreated(iaTask);
                onClose();
              }}
            >
              Ajouter la tâche
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
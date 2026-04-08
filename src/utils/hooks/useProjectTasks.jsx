import { useState, useEffect, useCallback } from "react";
import axios from "axios";


export function useProjectTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour fetch les tâches
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/projects/${projectId}/tasks`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setTasks(response.data.data.tasks); // contient assignees et comments
      } else {
        setError(response.data.message || "Erreur lors de la récupération des tâches");
      }
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch au montage du hook ou quand projectId change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useTask(projectId, taskId) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!projectId || !taskId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/projects/${projectId}/tasks/${taskId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setTask(response.data.data.task); // contient assignees et comments
      } else {
        setError(response.data.message || "Erreur lors de la récupération de la tâche");
      }
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [projectId, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return { task, loading, error, refetch: fetchTask };
}
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useComments = (projectId, tasks) => {
  const [commentsByTask, setCommentsByTask] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fonction pour récupérer les commentaires
  const fetchComments = useCallback(
    async (taskId) => {
      if (commentsByTask[taskId]) return; // éviter de recharger
      try {
        const response = await axios.get(
          `http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setCommentsByTask((prev) => ({
            ...prev,
            [taskId]: response.data.data.comments,
          }));
        }
      } catch (err) {
        console.error("Erreur en récupérant les commentaires :", err);
        setError(err);
      }
    },
    [projectId, commentsByTask]
  );

  // 🔹 Charger tous les commentaires au montage
  useEffect(() => {
    if (!tasks) return;

    const loadAllComments = async () => {
      setLoading(true);
      try {
        await Promise.all(tasks.map(task => fetchComments(task.id)));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllComments();
  }, [tasks, fetchComments]);

  // 🔹 Ajouter un commentaire
  const addComment = async (taskId) => {
    const content = newComments[taskId];
    if (!content?.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`,
        { content },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCommentsByTask((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), response.data.data.comment],
        }));
        setNewComments((prev) => ({ ...prev, [taskId]: "" }));
      }
    } catch (err) {
      console.error("Erreur en ajoutant le commentaire:", err);
      setError(err);
    }
  };

  return {
    commentsByTask,
    newComments,
    setNewComments,
    fetchComments,
    addComment,
    loading,
    error
  };
};
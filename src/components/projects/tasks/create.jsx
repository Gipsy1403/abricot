"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";
import styles from "./task.module.css";

export default function TaskDialog() {
  // 🎒 état du formulaire (comme un sac à dos de données)
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
    status: "TODO",
  });

  // ✏️ mise à jour des champs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🚀 envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/tasks", form);
      alert("Tâche créée !");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog.Root>
      {/* bouton ouverture */}
      <Dialog.Trigger className={styles.button}>
        Nouvelle tâche
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <Dialog.Title>Créer une tâche</Dialog.Title>

          {/* 🧾 FORMULAIRE */}
          <form onSubmit={handleSubmit} className={styles.form}>
            
            <input
              name="title"
              placeholder="Titre"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              type="date"
              name="dueDate"
              onChange={handleChange}
            />

            <input
              name="assignedTo"
              placeholder="Assignée à"
              onChange={handleChange}
            />

            {/* 🎯 select statut */}
            <select name="status" onChange={handleChange}>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminée</option>
            </select>

            <button type="submit">Créer</button>
          </form>

          <Dialog.Close>❌</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
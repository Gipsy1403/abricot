"use client"
import TasksKanban from "@/components/dashboard/TasksKanban";
import TasksList from "@/components/dashboard/TasksList";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
	return (
		<>
			<div>
				<div>
					<h4>Tableau de bord</h4>
					<p>Bonjour (prénom Nom), voici un aperçu de vos projets et tâches</p>
				</div>
				<button>+ Créer un projet</button>
			</div>
			<Link href="/dashboard/assigned-tasks"><button>Mes tâches assignées</button></Link>
			<Link href="/dashboard/projects-with-tasks"><button>Mes projets assignés</button></Link>
			
			
		</>
	)
}
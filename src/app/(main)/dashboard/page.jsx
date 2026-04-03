"use client"
import DashboardAssignedTasks from "@/components/dashboard/DashboardAssignedTasks";
import DashboardProjectsWithTasks from "@/components/dashboard/DashboardProjectsWithTasks";
import TasksKanban from "@/components/dashboard/TasksKanban";
import TasksList from "@/components/dashboard/TasksList";
import Link from "next/link";
import { useState } from "react";
import style from "@/app/styles/dashboard/dashboard.module.css"

export default function Dashboard() {
	 const [page, setPage] = useState('assigned'); 
	return (
		<>
			<div className={style.dashboardHeader}>
				<div>
					<h4>Tableau de bord</h4>
					<p>Bonjour (prénom Nom), voici un aperçu de vos projets et tâches</p>
				</div>
				<button>+ Créer un projet</button>
			</div>
			<DashboardAssignedTasks/>
			<DashboardProjectsWithTasks/>
			{/* <Link href="/dashboard/assigned-tasks"><button>Mes tâches assignées</button></Link>
			<Link href="/dashboard/projects-with-tasks"><button>Projets et tâches</button></Link> */}

			
		</>
	)
}
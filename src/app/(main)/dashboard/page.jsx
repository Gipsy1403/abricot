"use client"
import DashboardAssignedTasks from "@/components/dashboard/DashboardAssignedTasks";
import DashboardProjectsWithTasks from "@/components/dashboard/DashboardProjectsWithTasks";
import TasksKanban from "@/components/dashboard/TasksKanban";
import TasksList from "@/components/dashboard/TasksList";
import Link from "next/link";
import { useState, useEffect } from "react";
import style from "@/app/styles/dashboard/dashboard.module.css"
import Button from "@/components/public/Button";
import ModalCreateProject from "@/components/projects/modals/ModalCreateProject";
import axios from "axios";

export default function Dashboard() {
	 const [user, setUser] = useState(); 
	 const [projects, setProjects] = useState([]); 

	 const [openModal, setOpenModal]=useState(false)

	 useEffect(()=>{
			const getUser = async () => {
				try {
					const response = await axios.get(
						"http://localhost:8000/auth/profile",
						{withCredentials:true}
					);
	 
					// récupération des projets
					setUser(response.data.data.user);
	 
				} catch (error) {
					console.error("Erreur :", error);
				}
			};
			getUser();
		}, []);

	const handleProjectCreated=(newProject)=>{
		console.log("NEW PROJECT :", newProject);
		setProjects(prev=>[...prev, newProject]);
	}

	return (
		<>
			<div className={style.dashboardHeader}>
				<div>
					<h4>Tableau de bord</h4>
					<p>Bonjour {user?.name}, voici un aperçu de vos projets et tâches</p>
				</div>
				<Button  onClick={()=>setOpenModal(true)} text="+ Créer un projet" disabled={false}/>
				{/* MODAL POUR CREER UN PROJET*/}
				{openModal && (
					<ModalCreateProject onClose={()=>setOpenModal(false)} onProjectCreated={handleProjectCreated}/>
				)}
			</div>
			<DashboardAssignedTasks/>
			<DashboardProjectsWithTasks/>
		</>
	)
}
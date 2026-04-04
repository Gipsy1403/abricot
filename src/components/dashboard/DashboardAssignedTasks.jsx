"use client"
import TasksKanban from "@/components/dashboard/TasksKanban"
import TasksList from "@/components/dashboard/TasksList"
import { useState } from "react";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faListCheck, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "@/app/styles/dashboard/dashboard.module.css"


export default function DashboardAssignedTasks() {
		 const [view, setView] = useState("list");
	return (
		<>
			<div className={style.viewButtons}>
				<button onClick={()=>setView("list")} className={view === "list" ? style.active : ""}><FontAwesomeIcon icon={faListCheck}/>Liste</button>
				<button onClick={()=>setView("kanban")} className={view === "kanban" ? style.active : ""}><FontAwesomeIcon icon={faCalendarDays}/>Kanban</button>

			</div>
			{view === "kanban" ? <TasksKanban /> : <TasksList />}

		</>
	)
}
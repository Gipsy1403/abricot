"use client"
import TasksKanban from "@/components/dashboard/TasksKanban"
import TasksList from "@/components/dashboard/TasksList"
import { useState } from "react";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faListCheck, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function AssignedTasks() {
		 const [view, setView] = useState("list");
	return (
		<>
			<div>
				<button onClick={()=>setView("list")}><FontAwesomeIcon icon={faListCheck}/>Liste</button>
				<button onClick={()=>setView("kanban")}><FontAwesomeIcon icon={faCalendarDays}/>Kanban</button>
			</div>

			{view === "kanban" ? <TasksKanban /> : <TasksList />}

		</>
	)
}
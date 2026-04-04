"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import style from "@/app/styles/dashboard/dashboard.module.css"
import { useState,useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "../public/Button";
import Tag from "@/utils/tags";

export default function TasksKanban() {
	const [tasks, setTasks]=useState([]);

	useEffect(()=>{
		const getTasks = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/dashboard/assigned-tasks",
					{withCredentials:true}
				);

				// récupération des tâches
				setTasks(response.data.data.tasks);

			} catch (error) {
				console.error("Erreur :", error);
			}
		};
		getTasks();
	}, []);

	// filtre des tâches par statut
	const todoTasks = tasks.filter((t) => t.status === "TODO");
	const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
	const doneTasks = tasks.filter((t) => t.status === "DONE");

	// traduction des status
	const statusLabels = {
		TODO: "À faire",
		IN_PROGRESS: "En cours",
		DONE: "Terminée",
	};
	
	return (
		<>
		{/* <section>
			<h5>A faire</h5>
			{todoTasks.length}
			{todoTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
					<div className={style.detail}>
						<p>
							<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
						</p>
						<p>
							<FontAwesomeIcon icon={faCalendar}/>{
								new Date(t.dueDate).toLocaleDateString("fr-FR", {
									day: "numeric",      // jour du mois
									month: "long",       // mois en lettres
								})
							}
						</p>
						<p>
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>
				</div>
			))}
		</section>
		<section>
			<h5>En cours</h5>
			{inProgressTasks.length}
			{inProgressTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
					<div className={style.detail}>
						<p>
							<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
						</p>
						<p>
							<FontAwesomeIcon icon={faCalendar}/>{new Date(t.dueDate).toLocaleDateString()}
						</p>
						<p>
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>

				</div>
			))}
		</section>
		<section>
			<h5>Terminées</h5>
			{doneTasks.length}
			{doneTasks.map((t)=>(
				<div key={t.id}>
					<div>
						<h5>{t.title}</h5>
						{statusLabels[t.status]}
					</div>
					<p>{t.description}</p>
					<div className={style.detail}>
						<p>
							<FontAwesomeIcon icon={faFolderOpen}/>{t.project?.name}
						</p>
						<p>
							<FontAwesomeIcon icon={faCalendar}/>{new Date(t.dueDate).toLocaleDateString()}
						</p>
						<p>
							<FontAwesomeIcon icon={faComment}/>{t.comments.length}
						</p>
					</div>
					<Link href="/dashboard/projectswithtasks"><button>Voir</button></Link>

				</div>
			))}
		</section> */}

<div className={style.kanbanContainer}>

  {/* COLONNE TODO */}
  <section className={style.column}>
    <h5 className={style.columnTitle}>A faire <span>{todoTasks.length}</span></h5>

    {todoTasks.map((t) => (
      <div key={t.id} className={style.card}>

        <div className={style.cardHeader}>
          <h5 className={style.cardTitle}>{t.title}</h5>
          <Tag type={statusLabels[t.status]}/>

        </div>

        <p className={style.description}>{t.description}</p>

        <div className={style.detail}>
          <p>
            <FontAwesomeIcon icon={faFolderOpen} />
            {t.project?.name}
          </p>
          <p>
            <FontAwesomeIcon icon={faCalendar} />
            {new Date(t.dueDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </p>
          <p>
            <FontAwesomeIcon icon={faComment} />
            {t.comments.length}
          </p>
        </div>

        <Link href="/dashboard/projectswithtasks">
          <Button disabled={false} text="Voir"/>
        </Link>
      </div>
    ))}
  </section>


  {/* COLONNE IN PROGRESS */}
  <section className={style.column}>
    <h5 className={style.columnTitle}>En cours <span>{inProgressTasks.length}</span></h5>

    {inProgressTasks.map((t) => (
      <div key={t.id} className={style.card}>
        <div className={style.cardHeader}>
          <h5 className={style.cardTitle}>{t.title}</h5>
          <Tag type={statusLabels[t.status]}/>
        </div>

        <p className={style.description}>{t.description}</p>

        <div className={style.detail}>
          <p><FontAwesomeIcon icon={faFolderOpen} />{t.project?.name}</p>
          <p><FontAwesomeIcon icon={faCalendar} />{new Date(t.dueDate).toLocaleDateString()}</p>
          <p><FontAwesomeIcon icon={faComment} />{t.comments.length}</p>
        </div>

        <Link href="/dashboard/projectswithtasks">
     	<Button disabled={false} text="Voir"/>

        </Link>
      </div>
    ))}
  </section>


  {/* COLONNE DONE */}
  <section className={style.column}>
    <h5 className={style.columnTitle}>Terminées <span>{doneTasks.length}</span></h5>

    {doneTasks.map((t) => (
      <div key={t.id} className={style.card}>
        <div className={style.cardHeader}>
          <h5 className={style.cardTitle}>{t.title}</h5>
          <Tag type={statusLabels[t.status]}/>

        </div>

        <p className={style.description}>{t.description}</p>

        <div className={style.detail}>
          <p><FontAwesomeIcon icon={faFolderOpen} />{t.project?.name}</p>
          <p><FontAwesomeIcon icon={faCalendar} />{new Date(t.dueDate).toLocaleDateString()}</p>
          <p><FontAwesomeIcon icon={faComment} />{t.comments.length}</p>
        </div>

        <Link href="/dashboard/projectswithtasks">
          <Button disabled={false} text="Voir"/>

        </Link>
      </div>
    ))}
  </section>

</div>
		</>
	)
}
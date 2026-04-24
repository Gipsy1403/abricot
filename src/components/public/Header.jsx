"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image"
import Link from "next/link"
import style from "@/app/styles/headerAndFooter.module.css"
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";
import { useState, useEffect } from "react";
import Dashboard from "@/app/(main)/dashboard/page";
import Projects from "@/app/(main)/projects/page";
import { usePathname } from "next/navigation";
import axios from "axios";
import useCurrentUser from "@/utils/hooks/useCurrentUser";


export default function Header() {
	const pathname=usePathname();
	// const [user, setUser] = useState(); 
	const pageProfile=pathname==="/profile";
	const { user, loading, error } = useCurrentUser();

	if (loading) return <p>Chargement...</p>;
	if (error) return <p>Erreur...</p>;

	return (
		<header>
			<nav className={style.nav}>
				<Image
					src={"/images/Logo-orange.png"}
					alt="Logo Abricot - Page Accueil"
					width={147}
					height={19}
				/>
				<ul>
					<li><Link href="/dashboard"className={pathname === "/dashboard" ? style.active : ""}>
						<FontAwesomeIcon className={style.icon} icon={faCube}/>
						Tableau de Bord
						</Link>
					</li>
					<li><Link href="/projects" className={pathname === "/projects" ? style.active : ""}>
						<FontAwesomeIcon className={style.icon} icon={faFolderOpen}/>
						Projets</Link>
					</li>
				</ul>
				<div className={style.avatar}>
					<Link href="/profile">
						<Avatar.Root key={user?.name} className={`${style.avatar} ${pageProfile ? style.activeAvatar : ""}`}>	
							<Avatar.Fallback>
								{initialAvatar(user?.name)}
							</Avatar.Fallback>
						</Avatar.Root>
					</Link>
				</div>
			</nav>
		</header>
	)
}
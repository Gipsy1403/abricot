"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image"
import Link from "next/link"
import style from "@/app/styles/headerAndFooter.module.css"
import * as Avatar from "@radix-ui/react-avatar";
import { initialAvatar } from "@/utils/initialAvatar";
import { useState } from "react";
import Dashboard from "@/app/(main)/dashboard/page";
import Projects from "@/app/(main)/projects/page";
import { usePathname } from "next/navigation";


export default function Header() {
	 const pathname=usePathname();
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
				<div>
					<Link href="/auth/profile">
						{/* <Avatar.Root key={index} className={style.avatar}>	
							<Avatar.Fallback>
								{initialAvatar(user?.name)}
							</Avatar.Fallback>
						</Avatar.Root> */}
					</Link>
				</div>
			</nav>
		</header>
	)
}
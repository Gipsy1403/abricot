import Header from "@compopub/Header";
import Footer from "@compopub/Footer";

export default function PublicLayout({children}) {
	return (
		<>
			public layout
			<Header/>
			<main>
				{children}
			</main>
			<Footer/>
		</>
	)
}
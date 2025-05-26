import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { DataGenerator } from "./components/DataGenerator";
import {
	FaSun,
	FaMoon,
	FaBars,
	FaDatabase,
	FaClipboardList,
} from "react-icons/fa";
import ScrollButtons from "./components/ScrollButtons";
import TestStatusCard from "./components/TestStatus/TestStatusCard";
import BugRegistrationCard from "./components/BugRegistration/BugRegistrationCard";
import DeployCard from "./components/Deploy/DeployCard";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./styles/components.css";
import "./styles.css";
import "./App.css";
import SidebarMenu from "./components/SidebarMenu";
import { Container, Typography, Box } from "@mui/material";

const App = () => {
	const [darkMode, setDarkMode] = useState(() => {
		// Verifica se existe uma preferência salva no localStorage
		const savedTheme = localStorage.getItem("darkMode");
		// Se não existir, retorna true (tema escuro como padrão)
		return savedTheme === null ? true : savedTheme === "true";
	});
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		// Aplica o tema inicial
		document.body.classList.toggle("dark-theme", darkMode);
	}, []);

	const toggleTheme = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		// Salva a preferência no localStorage
		localStorage.setItem("darkMode", newDarkMode);
		document.body.classList.toggle("dark-theme", newDarkMode);
	};

	return (
		<div className="app">
			<button
				id="menu-toggle"
				className="icon-button"
				onClick={() => setSidebarOpen(!sidebarOpen)}
				aria-label="Abrir menu"
				type="button"
			>
				<FaBars />
			</button>
			<SidebarMenu
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>
			<button
				className="theme-toggle"
				onClick={toggleTheme}
				aria-label={
					darkMode
						? "Mudar para tema claro"
						: "Mudar para tema escuro"
				}
			>
				{darkMode ? <FaSun /> : <FaMoon />}
			</button>

			<header>
				<h1>🎲 KQA :: Gerador de Dados para QA ::</h1>
			</header>

			<div className="content-wrapper">
				<h2 className="section-title">
					<FaDatabase className="section-icon" /> Geração de dados
				</h2>
				<main>
					<DataGenerator />
				</main>

				<h2 className="section-title">
					<FaClipboardList className="section-icon" /> Registros de
					dados
				</h2>
				<main>
					{/* Dividir os cards de BUG e Comentário QA em duas colunas para melhor visualização
              BugRegistrationCard à esquerda e TestStatusCard à direita */}
					<div className="row">
						<div className="col-6">
							<BugRegistrationCard />
						</div>
						<div className="col-6">
							<TestStatusCard />
						</div>
					</div>
					<DeployCard />
				</main>
			</div>

			<Footer />

			<ScrollButtons />
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme={darkMode ? "dark" : "light"}
			/>
		</div>
	);
};

export default App;

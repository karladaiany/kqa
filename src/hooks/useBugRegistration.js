import { useState, useEffect } from "react";
import { encrypt, decrypt } from "../utils/crypto";

export const useBugRegistration = () => {
	const [bugData, setBugData] = useState(() => {
		const savedData = localStorage.getItem("bugRegistration");
		if (savedData) {
			const parsedData = JSON.parse(savedData);
			return {
				...parsedData,
				login: parsedData.login ? decrypt(parsedData.login) : "",
				password: parsedData.password
					? decrypt(parsedData.password)
					: "",
			};
		}
		return {
			incident: "",
			steps: "",
			expectedBehavior: "",
			url: "",
			login: "",
			password: "",
			envId: "",
			others: "",
			evidenceDescription: "",
			evidenceLink: "",
			hasAttachment: false,
		};
	});

	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const dataToSave = {
			...bugData,
			login: bugData.login ? encrypt(bugData.login) : "",
			password: bugData.password ? encrypt(bugData.password) : "",
		};
		localStorage.setItem("bugRegistration", JSON.stringify(dataToSave));
	}, [bugData]);

	const handleInputChange = (field, value) => {
		if (field === "envId" && value.length > 7) return;
		setBugData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleClearField = (field) => {
		if (field === "all") {
			setBugData({
				incident: "",
				steps: "",
				expectedBehavior: "",
				url: "",
				login: "",
				password: "",
				envId: "",
				others: "",
				evidenceDescription: "",
				evidenceLink: "",
				hasAttachment: false,
			});
			return;
		}

		setBugData((prev) => ({
			...prev,
			[field]: "",
		}));
	};

	const handleToggleAttachment = () => {
		setBugData((prev) => ({
			...prev,
			hasAttachment: !prev.hasAttachment,
		}));
	};

	const formatEvidenceSection = () => {
		// If evidenceLink is empty, the entire evidence section is omitted
		if (!bugData.evidenceLink) {
			return "";
		}

		const evidences = [];
		if (bugData.evidenceDescription) {
			evidences.push(bugData.evidenceDescription);
		}
		// evidenceLink is guaranteed to be non-empty here
		evidences.push(`Link da evidência: ${bugData.evidenceLink}`);

		if (bugData.hasAttachment) {
			evidences.push("Evidência em anexo na atividade");
		}

		// If evidenceLink is present, join collected evidences.
		// This will always include at least the link.
		return evidences.join("\n");
	};

	const handleCopyAll = () => {
		// Prevent copying if evidenceLink is empty
		if (!bugData.evidenceLink) {
			// Optionally, show a toast message or console log, though the button should be disabled in UI
			console.warn("Copy action aborted: evidenceLink is empty.");
			return;
		}

		const evidenceSectionContent = formatEvidenceSection();

		const formattedSteps = bugData.steps
			.split("\n")
			.map((step) => `» ${step}`)
			.join("\n");

		let textToCopy = `    <b>:: Incidente identificado ::</b>
${bugData.incident}

    <b>:: Passo a passo para reprodução ::</b>
${formattedSteps}

    <b>:: Comportamento esperado ::</b>
${bugData.expectedBehavior}

    <b>:: Informações ::</b>
url: ${bugData.url}
login: ${bugData.login}
senha: ${bugData.password}
org_id: ${bugData.envId}
${bugData.others}`;

		if (evidenceSectionContent) {
			textToCopy += `\n\n    <b>:: Evidência(s) ::</b>\n${evidenceSectionContent}`;
		}

		navigator.clipboard.writeText(textToCopy.trim());
	};

	return {
		bugData,
		showPassword,
		setShowPassword,
		handleInputChange,
		handleClearField,
		handleToggleAttachment,
		handleCopyAll,
	};
};

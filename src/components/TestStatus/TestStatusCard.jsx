import React from "react";
import {
	FaComment,
	FaCamera,
	FaPaperclip,
	FaTimes,
	FaCopy,
	FaBroom,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTestStatus } from "../../hooks/useTestStatus";
import useTextareaResizeActions from "../../hooks/useTextareaResizeActions";

// Componente dinâmico para campo (textarea ou input)
const CampoDinamico = ({
	id,
	label,
	value,
	onChange,
	onClear,
	type = "textarea",
	placeholder,
}) => (
	<div className="campo-item">
		<label htmlFor={id}>{label}</label>
		<div className="campo-valor">
			{type === "textarea" ? (
				<textarea
					id={id}
					value={value}
					onChange={onChange}
					className="copyable"
				/>
			) : (
				<input
					id={id}
					value={value}
					onChange={onChange}
					className="copyable"
					type={type}
					placeholder={placeholder}
				/>
			)}
			{value && <FaTimes className="clear-icon" onClick={onClear} />}
		</div>
	</div>
);

const TestStatusCard = () => {
	const {
		testStatus,
		environment,
		formData,
		handleStatusChange,
		handleEnvironmentChange,
		handleInputChange,
		handleClearField,
		handleToggleAttachment,
		handleClear,
	} = useTestStatus();

	const { clearCardTextareaSizes } = useTextareaResizeActions();

	const testStatusOptions = [
		{ value: "waiting", label: "‼️   Aguardando" },
		{ value: "blocked", label: "🚫   Bloqueado" },
		{ value: "cancelled", label: "🗑️   Cancelado" },
		{ value: "passed", label: "✅   Passou" },
		{ value: "failed", label: "❌   Reprovado" },
		{ value: "returned", label: "↩️   Retornado" },
	];

	const environmentOptions = [
		{ value: "alpha", label: "🔮   Alpha" },
		{ value: "prod", label: "⚙️   Produção" },
		{ value: "stage", label: "🧪   Stage" },
	];

	// Configuração dinâmica dos campos por status
	const camposPorStatus = {
		waiting: [
			{ id: "observation", label: "Observação", type: "textarea" },
			{ id: "waiting", label: "Aguardando", type: "textarea" },
		],
		blocked: [
			{ id: "observation", label: "Observação", type: "textarea" },
			{
				id: "blockReason",
				label: "Motivo do bloqueio",
				type: "textarea",
			},
		],
		cancelled: [
			{ id: "observation", label: "Observação", type: "textarea" },
		],
		passed: [
			{ id: "validation", label: "Validação", type: "textarea" },
			{ id: "observation", label: "Observação", type: "textarea" },
		],
		failed: [{ id: "observation", label: "Observação", type: "textarea" }],
		returned: [
			{ id: "validation", label: "Validação", type: "textarea" },
			{ id: "observation", label: "Observação", type: "textarea" },
			{ id: "information", label: "Informações", type: "textarea" },
			{
				id: "returnReason",
				label: "Motivo do retorno",
				type: "textarea",
			},
		],
	};

	const camposEvidencia = [
		{
			id: "evidenceDescription",
			label: "Descrição da evidência",
			type: "textarea",
		},
		{ id: "evidenceLink", label: "Link da evidência", type: "input" },
	];

	const handleCopy = () => {
		// Prevent copying if evidenceLink is empty
		if (!formData.evidenceLink) {
			// Optionally, show a toast message or console log, though the button should be disabled in UI
			console.warn(
				"Copy action aborted: formData.evidenceLink is empty."
			);
			// toast.warn("Preencha o link da evidência ou informe 'N/A' para copiar."); // Alternative feedback
			return;
		}

		const selectedStatusOption = testStatusOptions.find(
			(option) => option.value === testStatus
		);
		const selectedEnvironmentOption = environmentOptions.find(
			(option) => option.value === environment
		);
		const formatLabel = (label) => label.replace(/\s+/g, " ").trim();
		let template = "⇝ QA ⇜\n\n";
		template += ":: Teste ::\n";
		template += `${formatLabel(selectedStatusOption.label)}\n\n`;
		if (
			environment &&
			["passed", "failed", "blocked", "returned"].includes(testStatus)
		) {
			template += ":: Ambiente ::\n";
			template += `${formatLabel(selectedEnvironmentOption.label)}\n\n`;
		}
		if (
			["passed", "returned"].includes(testStatus) &&
			formData.validation
		) {
			template += ":: Validação ::\n";
			template += `${formData.validation}\n\n`;
		}
		if (formData.observation) {
			template += ":: Obs ::\n";
			template += `${formData.observation}\n\n`;
		}
		if (testStatus === "waiting" && formData.waiting) {
			template += ":: Aguardando ::\n";
			template += `${formData.waiting}\n\n`;
		}
		if (testStatus === "blocked" && formData.blockReason) {
			template += ":: Motivo do bloqueio ::\n";
			template += `${formData.blockReason}\n\n`;
		}
		if (testStatus === "returned" && formData.information) {
			template += ":: Informações ::\n";
			template += `${formData.information}\n\n`;
		}
		if (testStatus === "returned" && formData.returnReason) {
			template += ":: Motivo retorno ::\n";
			template += `${formData.returnReason}\n\n`;
		}
		if (
			formData.evidenceDescription ||
			formData.evidenceLink ||
			formData.hasAttachment
		) {
			template += ":: Evidência(s) ::\n";
			if (formData.evidenceDescription) {
				template += `${formData.evidenceDescription}\n`;
			}
			if (formData.evidenceLink) {
				template += `Evidência no link: ${formData.evidenceLink}\n`;
			}
			if (formData.hasAttachment) {
				template += "📎 Evidência em anexo na atividade\n";
			}
		}
		navigator.clipboard.writeText(template.trim());
		toast.success("Comentário copiado!");
	};

	const renderEnvironmentField = () => {
		if (!["passed", "failed", "blocked", "returned"].includes(testStatus))
			return null;
		return (
			<div className="campo-item">
				<label htmlFor="environment">Ambiente</label>
				<div className="campo-valor">
					<select
						id="environment"
						value={environment}
						onChange={handleEnvironmentChange}
						className="copyable"
					>
						<option value="">Selecione um ambiente</option>
						{environmentOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	};

	const renderCamposDinamicos = (campos) =>
		campos.map(({ id, label, type }) => (
			<CampoDinamico
				key={id}
				id={id}
				label={label}
				value={formData[id] || ""}
				onChange={handleInputChange(id)}
				onClear={() => handleClearField(id)}
				type={type === "input" ? "text" : "textarea"}
				placeholder={
					id === "evidenceLink" ? "https://jam.dev/" : undefined
				}
			/>
		));

	const renderEvidenceSection = () => {
		if (!testStatus) return null;
		return (
			<>
				<div className="section-divider">
					<FaCamera /> Evidências
				</div>
				{renderCamposDinamicos(camposEvidencia)}
				<div className="campo-item">
					<div
						className={`attachment-toggle ${
							formData.hasAttachment ? "active" : ""
						}`}
						onClick={handleToggleAttachment}
					>
						<FaPaperclip /> Evidência em anexo na atividade
					</div>
				</div>
			</>
		);
	};

	const handleClearWithResize = () => {
		handleClear();
		// Limpar tamanhos dos textareas do localStorage
		clearCardTextareaSizes("test-status");
	};

	return (
		<section className="card" id="test-status">
			<div className="card-header">
				<h2>
					<FaComment className="header-icon" /> Comentário QA
				</h2>
			</div>
			<div className="card-content">
				<div className="campo-item">
					<label htmlFor="testStatus">Status do teste</label>
					<div className="campo-valor">
						<select
							id="testStatus"
							value={testStatus}
							onChange={handleStatusChange}
							className="copyable"
						>
							<option value="">Selecione um status</option>
							{testStatusOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
				{renderEnvironmentField()}
				{testStatus &&
					renderCamposDinamicos(camposPorStatus[testStatus] || [])}
				{renderEvidenceSection()}
				{testStatus && (
					<div className="card-actions">
						<button
							className="generate-all-btn"
							onClick={handleCopy}
							disabled={!formData.evidenceLink}
							title={
								!formData.evidenceLink
									? "Preencha o link da evidência ou informe 'N/A' para habilitar."
									: "Copiar"
							}
						>
							<FaCopy /> Copiar
						</button>
						<button
							className="generate-all-btn"
							onClick={handleClearWithResize}
						>
							<FaBroom /> Limpar tudo
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default TestStatusCard;

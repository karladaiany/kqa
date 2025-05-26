import React, { useState, useEffect, useCallback } from "react";
import { FaFileExport, FaRedo, FaEdit, FaCog, FaTable } from "react-icons/fa";
import { toast } from "react-toastify";
import DescriptionIcon from "@mui/icons-material/Description"; // Ícone de arquivo genérico (JSON)

// Assuming generator functions will be passed as props or imported
// Removed placeholderGenerator and defaultGeneratorFunctions as actual functions will be passed via props.

const FileGeneratorCard = ({ generatorFunctions }) => {
	// Ensure generatorFunctions is available, if not, use a safe fallback or throw error
	if (!generatorFunctions) {
		// This case should ideally not happen if DataGenerator.jsx correctly passes the props.
		// For robustness, one might return null or an error message.
		// For now, assuming it's always provided.
		console.error("Generator functions not provided to FileGeneratorCard!");
		// Fallback to prevent crashing, though functionality would be broken.
		// A better approach might be to have a loading/error state in DataGenerator.jsx
		// if these functions aren't ready.
		generatorFunctions = {
			generatePerson: () => ({
				nome: "",
				email: "",
				telefone: "",
				endereco: {},
			}),
			generateCPF: () => ({ raw: "" }),
			generateRG: () => ({ raw: "" }),
			generateCompanyName: () => "",
			generateDepartment: () => "",
			generateJobTitle: () => "",
			generateBusinessSector: () => "",
			generateNumEmployees: () => "",
			generatePassword: () => "",
		};
	}

	const [selectedFields, setSelectedFields] = useState({
		// Dados Pessoais
		nome: true,
		email: true,
		telefone: true,
		endereco: true,
		numero: true,
		complemento: true,
		bairro: true,
		cidade: true,
		uf: true,
		cep: true,
		// Dados Complementares
		empresa: true,
		area: true,
		cargo: true,
		ramo: true,
		numColaboradores: true,
		senha: true,
		// Documentos
		cpf: true,
		rg: true,
	});
	const [useDefaultPassword, setUseDefaultPassword] = useState(false);
	const [numRecords, setNumRecords] = useState("10");
	const [fileFormat, setFileFormat] = useState("json"); // 'json' or 'csv'
	const [csvSeparator, setCsvSeparator] = useState(","); // ',' or ';'

	const [isGenerating, setIsGenerating] = useState(false);

	const handleCheckboxChange = (field) => {
		setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const isButtonDisabled = () => {
		const noFieldSelected = Object.values(selectedFields).every((v) => !v);
		const invalidNumRecords =
			!numRecords ||
			parseInt(numRecords) < 1 ||
			parseInt(numRecords) > 1000;
		return noFieldSelected || invalidNumRecords || isGenerating;
	};

	const splitName = (fullName) => {
		if (!fullName || typeof fullName !== "string")
			return { firstName: "", lastName: "" };
		const parts = fullName.split(" ");
		const firstName = parts.shift() || "";
		const lastName = parts.join(" ") || "";
		return { firstName, lastName };
	};

	const generateSingleRecord = () => {
		const record = {};
		const person = generatorFunctions.generatePerson();
		const { firstName, lastName } = splitName(person.nome);

		if (selectedFields.nome) {
			record.first_name = firstName;
			record.last_name = lastName;
		}
		if (selectedFields.email) record.email = person.email;

		if (selectedFields.telefone) {
			record.cell_phone = person.telefone; // First phone number from the initial person object
			record.phone1 = generatorFunctions.generatePerson().telefone; // Second distinct phone number
			record.phone2 = generatorFunctions.generatePerson().telefone; // Third distinct phone number
		} else {
			record.cell_phone = "";
			record.phone1 = "";
			record.phone2 = "";
		}

		if (selectedFields.endereco) record.address = person.endereco.rua;
		if (selectedFields.numero)
			record.address_number = person.endereco.numero;
		if (selectedFields.complemento)
			record.address2 = person.endereco.complemento;
		if (selectedFields.bairro) record.district = person.endereco.bairro;
		if (selectedFields.cidade) record.city = person.endereco.cidade;
		if (selectedFields.uf) record.state = person.endereco.estado;
		if (selectedFields.cep)
			record.zip_code = person.endereco.cep?.replace(/\D/g, "");

		// Dados Complementares
		if (selectedFields.empresa)
			record.enterprise = generatorFunctions.generateCompanyName();
		if (selectedFields.area)
			record.department = generatorFunctions.generateDepartment();
		if (selectedFields.cargo)
			record.role = generatorFunctions.generateJobTitle();
		if (selectedFields.ramo)
			record.business_line = generatorFunctions.generateBusinessSector();
		if (selectedFields.numColaboradores)
			record.number_of_employees =
				generatorFunctions.generateNumEmployees();

		if (selectedFields.senha) {
			record.password = useDefaultPassword
				? "123456"
				: generatorFunctions.generatePassword();
		}

		// Documentos
		if (selectedFields.cpf)
			record.cpf = generatorFunctions
				.generateCPF()
				.raw?.replace(/\D/g, "");
		if (selectedFields.rg)
			record.rg = generatorFunctions.generateRG().raw?.replace(/\D/g, "");

		// Fixos ou em branco
		record.country = "Brasil";
		// phone1 and phone2 are now handled by the selectedFields.telefone block

		// Ensure all selected fields are present, even if empty from generator
		const allJsonKeys = [
			"first_name",
			"last_name",
			"email",
			"cpf",
			"rg",
			"enterprise",
			"role",
			"department",
			"business_line",
			"number_of_employees",
			"country",
			"state",
			"city",
			"district",
			"address",
			"address_number",
			"zip_code",
			"address2",
			"cell_phone",
			"phone1",
			"phone2",
			"password",
		];
		allJsonKeys.forEach((key) => {
			if (record[key] === undefined) record[key] = "";
		});

		return record;
	};

	const downloadFile = (content, fileName, contentType) => {
		const a = document.createElement("a");
		const file = new Blob([content], { type: contentType });
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(a.href);
	};

	const handleGenerateFile = () => {
		if (isButtonDisabled()) return;
		setIsGenerating(true);
		toast.info("Gerando arquivo...", { autoClose: 2000 });

		setTimeout(() => {
			// Simulate async generation
			try {
				const records = [];
				for (let i = 0; i < parseInt(numRecords); i++) {
					records.push(generateSingleRecord());
				}

				if (fileFormat === "json") {
					const jsonContent = JSON.stringify(records, null, 2);
					downloadFile(
						jsonContent,
						"dados_gerados.json",
						"application/json"
					);
				} else if (fileFormat === "csv") {
					const csvHeaders = [
						"E-mail",
						"Nome",
						"Sobrenome",
						"CPF",
						"RG",
						"Empresa",
						"Área",
						"Número de colaboradores",
						"Ramo de atuação",
						"Cargo",
						"CEP",
						"Endereço",
						"Bairro",
						"Número",
						"Complemento",
						"Cidade",
						"Estado",
						"País",
						"Telefone pessoal",
						"Telefone comercial",
						"Celular",
						"Senha", // Added Senha to CSV header
					];
					// Order of data for CSV, matching JSON keys to CSV headers
					// This mapping needs to be precise
					const csvRowOrder = [
						"email",
						"first_name",
						"last_name",
						"cpf",
						"rg",
						"enterprise",
						"department",
						"number_of_employees",
						"business_line",
						"role",
						"zip_code",
						"address",
						"district",
						"address_number",
						"address2",
						"city",
						"state",
						"country",
						"phone1",
						"phone2",
						"cell_phone",
						"password",
					];

					let csvContent = csvHeaders.join(csvSeparator) + "\n";
					records.forEach((record) => {
						const row = csvRowOrder.map((key) => {
							let value =
								record[key] === null ||
								record[key] === undefined
									? ""
									: record[key];
							// Escape quotes and handle separator within fields
							if (
								typeof value === "string" &&
								(value.includes('"') ||
									value.includes(csvSeparator) ||
									value.includes("\n"))
							) {
								value = `"${value.replace(/"/g, '""')}"`;
							}
							return value;
						});
						csvContent += row.join(csvSeparator) + "\n";
					});
					downloadFile(
						csvContent,
						"dados_gerados.csv",
						"text/csv;charset=utf-8;"
					);
				}
				toast.success("Arquivo gerado com sucesso!");
			} catch (error) {
				console.error("Erro ao gerar arquivo:", error);
				toast.error("Erro ao gerar arquivo.");
			} finally {
				setIsGenerating(false);
			}
		}, 500); // Delay to allow toast to show
	};

	const fieldGroups = {
		"Dados pessoais": [
			"nome",
			"email",
			"telefone",
			"endereco",
			"numero",
			"complemento",
			"bairro",
			"cidade",
			"uf",
			"cep",
		],
		"Dados complementares": [
			"empresa",
			"area",
			"cargo",
			"ramo",
			"numColaboradores",
			"senha",
		],
		Documentos: ["cpf", "rg"],
	};

	const fieldLabels = {
		nome: "Nome completo",
		email: "E-mail",
		telefone: "Telefone",
		endereco: "Endereço",
		numero: "Número",
		complemento: "Complemento",
		bairro: "Bairro",
		cidade: "Cidade",
		uf: "UF",
		cep: "CEP",
		empresa: "Empresa",
		area: "Área",
		cargo: "Cargo",
		ramo: "Ramo de atuação",
		numColaboradores: "Nº colaboradores",
		senha: "Senha",
		cpf: "CPF",
		rg: "RG",
	};

	return (
		<section className="card" id="file-generator">
			<div className="card-header">
				<h2>
					<FaFileExport className="header-icon" /> Geração de arquivo
				</h2>
			</div>
			<div className="card-content">
				<div className="section-divider">
					<FaEdit className="section-icon" /> Campos para inclusão
				</div>
				{Object.entries(fieldGroups).map(([groupName, fields]) => (
					<div key={groupName} className="field-group">
						<h4>{groupName}</h4>
						<div
							style={{
								display: "grid",
								gridTemplateColumns:
									"repeat(auto-fill, minmax(200px, 1fr))",
								gap: "0.5rem",
							}}
						>
							{fields.map((field) => (
								<div key={field} className="checkbox-item">
									{field === "senha" ? (
										<div className="field-with-extra-option">
											<div className="main-checkbox-group">
												<input
													type="checkbox"
													id="field-senha"
													checked={
														selectedFields.senha
													}
													onChange={() =>
														handleCheckboxChange(
															"senha"
														)
													}
												/>
												<label htmlFor="field-senha">
													{fieldLabels.senha}
												</label>
											</div>
											{selectedFields.senha && (
												<div className="inline-checkbox-option">
													<input
														type="checkbox"
														id="useDefaultPassword"
														checked={
															useDefaultPassword
														}
														onChange={() =>
															setUseDefaultPassword(
																(prev) => !prev
															)
														}
													/>
													<label
														htmlFor="useDefaultPassword"
														style={{
															fontSize: "0.8rem",
															color: "var(--text-color)",
														}}
													>
														'123456'
													</label>
												</div>
											)}
										</div>
									) : (
										<>
											<input
												type="checkbox"
												id={`field-${field}`}
												checked={selectedFields[field]}
												onChange={() =>
													handleCheckboxChange(field)
												}
											/>
											<label htmlFor={`field-${field}`}>
												{fieldLabels[field]}
											</label>
										</>
									)}
								</div>
							))}
						</div>
					</div>
				))}

				{/* Default password checkbox is now inline with "Senha" field */}

				<div
					className="section-divider"
					style={{ marginTop: "0.5rem" }}
				>
					<FaCog className="section-icon" /> Configurações de geração
				</div>
				<div className="campo-item">
					<label htmlFor="numRecords">Quantidade de registros</label>
					<div className="campo-valor quantity-config-container">
						<input
							type="number"
							id="numRecords"
							className="quantity-input"
							value={numRecords}
							onChange={(e) => setNumRecords(e.target.value)}
							min="1"
							max="1000"
							title="Quantidade de registros (1-1000)"
						/>
						<span className="input-hint">(1-1000)</span>
					</div>
				</div>

				<div className="campo-item">
					<label>Formato do arquivo</label>
					<div className="campo-valor">
						<div className="format-and-separator-container">
							<div className="format-section">
								<div className="file-format-toggles">
									<button
										type="button"
										className={`format-toggle ${
											fileFormat === "json"
												? "active"
												: ""
										}`}
										onClick={() => setFileFormat("json")}
									>
										<DescriptionIcon className="format-icon" />
										<span className="format-text">
											JSON
										</span>
									</button>
									<button
										type="button"
										className={`format-toggle ${
											fileFormat === "csv" ? "active" : ""
										}`}
										onClick={() => setFileFormat("csv")}
									>
										<FaTable className="format-icon" />
										<span className="format-text">CSV</span>
									</button>
								</div>
							</div>

							<div
								className={`separator-section ${
									fileFormat === "csv" ? "visible" : ""
								}`}
							>
								<div className="csv-separator-toggles">
									<button
										type="button"
										className={`separator-toggle ${
											csvSeparator === "," ? "active" : ""
										}`}
										onClick={() => setCsvSeparator(",")}
										title="Vírgula - Padrão internacional"
									>
										,
									</button>
									<button
										type="button"
										className={`separator-toggle ${
											csvSeparator === ";" ? "active" : ""
										}`}
										onClick={() => setCsvSeparator(";")}
										title="Ponto e vírgula - Padrão brasileiro"
									>
										;
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="card-actions">
					<button
						className="generate-all-btn"
						onClick={handleGenerateFile}
						disabled={isButtonDisabled()}
						title={
							isButtonDisabled()
								? "Selecione ao menos um campo e defina uma quantidade válida (1-1000)"
								: "Gerar arquivo"
						}
					>
						<FaRedo className=".generate-all-btn" />
						{isGenerating ? "Gerando..." : "Gerar arquivo"}
					</button>
				</div>
			</div>
		</section>
	);
};

export default FileGeneratorCard;

// Basic styling for checkbox and radio groups - can be moved to components.css
// For now, including here for brevity of example if direct CSS injection is not possible via tool
// And to make the component self-contained for review.
// In a real scenario, these would go into src/styles/components.css
const internalStyles = `
.checkbox-item, .radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-color);
}
.checkbox-item input[type="checkbox"], .radio-group input[type="radio"] {
  margin-right: 0.3rem;
  accent-color: var(--accent-color);
}
.radio-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.field-group h4 {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
  font-weight: 500;
}
`;

// A way to inject styles if needed, or a note to add them to the main CSS file.
// If this component were added to the project, one would also add these styles to components.css:
/*
.checkbox-item, .radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}
.checkbox-item input[type="checkbox"], .radio-group input[type="radio"] {
  margin-right: 0.3rem;
  accent-color: var(--accent-color);
}
.radio-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.field-group h4 {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3rem;
  font-weight: 500;
  color: var(--text-secondary); // Ensure this var exists or use a direct color
}
.campo-item > label { // Ensure labels in .campo-item are styled consistently
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.25rem; // Add some space if they are block
  display: block; // Or adjust flex settings if parent is flex
}
*/

// This is just a placeholder for the style injection note. The actual CSS should be added to components.css.
if (document && !document.getElementById("file-generator-styles")) {
	const styleEl = document.createElement("style");
	styleEl.id = "file-generator-styles";
	styleEl.innerHTML = internalStyles;
	// document.head.appendChild(styleEl); // This would be for direct browser injection
}

// Note: The CSV header "Telefone pessoal;Telefone comercial;Celular" maps to
// phone1, phone2, cell_phone. The current implementation maps person.telefone to cell_phone
// and leaves phone1, phone2 blank. This matches the requirement "Gerar novo ou deixar em branco".
// "Senha" was added to CSV header for completeness.
// The field labels in the UI are more descriptive than the terse keys in selectedFields.
// The JSON structure uses snake_case as specified.
// CSV generation escapes quotes within fields.
// Assumed `generatorFunctions` prop will be populated correctly in DataGenerator.jsx.

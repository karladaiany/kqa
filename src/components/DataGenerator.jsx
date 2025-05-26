import React, { useState, useEffect } from "react";
import { useDataGenerator } from "../hooks/useDataGenerator";
import useTextareaResize from "../hooks/useTextareaResize";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
	FaCopy,
	FaSync,
	FaMask,
	FaRedo,
	FaTag,
	FaIdCard,
	FaUserAlt,
	FaGraduationCap,
	FaCreditCard,
	FaRandom,
	FaTimes,
	FaCalculator,
} from "react-icons/fa";
import DataField from "./DataField";
import ComplementaryDataCard from "./ComplementaryData/ComplementaryDataCard";
import FileGeneratorCard from "./FileGenerator/FileGeneratorCard"; // Import FileGeneratorCard
import * as companyGenerators from "../generators/companyData"; // Import all company data generators

const CategoryTag = ({ category }) => {
	const handleCopy = () => {
		toast.success("Categoria copiada!");
	};

	return (
		<div className="category-tag">
			<FaTag className="tag-icon" />
			<span className="tag-text">{category}</span>
			<CopyToClipboard text={category} onCopy={handleCopy}>
				<FaCopy className="tag-copy-icon" title="Copiar categoria" />
			</CopyToClipboard>
		</div>
	);
};

const DataGenerator = ({ onGenerate = () => {} }) => {
	useTextareaResize();

	const {
		isLoading,
		error,
		generateCPF,
		generateCNPJ,
		generateRG,
		generatePerson,
		generateCreditCard,
		generateProduct,
		gerarCEPValido,
		generateRandomChars,
		getEredeTestCardStatuses, // For populating Erede status dropdown
	} = useDataGenerator();

	const eredeStatuses = getEredeTestCardStatuses
		? getEredeTestCardStatuses()
		: [];

	// Consolidate generator functions to pass to FileGeneratorCard
	const allGeneratorFunctions = {
		generatePerson,
		generateCPF,
		generateCNPJ, // Included for completeness if FileGeneratorCard ever needs it
		generateRG,
		...companyGenerators, // Spread all exports from companyData.js
	};

	const [documents, setDocuments] = useState({
		cpf: generateCPF(),
		cnpj: generateCNPJ(),
		rg: generateRG(),
	});

	const [masks, setMasks] = useState(() => {
		const savedMasks = localStorage.getItem("document-masks");
		return savedMasks
			? JSON.parse(savedMasks)
			: {
					cpf: true,
					cnpj: true,
					rg: true,
			  };
	});

	const [person, setPerson] = useState(generatePerson());
	const [card, setCard] = useState(generateCreditCard("visa", "credito")); // Initial card
	const [product, setProduct] = useState(generateProduct());

	const [cardConfig, setCardConfig] = useState({
		bandeira: "visa",
		tipo: "credito",
		eredeStatus: "APROVADA", // Definir "APROVADA" (Autorizado) como padrão
	});

	// Update card state when eredeStatus changes and Erede is the selected brand
	useEffect(() => {
		if (cardConfig.bandeira.toLowerCase() === "erede") {
			setCard(
				generateCreditCard(
					cardConfig.bandeira,
					"",
					cardConfig.eredeStatus
				)
			);
		}
	}, [cardConfig.bandeira, cardConfig.eredeStatus, generateCreditCard]);

	const [randomChars, setRandomChars] = useState({
		length: "",
		value: "",
	});

	const [textCounter, setTextCounter] = useState({
		text: "",
		count: 0,
	});

	const toggleMask = (field) => {
		setMasks((prev) => {
			const newMasks = {
				...prev,
				[field]: !prev[field],
			};
			localStorage.setItem("document-masks", JSON.stringify(newMasks));
			return newMasks;
		});
	};

	const regenerateField = (field) => {
		const newPerson = { ...person };

		switch (field) {
			case "nome":
				const { nome, email } = generatePerson();
				newPerson.nome = nome;
				newPerson.email = email; // Atualiza email junto com nome pois são relacionados
				break;
			case "telefone":
				newPerson.telefone = generatePerson().telefone;
				break;
			case "endereco":
				newPerson.endereco = {
					...newPerson.endereco,
					rua: generatePerson().endereco.rua,
				};
				break;
			case "numero":
				newPerson.endereco = {
					...newPerson.endereco,
					numero: generatePerson().endereco.numero,
				};
				break;
			case "complemento":
				newPerson.endereco = {
					...newPerson.endereco,
					complemento: generatePerson().endereco.complemento,
				};
				break;
			case "bairro":
				newPerson.endereco = {
					...newPerson.endereco,
					bairro: generatePerson().endereco.bairro,
				};
				break;
			case "cidade":
				newPerson.endereco = {
					...newPerson.endereco,
					cidade: generatePerson().endereco.cidade,
				};
				break;
			case "estado":
				const novaPessoa = generatePerson();
				newPerson.endereco = {
					...newPerson.endereco,
					estado: novaPessoa.endereco.estado,
					cep: novaPessoa.endereco.cep, // Atualiza CEP junto com estado pois são relacionados
				};
				break;
			case "cep":
				// Gera um novo CEP baseado no estado atual
				newPerson.endereco = {
					...newPerson.endereco,
					cep: gerarCEPValido(newPerson.endereco.estado),
				};
				break;
			default:
				return;
		}

		setPerson(newPerson);
	};

	const regenerateProductField = (field) => {
		const newProduct = { ...product };
		const tempProduct = generateProduct();

		switch (field) {
			case "nome":
				newProduct.nome = tempProduct.nome;
				break;
			case "descricao":
				newProduct.descricao = tempProduct.descricao;
				break;
			case "categorias":
				newProduct.categorias = tempProduct.categorias;
				break;
			default:
				return;
		}

		setProduct(newProduct);
	};

	const handleCardConfigChange = (e) => {
		const { name, value } = e.target;
		setCardConfig((prev) => {
			const newConfig = { ...prev, [name]: value };

			// Se mudou para Erede, definir status padrão como "APROVADA"
			if (name === "bandeira" && value.toLowerCase() === "erede") {
				newConfig.eredeStatus = "APROVADA";
				setCard(generateCreditCard(value, "", "APROVADA"));
			} else if (newConfig.bandeira.toLowerCase() === "erede") {
				// Se já é Erede e mudou o status
				setCard(
					generateCreditCard(
						newConfig.bandeira,
						"",
						newConfig.eredeStatus
					)
				);
			} else {
				// Para outras bandeiras
				setCard(generateCreditCard(newConfig.bandeira, newConfig.tipo));
			}
			return newConfig;
		});
	};

	const handleRandomCharsChange = (e) => {
		const value = e.target.value;
		// Permite campo vazio ou números positivos
		if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 99999)) {
			setRandomChars((prev) => ({
				...prev,
				length: value,
			}));
		}
	};

	const handleClearLength = () => {
		setRandomChars((prev) => ({
			...prev,
			length: "",
		}));
	};

	const generateNewRandomChars = () => {
		// Só gera se houver um número válido
		if (randomChars.length && parseInt(randomChars.length) > 0) {
			setRandomChars((prev) => ({
				...prev,
				value: generateRandomChars(parseInt(prev.length)),
			}));
		}
	};

	const handleTextChange = (e) => {
		const newText = e.target.value;
		setTextCounter({
			text: newText,
			count: newText.length,
		});
	};

	const handleClearText = () => {
		setTextCounter({
			text: "",
			count: 0,
		});
	};

	useEffect(() => {
		// Só gera automaticamente se houver um número válido
		if (randomChars.length && parseInt(randomChars.length) > 0) {
			generateNewRandomChars();
		} else {
			// Limpa o valor gerado se o comprimento não for válido
			setRandomChars((prev) => ({
				...prev,
				value: "",
			}));
		}
	}, [randomChars.length]);

	if (isLoading) {
		return <div>Carregando gerador de dados...</div>;
	}

	if (error) {
		return <div className="error">{error}</div>;
	}

	const renderDocumentosCard = () => (
		<section className="card" id="documentos">
			<div className="card-header">
				<h2>
					<FaIdCard className="header-icon" /> Documentos
				</h2>
			</div>
			<div className="card-content">
				<DataField
					label="CPF"
					value={documents.cpf.formatted}
					raw={documents.cpf.raw}
					showMask={masks.cpf}
					onRegenerate={() =>
						setDocuments((prev) => ({
							...prev,
							cpf: generateCPF(),
						}))
					}
					onToggleMask={() => toggleMask("cpf")}
				/>
				<DataField
					label="CNPJ"
					value={documents.cnpj.formatted}
					raw={documents.cnpj.raw}
					showMask={masks.cnpj}
					onRegenerate={() =>
						setDocuments((prev) => ({
							...prev,
							cnpj: generateCNPJ(),
						}))
					}
					onToggleMask={() => toggleMask("cnpj")}
				/>
				<DataField
					label="RG"
					value={documents.rg.formatted}
					raw={documents.rg.raw}
					showMask={masks.rg}
					onRegenerate={() =>
						setDocuments((prev) => ({ ...prev, rg: generateRG() }))
					}
					onToggleMask={() => toggleMask("rg")}
				/>
			</div>
		</section>
	);

	const renderDadosPessoaisCard = () => (
		<section className="card" id="dados-pessoais">
			<div className="card-header">
				<h2>
					<FaUserAlt className="header-icon" /> Dados pessoais
				</h2>
				<button
					className="generate-all-btn"
					onClick={() => setPerson(generatePerson())}
					title="Gerar todos os dados pessoais novamente"
				>
					<FaRedo className="generate-icon" /> Gerar tudo
				</button>
			</div>
			<div className="card-content">
				<DataField
					label="Nome"
					value={person.nome}
					onRegenerate={() => regenerateField("nome")}
				/>
				<DataField
					label="Email"
					value={person.email}
					onRegenerate={() => regenerateField("nome")}
				/>
				<DataField
					label="Telefone"
					value={person.telefone}
					onRegenerate={() => regenerateField("telefone")}
				/>
				<DataField
					label="Endereço"
					value={person.endereco.rua}
					onRegenerate={() => regenerateField("endereco")}
				/>
				<DataField
					label="Número"
					value={person.endereco.numero}
					onRegenerate={() => regenerateField("numero")}
				/>
				<DataField
					label="Complemento"
					value={person.endereco.complemento}
					onRegenerate={() => regenerateField("complemento")}
				/>
				<DataField
					label="Bairro"
					value={person.endereco.bairro}
					onRegenerate={() => regenerateField("bairro")}
				/>
				<DataField
					label="Cidade"
					value={person.endereco.cidade}
					onRegenerate={() => regenerateField("cidade")}
				/>
				<DataField
					label="UF"
					value={person.endereco.estado}
					onRegenerate={() => regenerateField("estado")}
				/>
				<DataField
					label="CEP"
					value={person.endereco.cep}
					onRegenerate={() => regenerateField("cep")}
				/>
			</div>
		</section>
	);

	const renderProdutoCard = () => (
		<section className="card" id="produto">
			<div className="card-header">
				<h2>
					<FaGraduationCap className="header-icon" /> Produto
				</h2>
				<button
					className="generate-all-btn"
					onClick={() => setProduct(generateProduct())}
					title="Gerar todos os dados do produto novamente"
				>
					<FaRedo className="generate-icon" /> Gerar tudo
				</button>
			</div>
			<div className="card-content">
				<DataField
					label="Nome"
					value={product.nome}
					onRegenerate={() => regenerateProductField("nome")}
				/>
				<DataField
					label="Descrição"
					value={product.descricao}
					onRegenerate={() => regenerateProductField("descricao")}
				/>
				<div className="campo-item">
					<label>Categorias</label>
					<div className="campo-valor">
						<div className="categories-container">
							{product.categorias.map((categoria, index) => (
								<CategoryTag key={index} category={categoria} />
							))}
						</div>
						<button
							type="button"
							className="icon-button regenerate"
							aria-label="Gerar novas categorias"
							onClick={() => regenerateProductField("categorias")}
						>
							<FaSync className="regenerate-icon" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);

	const renderCartaoCard = () => (
		<section className="card" id="cartao">
			<div className="card-header">
				<h2>
					<FaCreditCard className="header-icon" /> Cartão
				</h2>
				<div className="card-filters">
					<select
						name="bandeira"
						value={cardConfig.bandeira}
						onChange={handleCardConfigChange}
						className="card-select"
					>
						<option value="visa">Visa</option>
						<option value="mastercard">Mastercard</option>
						<option value="amex">American Express</option>
						<option value="elo">Elo</option>
						<option value="erede">Erede</option>
					</select>
					{cardConfig.bandeira.toLowerCase() === "erede" ? (
						<select
							name="eredeStatus"
							value={cardConfig.eredeStatus}
							onChange={handleCardConfigChange}
							className="card-select erede-status-select"
						>
							{eredeStatuses.map((s) => (
								<option key={s.status} value={s.status}>
									{s.description}
								</option>
							))}
						</select>
					) : (
						<select
							name="tipo"
							value={cardConfig.tipo}
							onChange={handleCardConfigChange}
							className="card-select"
						>
							<option value="credito">Crédito</option>
							<option value="debito">Débito</option>
							<option value="multiplo">Múltiplo</option>
						</select>
					)}
					<button
						onClick={() => {
							if (cardConfig.bandeira.toLowerCase() === "erede") {
								setCard(
									generateCreditCard(
										cardConfig.bandeira,
										"",
										cardConfig.eredeStatus
									)
								);
							} else {
								setCard(
									generateCreditCard(
										cardConfig.bandeira,
										cardConfig.tipo
									)
								);
							}
						}}
						className="generate-all-btn"
					>
						<FaRedo className="generate-icon" />{" "}
						{cardConfig.bandeira.toLowerCase() === "erede"
							? "Gerar"
							: "Gerar novo"}
					</button>
				</div>
			</div>
			<div className="card-content">
				<DataField
					label="Número"
					value={card.numeroFormatado}
					raw={card.numero}
				/>
				<DataField label="Nome" value={card.nome} />
				<DataField label="Validade" value={card.validade} />
				<DataField label="CVV" value={card.cvv} />
			</div>
		</section>
	);

	const renderCaracteresCard = () => (
		<section className="card" id="caracteres">
			<div className="card-header">
				<h2>
					<FaRandom className="header-icon" /> Gerador de caracteres
				</h2>
				<div className="card-filters">
					<div className="input-clearable">
						<input
							type="number"
							min="1"
							max="99999"
							value={randomChars.length}
							onChange={handleRandomCharsChange}
							className="number-input"
							placeholder="Quantidade"
						/>
						{randomChars.length && (
							<button
								type="button"
								className="icon-button clear-input-btn"
								tabIndex={-1}
								onClick={handleClearLength}
								aria-label="Limpar campo"
							>
								<FaTimes className="clear-icon" />
							</button>
						)}
					</div>
				</div>
			</div>
			<div className="card-content">
				<DataField
					label="Caracteres gerados"
					value={randomChars.value}
					raw={randomChars.value}
				/>
			</div>
		</section>
	);

	const renderContadorCard = () => (
		<section className="card" id="contador">
			<div className="card-header">
				<h2>
					<FaCalculator className="header-icon" /> Contador de
					caracteres
				</h2>
			</div>
			<div className="card-content">
				<DataField
					label="Texto"
					value={textCounter.text}
					onTextChange={handleTextChange}
					isTextArea={true}
					onClear={handleClearText}
					showCopy={false}
				/>
				<div className="campo-item">
					<label>Total de caracteres</label>
					<div className="campo-valor">
						<span className="copyable">{textCounter.count}</span>
					</div>
				</div>
			</div>
		</section>
	);

	return (
		<div className="geracao-dados-container">
			<div className="coluna-esquerda">
				{renderDocumentosCard()}
				{renderDadosPessoaisCard()}
				<FileGeneratorCard generatorFunctions={allGeneratorFunctions} />
			</div>

			<div className="coluna-direita">
				{renderProdutoCard()}
				{renderCartaoCard()}
				{renderCaracteresCard()}
				{renderContadorCard()}
				<ComplementaryDataCard />
			</div>
		</div>
	);
};

export { DataGenerator };
export default DataGenerator;

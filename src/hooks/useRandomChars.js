/**
 * Hook para gerenciamento de caracteres aleatórios
 * @author KQA Team
 * @description Extrai lógica de caracteres aleatórios mantendo comportamento original idêntico
 */

import { useState, useCallback, useEffect } from "react";
import { useDataGenerator } from "./useDataGenerator";

/**
 * Hook para gerenciar gerador de caracteres aleatórios
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useRandomChars = () => {
	const { generateRandomChars } = useDataGenerator();

	// Estado idêntico ao original
	const [randomChars, setRandomChars] = useState({
		length: "",
		value: "",
	});

	// Função idêntica ao original do DataGenerator
	const handleRandomCharsChange = useCallback((e) => {
		const value = e.target.value;
		if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 99999)) {
			setRandomChars((prev) => ({
				...prev,
				length: value,
			}));
		}
	}, []);

	// Função idêntica ao original do DataGenerator
	const handleClearLength = useCallback(() => {
		setRandomChars((prev) => ({
			...prev,
			length: "",
		}));
	}, []);

	// Função idêntica ao original do DataGenerator
	const generateNewRandomChars = useCallback(() => {
		if (randomChars.length && parseInt(randomChars.length) > 0) {
			setRandomChars((prev) => ({
				...prev,
				value: generateRandomChars(parseInt(prev.length)),
			}));
		}
	}, [randomChars.length, generateRandomChars]);

	// Effect idêntico ao original
	useEffect(() => {
		if (randomChars.length && parseInt(randomChars.length) > 0) {
			generateNewRandomChars();
		} else {
			setRandomChars((prev) => ({
				...prev,
				value: "",
			}));
		}
	}, [randomChars.length, generateNewRandomChars]);

	return {
		randomChars,
		handleRandomCharsChange,
		handleClearLength,
		generateNewRandomChars,
	};
};

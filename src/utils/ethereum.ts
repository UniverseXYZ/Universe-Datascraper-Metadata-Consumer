/**
 * Build ABI function definitions
 */

export type AbiMemberType = 'function';
export type AbiFunctionStateMutability = 'pure';
export type AbiFunctionInputOutputType = 'string' | 'uint256';
export type AbiFunctionInputOutput = {
	name: string,
	type: AbiFunctionInputOutputType
};

export type AbiFunction = {
    type: AbiMemberType,
	name: string,
    stateMutability: AbiFunctionStateMutability,
    constant: boolean,
    payable: boolean,
    inputs: AbiFunctionInputOutput[],
    outputs: AbiFunctionInputOutput[]
};

const buildAbiFunctionInputOutput = (
	name: string,
	type: AbiFunctionInputOutputType
) : AbiFunctionInputOutput => ({ name, type });

export const buildAbiFunctionInput = (name: string, type: AbiFunctionInputOutputType) : AbiFunctionInputOutput => {
	return buildAbiFunctionInputOutput(name, type);
}

export const buildAbiFunctionOutput = (name: string, type: AbiFunctionInputOutputType) : AbiFunctionInputOutput => {
	return buildAbiFunctionInputOutput(name, type);
}

export const buildAbiFunction = (
	name: string,
	stateMutability: AbiFunctionStateMutability,
	constant: boolean,
	payable: boolean,
	inputs: AbiFunctionInputOutput[],
	outputs: AbiFunctionInputOutput[]
) : AbiFunction => ({
	type: 'function',
	name,
	stateMutability,
	constant,
	payable,
	inputs,
	outputs
});

export const buildAbiReadFunction = (
	name: string,
	inputs: AbiFunctionInputOutput[],
	outputs: AbiFunctionInputOutput[]
) : AbiFunction => buildAbiFunction(name, 'pure', true, false, inputs, outputs);
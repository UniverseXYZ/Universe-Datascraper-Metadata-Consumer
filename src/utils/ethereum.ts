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

const buildAbiFunctionInputsOutputs = (params: any) : AbiFunctionInputOutput[] => {
	return Object.keys(params).map(name => buildAbiFunctionInputOutput(name, params[name]));
}

// Semantic sugar for now but could diverge in the future
export const buildAbiFunctionInputs = buildAbiFunctionInputsOutputs;
export const buildAbiFunctionOutputs = buildAbiFunctionInputsOutputs;

export const buildAbiFunction = (
	name: string,
	stateMutability: AbiFunctionStateMutability,
	constant: boolean,
	payable: boolean,
	inputs: any,
	outputs: any
) : AbiFunction => ({
	type: 'function',
	name,
	stateMutability,
	constant,
	payable,
	inputs: buildAbiFunctionInputs(inputs),
	outputs: buildAbiFunctionOutputs(outputs)
});

export const buildAbiReadFunction = (
	name: string,
	inputs: any,
	outputs: any
) : AbiFunction => buildAbiFunction(name, 'pure', true, false, inputs, outputs);
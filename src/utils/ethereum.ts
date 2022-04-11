/**
 * Build ABIs and function definitions
 * 
 * This file represents a mvp approach to building ABIs and could be expanded
 * significantly in the future should the need arise.
 */

//
// Type definitions - these are not exhaustive and can be added to as needed
//
type AbiMemberType = 'function';
type AbiFunctionStateMutability = 'pure';
type AbiFunctionInputOutputType = 'string' | 'uint16' | 'uint256';
type AbiFunctionInputOutput = {
	name: string,
	type: AbiFunctionInputOutputType
};
type AbiFunction = {
    type: AbiMemberType,
	name: string,
    stateMutability: AbiFunctionStateMutability,
    constant: boolean,
    payable: boolean,
    inputs: AbiFunctionInputOutput[],
    outputs: AbiFunctionInputOutput[]
};

//
// Private functions
//

const buildAbiFunctionInputOutput = (
	name: string,
	type: AbiFunctionInputOutputType
) : AbiFunctionInputOutput => ({ name, type });

const buildAbiFunctionInputsOutputs = (params: any) : AbiFunctionInputOutput[] => {
	// Coealesce to array if params is an object (meaning single input or output)
	const arr = Array.isArray(params) ? params : [params];
	return arr.map(param => {
		const name = Object.keys(param)[0];
		return buildAbiFunctionInputOutput(name, param[name]);
	});
}

// Identical for now but could diverge in the future
const buildAbiFunctionInputs = buildAbiFunctionInputsOutputs;
const buildAbiFunctionOutputs = buildAbiFunctionInputsOutputs;

//
// Exported/public functions
//

/**
 * Given one or more function definitions, return ABI encompassing them.
 * This method is just syntactic sugar that wraps and returns the provided
 * list of function definitions as an array
 */
export const buildAbi = (...functions: any[]) => functions;

/**
 * Build an ABI function definition object
 */
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

/**
 * Build a readonly ABI function definition object
 */
export const buildAbiReadFunction = (
	name: string,
	inputs: any,
	outputs: any,
	stateMutability: AbiFunctionStateMutability = 'pure'
) : AbiFunction => buildAbiFunction(name, stateMutability, true, false, inputs, outputs);
/**
 * @author WMXPY
 * @namespace Operations
 * @description List
 */

import { ImbricateConfiguration } from "../schema/configuration/definition";

export type ImbricateListConfig = {

    readonly configuration: ImbricateConfiguration;
};

export const imbricateList = async (
    _config: ImbricateListConfig,
): Promise<string[]> => {

    return [];
};
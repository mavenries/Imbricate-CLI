/**
 * @author WMXPY
 * @namespace CLI_Commands_Origin
 * @description Use
 */

import { Command } from "commander";
import { IConfigurationManager } from "../../configuration/interface";
import { GlobalManagerOriginResponse } from "../../global/definition";
import { GlobalManager } from "../../global/global-manager";
import { ITerminalController } from "../../terminal/definition";
import { createConfiguredCommand } from "../../util/command";
import { CLIOriginNotFound } from "../../error/origin/origin-not-found";

type OriginUseCommandOptions = {

    readonly quiet?: boolean;
};

export const createOriginUseCommand = (
    globalManager: GlobalManager,
    terminalController: ITerminalController,
    configurationManager: IConfigurationManager,
): Command => {

    const useCommand: Command = createConfiguredCommand("use");

    useCommand
        .description("set specific origin as current origin")
        .option("-q, --quiet", "quite mode")
        .argument("<origin>", "origin name")
        .action(async (
            originName: string,
            _options: OriginUseCommandOptions,
        ): Promise<void> => {

            const origins: GlobalManagerOriginResponse[] = globalManager.origins;

            let targetOrigin: GlobalManagerOriginResponse | null = null;

            for (const origin of origins) {
                if (origin.originName === originName) {
                    targetOrigin = origin;
                    break;
                }
            }

            if (targetOrigin === null) {

                throw CLIOriginNotFound.withOriginName(originName);
            }

            configurationManager.setActiveOrigin(targetOrigin.originName);
            terminalController.printInfo(`Active origin updated: ${targetOrigin.originName}`);

            return;
        });

    return useCommand;
};

/**
 * @author WMXPY
 * @description CLI
 */

import { Command } from "commander";
import { createCollectionCommand } from "./cli/commands/collection";
import { createOriginCommand } from "./cli/commands/origin";
import { initializeOrigin } from "./cli/configuration/initialize-origin";
import { CLIError } from "./cli/error/cli-error";
import { CLIUnknownError } from "./cli/error/unknown";
import { addDirectoryExtension } from "./cli/extensions/directory";
import { addVerboseConfigurationExtension } from "./cli/extensions/verbose-configuration";
import { addWorkingDirectoryOriginExtension } from "./cli/extensions/working-directory-origin";
import { GlobalManager } from "./cli/global/global-manager";
import { debugLog, isDebug } from "./cli/util/debug";

const globalManager = GlobalManager.fromScratch();

const imbricateProgram = new Command();

imbricateProgram
    .version("<current-version>")
    .name("imbricate")
    .description("Imbricate CLI");

imbricateProgram
    .configureHelp({
        showGlobalOptions: true,
    });

addDirectoryExtension(imbricateProgram, globalManager);
addVerboseConfigurationExtension(imbricateProgram, globalManager);

addWorkingDirectoryOriginExtension(imbricateProgram, globalManager);

imbricateProgram.addCommand(createCollectionCommand(globalManager));
imbricateProgram.addCommand(createOriginCommand(globalManager));

export const execute = async (): Promise<void> => {

    try {

        debugLog("Start Imbricate CLI");

        await initializeOrigin(globalManager);

        debugLog("Origin Initialized");

        imbricateProgram.parse(process.argv);
    } catch (error) {

        if (isDebug()) {
            throw error;
        }

        const fixedError: CLIError = error instanceof CLIError
            ? error
            : error instanceof Error
                ? CLIUnknownError.withError(error)
                : CLIUnknownError.withError(new Error(error as any));

        console.error(fixedError.toString());
    }
};

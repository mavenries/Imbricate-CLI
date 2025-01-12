/**
 * @author WMXPY
 * @namespace Commands_Collection
 * @description List
 */

import { IImbricateOrigin, IImbricateOriginCollection } from "@imbricate/core";
import { Command } from "commander";
import { IConfigurationManager } from "../../configuration/interface";
import { CLIActiveOriginNotFound } from "../../error/origin/active-origin-not-found";
import { GlobalManager } from "../../global/global-manager";
import { ITerminalController } from "../../terminal/definition";
import { createActionRunner } from "../../util/action-runner";
import { createConfiguredCommand } from "../../util/command";

type CollectionListCommandOptions = {

    readonly json?: boolean;
};

export const createCollectionListCommand = (
    globalManager: GlobalManager,
    terminalController: ITerminalController,
    _configurationManager: IConfigurationManager,
): Command => {

    const listCommand: Command = createConfiguredCommand("list");

    listCommand
        .description("list collections")
        .option("-j, --json", "print result as JSON")
        .action(createActionRunner(terminalController, async (
            options: CollectionListCommandOptions,
        ): Promise<void> => {

            const currentOrigin: IImbricateOrigin | null = globalManager.findCurrentOrigin();

            if (!currentOrigin) {
                throw CLIActiveOriginNotFound.create();
            }

            const collections: IImbricateOriginCollection[] = await currentOrigin.listCollections();

            if (options.json) {

                terminalController.printInfo(JSON.stringify(collections.map((collection) => {
                    return {
                        collectionName: collection.collectionName,
                        description: collection.description,
                    };
                }), null, 2));
                return;
            }

            if (collections.length === 0) {
                terminalController.printInfo("No collection found");
                return;
            }

            terminalController.printInfo(collections.map((collection: IImbricateOriginCollection) => {
                return collection.collectionName;
            }).join("\n"));

            return;
        }));

    return listCommand;
};

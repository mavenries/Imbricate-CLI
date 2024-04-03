import { GlobalManager } from "../global/global-manager";
import { readActiveEditing, writeActiveEditings } from "./controller";
import { ActiveEditing, SAVING_TARGET_TYPE, SavingTarget } from "./definition";

export const hashSavingTarget = (savingTarget: SavingTarget<any>): string => {

    switch(savingTarget.type) {
        case SAVING_TARGET_TYPE.PAGE: {
            const origin = savingTarget.payload.origin;
            const collection = (savingTarget as SavingTarget<SAVING_TARGET_TYPE.PAGE>).payload.collection;
            const identifier = savingTarget.payload.identifier;
            return `PAGE:${origin}:${collection}:${identifier}`;
        }
        case SAVING_TARGET_TYPE.SCRIPT:
            const origin = savingTarget.payload.origin;
            const identifier = savingTarget.payload.identifier;
            return `SCRIPT:${origin}:${identifier}`;
    }
    return null as never;
};

export const performSavingTarget = async (savingTarget: SavingTarget<any>, content: string, globalManager: GlobalManager): Promise<void> => {

    switch(savingTarget.type) {
        case SAVING_TARGET_TYPE.PAGE: {
            const origin = globalManager.getOrigin(savingTarget.payload.origin);
            if(!origin){
                throw new Error("Saving taget failed")
            }
            const collection = await origin.getCollection((savingTarget as SavingTarget<SAVING_TARGET_TYPE.PAGE>).payload.collection);
            if(!collection){
                throw new Error("Saving taget failed")
            }

            const page = await collection.getPage(savingTarget.payload.identifier);
            if(!page){
                throw new Error("Saving target failed")
            }

            await page.writeContent(content);
            break;
        }
        case SAVING_TARGET_TYPE.SCRIPT:
            const origin = globalManager.getOrigin(savingTarget.payload.origin);
            if(!origin){
                throw new Error("Saving taget failed")
            }

            const script = await origin.getScript(savingTarget.payload.identifier);
            if(!script){
                throw new Error("Saving target failed")
            }

            await script.writeScript(content);
            break;
    }

    const activeEditings: ActiveEditing[] = await readActiveEditing();

    const savingTargetHash = hashSavingTarget(savingTarget);
    const updatedActiveEditings: ActiveEditing[] = activeEditings.filter((item: ActiveEditing) => {
        return item.hash !== savingTargetHash;
    });

    await writeActiveEditings(updatedActiveEditings);
};
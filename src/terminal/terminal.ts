/**
 * @author WMXPY
 * @namespace Terminal
 * @description Terminal
 */

import { ITerminalController } from "./definition";

export class TTYTerminalController implements ITerminalController {

    public static create(): TTYTerminalController {

        return new TTYTerminalController();
    }

    private constructor() {

    }

    public printInfo(...args: string[]): void {

        console.log(...args);
    }

    public printErrorMessage(...args: string[]): void {

        console.error(...args);
    }
}

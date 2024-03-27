/**
 * @author WMXPY
 * @namespace CLI
 * @description Configuration Manager
 * @override Mock
 */

import { IImbricateConfiguration } from "../../src/cli/configuration/definition";
import { IConfigurationManager } from "../../src/cli/configuration/interface";
import { IImbricateConfigurationOrigin } from "../../src/cli/configuration/raw-definition";
import { IImbricateOrigin } from "../../src/origin/interface";

export class MockConfigurationManager implements IConfigurationManager {

    public static create(
        configurationPath: string,
        configuration: IImbricateConfiguration,
    ): MockConfigurationManager {

        return new MockConfigurationManager(
            configurationPath,
            configuration,
        );
    }

    public configurationPath: string;
    public origins: IImbricateConfigurationOrigin[];
    public activeOrigin: string | null;

    private _mockOrigin: IImbricateOrigin | null = null;

    private constructor(
        configurationPath: string,
        configuration: IImbricateConfiguration,
    ) {

        this.configurationPath = configurationPath;
        this.origins = configuration.origins;
        this.activeOrigin = configuration.activeOrigin;
    }

    public setActiveOrigin(_origin: string | null): this {

        throw new Error("Method not implemented.");
    }

    public addOrigin(_origin: IImbricateConfigurationOrigin): this {

        throw new Error("Method not implemented.");
    }

    public registerOriginConstructor(
        _type: string,
        _constructor: (origin: IImbricateConfigurationOrigin) => any,
    ): this {

        throw new Error("Method not implemented.");
    }

    public reconstructOrigin(
        _type: string,
        _origin: IImbricateConfigurationOrigin,
    ): any {

        if (this._mockOrigin) {
            return this._mockOrigin;
        }

        throw new Error("Method not implemented.");
    }

    public assignMockOrigin(origin: IImbricateOrigin): this {

        this._mockOrigin = origin;
        return this;
    }
}

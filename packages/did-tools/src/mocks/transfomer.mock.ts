export const mockTransformedCoreTS = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import { getSatelliteExtendedActor } from '@junobuild/core';

export const build_version = async (): Promise<string> => {
\tconst {build_version} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await build_version();
}

export const world = async (value0: Hello, value1: string): Promise<string> => {
\tconst {world} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await world(value0, value1);
}

export const yolo = async (value0: Hello): Promise<string> => {
\tconst {yolo} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await yolo(value0);
}`;

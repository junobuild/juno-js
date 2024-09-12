export const mockTransformedCoreTS = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import { getSatelliteExtendedActor } from '@junobuild/core';

export const build_version = async (): Promise<string> => {
\tconst {build_version} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await build_version();
}

export const hello_world = async (value0: Hello, value1: string, value2: bigint): Promise<Result> => {
\tconst {hello_world} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await hello_world(value0, value1, value2);
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

export const mockTransformedCoreJS = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import { getSatelliteExtendedActor } from '@junobuild/core';

export const build_version = async () => {
\tconst {build_version} = await getSatelliteExtendedActor({
\t\tidlFactory
\t});

\treturn await build_version();
}

export const hello_world = async (value0, value1, value2) => {
\tconst {hello_world} = await getSatelliteExtendedActor({
\t\tidlFactory
\t});

\treturn await hello_world(value0, value1, value2);
}

export const world = async (value0, value1) => {
\tconst {world} = await getSatelliteExtendedActor({
\t\tidlFactory
\t});

\treturn await world(value0, value1);
}

export const yolo = async (value0) => {
\tconst {yolo} = await getSatelliteExtendedActor({
\t\tidlFactory
\t});

\treturn await yolo(value0);
}`;

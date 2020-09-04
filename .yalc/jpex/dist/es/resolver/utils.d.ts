import { Factory, JpexInstance, ResolveOpts, NamedParameters } from '../types';
export declare const getFactory: (jpex: JpexInstance, name: string, opts: ResolveOpts) => Factory;
export declare const cacheResult: (jpex: JpexInstance, name: string, factory: Factory, value: any, namedParameters: NamedParameters) => void;

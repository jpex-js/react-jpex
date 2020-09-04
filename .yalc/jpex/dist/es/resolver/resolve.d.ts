import { JpexInstance, Dependency, Definition, NamedParameters, ResolveOpts } from '../types';
export declare const resolveOne: <R extends unknown>(jpex: JpexInstance, name: Dependency, namedParameters: NamedParameters, opts: ResolveOpts, stack: string[]) => R;
export declare const resolveMany: <R extends any[]>(jpex: JpexInstance, definition: Definition, namedParameters: {
    [key: string]: any;
}, opts: ResolveOpts, stack: string[]) => R;

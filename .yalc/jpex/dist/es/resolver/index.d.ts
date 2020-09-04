import { JpexInstance, Definition, Dependency, ResolveOpts } from '../types';
export { getFactory } from './utils';
export declare const resolve: (jpex: JpexInstance, name: Dependency, opts?: ResolveOpts) => unknown;
export declare const resolveDependencies: (jpex: JpexInstance, definition: Definition, opts?: ResolveOpts) => any[];
export declare const isResolved: (jpex: JpexInstance, dependency: Dependency) => boolean;
export declare const allResolved: (jpex: JpexInstance, dependencies: Dependency[]) => boolean;

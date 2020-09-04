import { JpexInstance, Dependency, AnyFunction, FactoryOpts } from '../types';
declare function factory<T>(jpex: JpexInstance, name: string, dependencies: Dependency[], fn: AnyFunction<T>, opts?: FactoryOpts): void;
export default factory;

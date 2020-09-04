import { JpexInstance, Dependency, AnyFunction } from './types';
declare const encase: <F extends AnyFunction<F>>(jpex: JpexInstance, dependencies: Dependency[], fn: F) => any;
export default encase;

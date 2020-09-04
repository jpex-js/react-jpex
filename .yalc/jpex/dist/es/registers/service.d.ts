import { JpexInstance, Dependency, ServiceOpts } from '../types';
declare function service(jpex: JpexInstance, name: string, dependencies: Dependency[], fn: any, opts?: ServiceOpts): void;
export default service;

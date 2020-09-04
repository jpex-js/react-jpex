import { JpexInstance as IJpex, AnyFunction, Factory, SetupConfig } from './types';
declare class Jpex implements IJpex {
    decorate: any;
    $$config: IJpex['$$config'];
    $$parent: IJpex;
    $$factories: {
        [key: string]: Factory;
    };
    $$resolved: {
        [key: string]: any;
    };
    constructor(options?: SetupConfig, parent?: IJpex);
    extend(config?: SetupConfig): IJpex;
    constant(name: string, obj?: any): void;
    factory(name: any, deps?: any, fn?: any, opts?: any): any;
    service(name: any, deps?: any, fn?: any, opts?: any): any;
    alias(alias?: any, name?: any): any;
    resolve(name?: any, opts?: any): any;
    resolveWith(name: any, namedParameters?: any, opts?: any): any;
    raw(name?: any): any;
    encase<F extends AnyFunction, G extends AnyFunction<F>>(deps: any, fn?: any): any;
    clearCache(...names: any[]): any;
    infer(): string;
}
export default Jpex;

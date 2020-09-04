export * from './JpexInstance';
export * from './BuiltIns';
export declare type Lifecycle = 'application' | 'class' | 'instance' | 'none';
export declare type Precedence = 'active' | 'passive';
export declare type AnyFunction<R = any> = (...args: any[]) => R;
export interface AnyConstructor<T = any> {
    new (...args: any[]): T;
}
export declare type Dependency = string;
export interface Definition {
    dependencies?: Dependency[];
}
export interface Factory extends Definition {
    fn: AnyFunction;
    lifecycle: Lifecycle;
    resolved?: boolean;
    value?: any;
}

export declare const isObject: (obj: any) => obj is object;
export declare const isSymbol: (obj: any) => boolean;
export declare const isString: (obj: any) => obj is string;
export declare const isFunction: (obj: any) => obj is Function;
export declare const hasOwn: <T>(obj: T, name: string | Symbol) => boolean;
export declare const instantiate: (context: any, args: any[]) => any;
export declare const isNode: boolean;
export declare const unsafeRequire: (target: string) => any;
interface GetLast {
    (str: string): string;
    <T>(arr: T[]): T;
}
export declare const getLast: GetLast;
export {};

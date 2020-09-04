import { JpexInstance } from 'jpex';
declare type Opts = Parameters<JpexInstance['resolve']>[0];
interface UseResolve {
    <T>(): T;
    <T>(deps: any[]): T;
    <T>(opts: Opts): T;
    <T = any>(name: string): T;
    <T = any>(name: string, deps: any[]): T;
    <T = any>(name: string, opts: Opts): T;
}
declare const useResolve: UseResolve;
export default useResolve;

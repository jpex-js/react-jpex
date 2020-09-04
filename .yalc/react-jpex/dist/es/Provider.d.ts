import { ReactNode } from 'react';
import { JpexInstance } from 'jpex';
interface Props {
    value?: JpexInstance;
    children?: ReactNode;
}
declare const JpexProvider: {
    ({ value, children }: Props): JSX.Element;
    displayName: string;
};
export default JpexProvider;

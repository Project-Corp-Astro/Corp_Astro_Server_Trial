/**
 * Type declarations for Material UI Grid component
 * This file provides type overrides to fix TypeScript errors in the dashboard examples
 */

import { ElementType, CSSProperties } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { GridTypeMap } from '@mui/material/Grid';

declare module '@mui/material/Grid' {
  interface GridBaseProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
    alignItems?: string;
    justifyContent?: string;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    mb?: number;
    mt?: number;
    mx?: number;
    my?: number;
    p?: number;
    px?: number;
    py?: number;
    style?: CSSProperties;
    sx?: SxProps<Theme>;
  }

  export interface GridProps extends GridBaseProps {
    component?: ElementType;
  }

  export default function Grid(props: GridProps): JSX.Element;
}

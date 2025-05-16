/**
 * Type declarations for Material UI Select component
 * This file provides type overrides to fix TypeScript errors in the dashboard examples
 */

import { SelectChangeEvent } from '@mui/material/Select';

declare module '@mui/material/Select' {
  export interface SelectProps {
    onChange?: (event: SelectChangeEvent<any>, child: React.ReactNode) => void;
    value?: unknown;
    label?: string;
    labelId?: string;
  }
}

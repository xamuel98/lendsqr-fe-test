/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCKAROO_BASE_URL: string;
  readonly VITE_MOCKAROO_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg?react" {
  import type { FC, SVGProps } from "react";

  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

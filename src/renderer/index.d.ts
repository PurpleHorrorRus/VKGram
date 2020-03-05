/* eslint-disable import/no-duplicates */
declare module "*.vue" {
  import { VueConstructor } from "vue";
  const _default: VueConstructor;
  export default _default;
}

declare module "*.mp3" {
    import { VueConstructor } from "vue";
    const _default: VueConstructor;
    export default _default;
  }

declare const __resources : string;

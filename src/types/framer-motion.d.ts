
declare module "framer-motion" {
  export function useInView(
    ref: React.RefObject<Element>,
    options?: {
      once?: boolean;
      margin?: string;
      amount?: "some" | "all" | number;
      root?: React.RefObject<Element>;
    }
  ): boolean;
  
  export const motion: any;
  export const AnimatePresence: any;
}


import { motion } from "framer-motion";

interface LoginErrorProps {
  errorMsg: string;
}

const LoginError = ({ errorMsg }: LoginErrorProps) => {
  if (!errorMsg) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20"
    >
      {errorMsg}
    </motion.div>
  );
};

export default LoginError;

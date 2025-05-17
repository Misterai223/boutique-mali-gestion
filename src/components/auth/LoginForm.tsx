
import LoginFormContainer from "./LoginFormContainer";

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  return <LoginFormContainer onLogin={onLogin} />;
};

export default LoginForm;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({ type, label, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input type={type} {...props} />
    </div>
  );
};

export default Input;

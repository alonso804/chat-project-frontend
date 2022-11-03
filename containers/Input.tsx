interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  props?: any;
}

const Input = ({ type, name, placeholder, value, ...props }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      autoComplete="off"
      className="bg-transparent m-auto text-white p-2 rounded-full text-center border border-white focus:border-purple-400 outline-none placeholder-gray-400"
      {...props}
    />
  );
};

export default Input;

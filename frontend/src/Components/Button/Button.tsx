interface ButtonProps {
  className?: string;
  text: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}
export const Button = (props: ButtonProps) => {
  const { className, text, disabled } = props;
  return (
    <button
      className={
        className + " px-4 py-2 text-white rounded-lg border focus:outline-none"
      }
      disabled={disabled}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {text}
    </button>
  );
};

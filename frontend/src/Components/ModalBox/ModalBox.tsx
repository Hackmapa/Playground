import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const ModalBox = (props: ModalBoxProps) => {
  const { open, setOpen, children, className } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center">
      <div
        className={"p-6 relative rounded-lg shadow-lg w-1/2 z-60 " + className}
      >
        <p
          className="absolute right-2 top-2 text-white hover:cursor-pointer transform hover:scale-110 transition-transform duration-200"
          onClick={() => setOpen(false)}
        >
          <IoMdClose size={20} />
        </p>
        {children}
      </div>
    </div>
  );
};

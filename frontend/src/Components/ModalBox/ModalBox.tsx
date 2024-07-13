import React, { ReactNode } from "react";

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
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center"
      // onClick={() => setOpen(false)}
    >
      <div className={"p-6 rounded-lg shadow-lg w-1/2 z-60 " + className}>
        <p className="text-black" onClick={() => setOpen(false)}>
          Close
        </p>
        {children}
      </div>
    </div>
  );
};

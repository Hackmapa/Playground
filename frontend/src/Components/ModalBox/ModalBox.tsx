import React, { ReactNode } from "react";

interface ModalBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}

export const ModalBox = (props: ModalBoxProps) => {
  const { open, setOpen, children } = props;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center"
      onClick={() => setOpen(false)}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">{children}</div>
    </div>
  );
};

import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type Dificuldade = "facil" | "medio" | "dificil";

interface CampoContextData {
  rows: number;
  cols: number;
  setRows: Dispatch<SetStateAction<number>>; 
  setCols: Dispatch<SetStateAction<number>>; 
  dificuldade: Dificuldade;
  setDificuldade: (d: Dificuldade) => void;
}

const CampoContext = createContext<CampoContextData | undefined>(undefined);

export const CampoProvider = ({ children }: { children: React.ReactNode }) => {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [dificuldade, setDificuldade] = useState<Dificuldade>("facil");

  useEffect(() => {
    if (dificuldade === "facil") {
      setRows(5);
      setCols(5);
    } else if (dificuldade === "medio") {
      setRows(8);
      setCols(8);
    } else {
      setRows(12);
      setCols(10);
    }
  }, [dificuldade]);

  return (
    <CampoContext.Provider
      value={{
        rows,
        cols,
        setRows,
        setCols,
        dificuldade,
        setDificuldade,
      }}
    >
      {children}
    </CampoContext.Provider>
  );
};

export const useCampo = () => {
  const context = useContext(CampoContext);
  if (!context) {
    throw new Error("useCampo must be used within a CampoProvider");
  }
  return context;
};

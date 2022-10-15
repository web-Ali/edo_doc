import { createContext, useMemo, ReactNode } from 'react';
import { useMemoizedFn, useSetState } from 'ahooks';

type ValueType = {
  title: string;
  setTitle: (title: string) => void;
};

type State = Partial<ValueType>;

const defaultState: State = {
  title: '',
};

export const GlobalContext = createContext<ValueType>(defaultState as ValueType);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useSetState<ValueType>(defaultState as ValueType);
  const setTitle = useMemoizedFn((title: string) => setState({ title }));


  const value = useMemo(
    () => ({
      // @ts-ignore
      setTitle,
      ...state,
    }),
    [state, setTitle],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

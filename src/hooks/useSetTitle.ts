import { useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts';

const defaultTitle = 'Документооборот ГГНТУ';

const useSetTitle = (title: string) => {
  const { setTitle } = useContext(GlobalContext);
  useEffect(() => {
    setTitle(title);
    document.title = title;
    return () => {
      setTitle(defaultTitle);
      document.title = defaultTitle;
    };
  }, [title, setTitle]);
};

export default useSetTitle;

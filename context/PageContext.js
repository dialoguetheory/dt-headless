import { createContext, useContext } from 'react';

export const PageContext = createContext('');

export const PageProvider = ({ children, pageLink }) => {
  return (
    <PageContext.Provider value={pageLink}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageLink = () => {
  return useContext(PageContext);
}; 
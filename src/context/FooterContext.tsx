import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';

// TypeScript Interfaces
export interface FooterPolicy {
  id: number;
  type: 'TERMS' | 'PRIVACY';
  title: string;
  content: string;
}

export interface FamilySite {
  id: number;
  name: string;
  url: string;
}

interface FooterContextType {
  // Policies
  termsPolicy: FooterPolicy | null;
  privacyPolicy: FooterPolicy | null;
  policiesLoading: boolean;
  policiesError: string | null;
  fetchPolicy: (type: 'TERMS' | 'PRIVACY') => Promise<FooterPolicy | null>;
  
  // Family Sites
  familySites: FamilySite[];
  familySitesLoading: boolean;
  familySitesError: string | null;
  
  // Initialization
  isInitialized: boolean;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

interface FooterProviderProps {
  children: ReactNode;
}

export const FooterProvider: React.FC<FooterProviderProps> = ({ children }) => {
  // Policies state
  const [termsPolicy, setTermsPolicy] = useState<FooterPolicy | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<FooterPolicy | null>(null);
  const [policiesLoading, setPoliciesLoading] = useState(false);
  const [policiesError, setPoliciesError] = useState<string | null>(null);
  
  // Family sites state
  const [familySites, setFamilySites] = useState<FamilySite[]>([]);
  const [familySitesLoading, setFamilySitesLoading] = useState(false);
  const [familySitesError, setFamilySitesError] = useState<string | null>(null);
  
  // Initialization flag
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch policy by type
  const fetchPolicy = useCallback(async (type: 'TERMS' | 'PRIVACY'): Promise<FooterPolicy | null> => {
    // Check if already cached
    if (type === 'TERMS' && termsPolicy) return termsPolicy;
    if (type === 'PRIVACY' && privacyPolicy) return privacyPolicy;

    setPoliciesLoading(true);
    setPoliciesError(null);

    try {
      // API returns an array, so we use FooterPolicy[] and access [0]
      const response = await get<FooterPolicy[]>(`${API_ENDPOINTS.FOOTER.POLICIES}?type=${type}`);
      
      if (response.error) {
        setPoliciesError(response.error);
        return null;
      }

      // Extract first item from array (empty array is valid - means no data)
      const policyData = Array.isArray(response.data) && response.data.length > 0 
        ? response.data[0] 
        : null;

      if (policyData) {
        if (type === 'TERMS') {
          setTermsPolicy(policyData);
        } else {
          setPrivacyPolicy(policyData);
        }
        return policyData;
      }
      
      // Empty array is not an error, just no data available
      return null;
    } catch (error) {
      setPoliciesError('정책 정보를 불러오는데 실패했습니다.');
      return null;
    } finally {
      setPoliciesLoading(false);
    }
  }, [termsPolicy, privacyPolicy]);

  // Fetch family sites
  const fetchFamilySites = useCallback(async () => {
    // Already fetched
    if (familySites.length > 0 || isInitialized) return;

    setFamilySitesLoading(true);
    setFamilySitesError(null);

    try {
      const response = await get<FamilySite[]>(API_ENDPOINTS.FOOTER.FAMILY_SITES);
      
      if (response.error) {
        setFamilySitesError(response.error);
        return;
      }

      if (response.data) {
        setFamilySites(response.data);
      }
    } catch (error) {
      setFamilySitesError('패밀리 사이트 정보를 불러오는데 실패했습니다.');
    } finally {
      setFamilySitesLoading(false);
    }
  }, [familySites.length, isInitialized]);

  // Initialize on mount - fetch family sites once
  useEffect(() => {
    if (!isInitialized) {
      fetchFamilySites();
      setIsInitialized(true);
    }
  }, [fetchFamilySites, isInitialized]);

  const value: FooterContextType = {
    termsPolicy,
    privacyPolicy,
    policiesLoading,
    policiesError,
    fetchPolicy,
    familySites,
    familySitesLoading,
    familySitesError,
    isInitialized,
  };

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = (): FooterContextType => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};

export default FooterContext;

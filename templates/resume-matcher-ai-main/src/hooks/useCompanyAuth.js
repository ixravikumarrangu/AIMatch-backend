import { useState, useEffect } from "react";

export const useCompanyAuth = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("companyData");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.company_id) {
        setCompany(parsed);
      }
    }
    setLoading(false);
  }, []);

  const updateCompany = (data) => {
    localStorage.setItem("companyData", JSON.stringify(data));
    setCompany(data);
  };

  const logout = () => {
    localStorage.removeItem("companyData");
    setCompany(null);
  };

  return { company, loading, updateCompany, logout };
};

// Utility for API calls
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getBranchComparison = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.year) params.append('year', filters.year);
  if (filters.branch) params.append('branch', filters.branch);
  return axios.get(`${API_BASE_URL}/dashboard/branch-comparison?${params.toString()}`).then(res => res.data);
};
export const getIndustryDistribution = () => axios.get(`${API_BASE_URL}/dashboard/industry-distribution`).then(res => res.data);
export const getPackageDistribution = () => axios.get(`${API_BASE_URL}/dashboard/package-distribution`).then(res => res.data);
export const getTopCompanies = () => axios.get(`${API_BASE_URL}/dashboard/companies/top-recruiting`).then(res => res.data);
export const getCompanies = () => axios.get(`${API_BASE_URL}/dashboard/companies`).then(res => res.data);

// Add more API functions as needed

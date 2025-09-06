import { useEffect, useState } from "react"
import { Search, Bell, User, Menu } from "lucide-react"
import KeyMetrics from "./components/KeyMetrics"
import PlacementTrends from "./components/PlacementTrends"
import Chart from "react-apexcharts"
import PlacementDistribution from "./components/PlacementDistribution"
import TopCompanies from "./components/TopCompanies"
import FilterSection from "./components/FilterSection"
import styles from "./App.module.css"
import {
  getBranchComparison,
  getIndustryDistribution,
  getPackageDistribution,
  getTopCompanies
} from "./api"

const App = () => {
  const [loading, setLoading] = useState(true)
  const [selectedYears, setSelectedYears] = useState(["2022-2023", "2023-2024", "2024-2025"])
  // Use branch codes for filtering, but show names in UI
  const branchList = [
    { code: 1, name: "Computer Science" },
    { code: 2, name: "Information Technology" },
    { code: 3, name: "Electronics & Communication" },
    { code: 4, name: "Mechanical Engineering" },
    { code: 5, name: "Civil Engineering" },
    { code: 6, name: "Electrical Engineering" },
  ];
  const branchCodeNameMap = Object.fromEntries(branchList.map(b => [b.code, b.name]));
  const branchNameCodeMap = Object.fromEntries(branchList.map(b => [b.name, b.code]));
  // Store codes internally, but show names in UI
  const [selectedBranches, setSelectedBranches] = useState([1,2,3,4,5,6]);

  const [dashboardData, setDashboardData] = useState(null)

  // Helper to get CSS variable value
  const getCSSVar = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  // Chart colors from CSS
  const chartColorPrimary = getCSSVar('--chart-color') || '#2563EB';
  const chartColorBar = getCSSVar('--chart-color-bar') || '#581C87';
  const chartColorBranch = getCSSVar('--chart-color-branch') || '#1E40AF';
  const chartColorDonut1 = getCSSVar('--chart-color-1') || '#4ECDC4';
  const chartColorDonut2 = getCSSVar('--chart-color-2') || '#FFA500';
  const chartColorDonut3 = getCSSVar('--chart-color-3') || '#8E44AD';
  const chartColorDonut4 = getCSSVar('--chart-color-4') || '#E74C3C';
  const chartColorDonut5 = getCSSVar('--chart-color-5') || '#FFFF00';


  // ...existing code...


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const yearParam = selectedYears && selectedYears.length > 0 ? selectedYears.join(',') : undefined;
        const branchParam = selectedBranches && selectedBranches.length > 0 ? selectedBranches.join(',') : undefined;
        let [branch, industry, pkg, top] = await Promise.all([
          getBranchComparison({ year: yearParam, branch: branchParam }),
          getIndustryDistribution(),
          getPackageDistribution(),
          getTopCompanies()
        ]);
        // Debug: log backend responses
        // Removed debug console logs
        // Filter branch data to only include selected branches
        let filteredBranch = branch.filter(b => selectedBranches.includes(Number(b.branch_code)));
        let useAllData = false;
        // If no data for filters, use all data from backend (ignore filters)
        if (filteredBranch.length === 0 && branch.length > 0) {
          filteredBranch = branch;
          useAllData = true;
        }
        // Only use backend data for branch-wise graph, no mapping with branchList
        // Helper to parse all numeric fields
        function parseBranchFields(b) {
          function safeNum(val) {
            const n = Number(val);
            return isNaN(n) || n === null || n === undefined ? 0 : n;
          }
          return {
            ...b,
            placement_percentage: safeNum(b.placement_percentage),
            avg_package: safeNum(b.avg_package),
            max_package: safeNum(b.max_package),
            students_placed: safeNum(b.students_placed),
          };
        }
        // Always show all selected branches, even if placement is 0
        const branchMap = new Map();
        filteredBranch.forEach(b => {
          const parsed = parseBranchFields(b);
          // If multiple rows for same branch, pick the one with highest placement %
          if (!branchMap.has(parsed.branch_code) || parsed.placement_percentage > branchMap.get(parsed.branch_code).placement_percentage) {
            branchMap.set(parsed.branch_code, parsed);
          }
        });
        // Fill missing selected branches with 0 placement
        const uniqueBranches = selectedBranches.map(code => {
          const found = branchMap.get(code);
          if (found) return found;
          return {
            branch_code: code,
            branch_name: branchCodeNameMap[code] || `Branch ${code}`,
            placement_percentage: 0,
            avg_package: 0,
            max_package: 0,
            students_placed: 0
          };
        });
        const branchNames = uniqueBranches.map(b => b.branch_name);
        const branchPercentages = uniqueBranches.map(b => b.placement_percentage);
        const branchAvgPackages = uniqueBranches.map(b => b.avg_package);
        const branchMaxPackages = uniqueBranches.map(b => b.max_package);
        const totalOffers = uniqueBranches.reduce((acc, b) => acc + (b.students_placed || 0), 0);
        const avgPlacement = branchPercentages.length > 0
          ? (branchPercentages.reduce((acc, val) => acc + val, 0) / branchPercentages.length)
          : 0;
        const avgPackage = branchAvgPackages.length > 0
          ? (branchAvgPackages.reduce((acc, val) => acc + val, 0) / branchAvgPackages.length)
          : 0;
        const maxPackage = branchMaxPackages.length > 0
          ? Math.max(...branchMaxPackages)
          : 0;
        // Yearly graph: always show all selected years, even if placement is 0
        let trendsYears = [], trendsPercentages = [], hasYearData = false;
        const selectedYearSet = new Set(selectedYears);
        const allYears = Array.from(selectedYearSet).sort();
        if (allYears.length > 0) {
          const yearData = allYears.map(y => {
            const yearRows = branch.filter(b => b.year === y && selectedBranches.includes(Number(b.branch_code)));
            if (yearRows.length === 0) return 0;
            return parseFloat((yearRows.reduce((a, b) => a + Number(b.placement_percentage), 0) / yearRows.length).toFixed(1));
          });
          hasYearData = true;
          trendsYears = allYears;
          trendsPercentages = yearData;
        }
        setDashboardData({
          keyMetrics: [
            { label: "Average Placement %", value: isNaN(avgPlacement) ? "0%" : `${avgPlacement.toFixed(1)}%` },
            { label: "Average Package", value: isNaN(avgPackage) ? "₹0 LPA" : `₹${(avgPackage / 100000).toFixed(2)} LPA` },
            { label: "Highest Package", value: isNaN(maxPackage) ? "₹0 LPA" : `₹${(maxPackage / 100000).toFixed(2)} LPA` },
            { label: "Total Offers", value: totalOffers },
          ],
          placementTrends: hasYearData
            ? {
                series: [{ name: "Placement %", data: trendsPercentages }],
                options: {
                  chart: { type: "line", toolbar: { show: true } },
                  xaxis: { categories: trendsYears },
                  yaxis: {
                    title: { text: "Placement Percentage (%)" },
                    min: 0,
                    max: 100,
                    labels: {
                      formatter: val => val.toFixed(1)
                    }
                  },
                  title: { text: "Yearly Placement Percentage Trend" },
                  colors: [chartColorPrimary],
                },
              }
            : null,
          branchComparison: {
            series: [{ name: "Placement %", data: branchPercentages }],
            options: {
              chart: { type: "bar", toolbar: { show: true } },
              xaxis: { categories: branchNames },
              yaxis: { title: { text: "Placement %" }, min: 0, max: 100 },
              title: { text: "Branch-wise Placement Comparison", align: "center" },
              colors: [chartColorBranch],
              plotOptions: {
                bar: {
                  borderRadius: 8,
                  columnWidth: '60%',
                }
              },
            },
          },
          industryDistribution: {
            series: industry.map(i => i.selected_count),
            options: {
              chart: { type: "donut" },
              labels: industry.map(i => i.industry_name),
              title: { text: "Industry-wise Placement Distribution", align: "center" },
              colors: [chartColorDonut1, chartColorDonut2, chartColorDonut3, chartColorDonut4, chartColorDonut5],
            },
          },
          packageDistribution: {
            series: [{ name: "Students", data: pkg.map(p => Number(p.student_count)) }],
            options: {
              chart: { type: "bar", toolbar: { show: true } },
              xaxis: { categories: pkg.map(p => p.salary_range), title: { text: "Package Range (LPA)" } },
              yaxis: { title: { text: "Number of Students" } },
              title: { text: "Package Distribution (Students vs Package)", align: "center" },
              colors: [chartColorBar],
              plotOptions: {
                bar: {
                  borderRadius: 8,
                  columnWidth: '60%',
                }
              },
            },
          },
          topCompanies: top.map(c => ({
            company: c.company_name,
            offers: c.total_jobs,
            avgPackage: c.avg_salary ? (c.avg_salary / 100000).toFixed(2) : "0.00",
            highestPackage: c.max_salary ? (c.max_salary / 100000).toFixed(2) : "0.00",
            industry: c.industry_name
          })),
        });
      } catch (err) {
        console.error("API error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedYears, selectedBranches]);


  if (loading || !dashboardData) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }


  // No 'No data' message: always show available data if filters return nothing

  // Chart color logic removed; use only CSS modules for chart colors

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src="logo.png" />
            </div>
            <div className={styles.logoText}>
              <h1>Institute Of Engineering and Technology</h1>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="Search..." />
          </div>
          <Bell className={styles.headerIcon} />
          <User className={styles.headerIcon} />
          <Menu className={styles.headerIcon} />
        </div>
      </header>

      <main className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <h2>Placement Dashboard</h2>
        </div>

        <FilterSection
          selectedYears={selectedYears}
          setSelectedYears={setSelectedYears}
          selectedBranches={selectedBranches.map(code => branchCodeNameMap[code])}
          setSelectedBranches={namesArr => setSelectedBranches(namesArr.map(name => branchNameCodeMap[name]))}
          branchList={branchList.map(b => b.name)}
        />

        <KeyMetrics metrics={dashboardData.keyMetrics} />

        {/* Placement Trends: Line (yearly) + Bar (branch-wise) side by side */}
        {dashboardData.placementTrends ? (
          <PlacementTrends
            trendsData={dashboardData.placementTrends}
            branchData={dashboardData.branchComparison}
          />
        ) : (
          <div className={styles.noTrendsChart}>
            <Chart
              options={dashboardData.branchComparison.options}
              series={dashboardData.branchComparison.series}
              type="bar"
              height={350}
            />
          </div>
        )}

        <PlacementDistribution
          industryData={dashboardData.industryDistribution}
          packageData={dashboardData.packageDistribution}
        />

        <TopCompanies companies={dashboardData.topCompanies} />

        <div className={styles.exportSection}>
          <h3>Export Data</h3>
          <div className={styles.exportOptions}>
            <label>
              <input type="radio" name="format" value="csv" defaultChecked />
              CSV
            </label>
            <label>
              <input type="radio" name="format" value="excel" />
              Excel
            </label>
          </div>
          <button className={styles.exportButton}>Export Dashboard Data</button>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>All rights reserved©</p>
          <p>supportmail@ietdavv.edu.in</p>
          <p>Managed by Placement CELL IET</p>
          <div className={styles.socialLinks}>
            {/* <span>📷</span>
            <span>𝕏</span>
            <span>💼</span>
            <span>📺</span>
            <span>📘</span> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App

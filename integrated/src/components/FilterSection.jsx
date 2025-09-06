
import { Filter, Calendar, GraduationCap } from "lucide-react"
import styles from "./FilterSection.module.css"

const FilterSection = ({ selectedYears, setSelectedYears, selectedBranches, setSelectedBranches }) => {
  const academicYearOptions = ["All Years", "2022-2023", "2023-2024", "2024-2025"]
  const branchOptions = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ]

  const removeYear = (yearToRemove) => {
    setSelectedYears(selectedYears.filter((year) => year !== yearToRemove))
  }

  const removeBranch = (branchToRemove) => {
    setSelectedBranches(selectedBranches.filter((branch) => branch !== branchToRemove))
  }

  return (
    <section className={styles.filterSection}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <Filter className={styles.filterIcon} />
          <h3>Dashboard Filters</h3>
        </div>
      </div>

      <div className={styles.filtersContainer}>
        {/* Academic Years Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <Calendar className={styles.labelIcon} />
            <span>Academic Years</span>
          </div>
          <div className={styles.filterContent}>
            <div className={styles.filterChips}>
              {selectedYears.map((year) => (
                <span
                  key={year}
                  className={`${styles.chip} ${styles[`chip${year.replace("-", "").replace(" ", "")}`]}`}
                  onClick={() => removeYear(year)}
                >
                  {year} ×
                </span>
              ))}
            </div>
            <select
              className={styles.filterSelect}
              onChange={(e) => {
                if (e.target.value && !selectedYears.includes(e.target.value)) {
                  setSelectedYears([...selectedYears, e.target.value])
                }
                e.target.value = ""
              }}
              value=""
            >
              <option value="">+ Add academic year</option>
              {academicYearOptions
                .filter((year) => !selectedYears.includes(year))
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Branches Filter */}
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <GraduationCap className={styles.labelIcon} />
            <span>Branches</span>
          </div>
          <div className={styles.filterContent}>
            <div className={styles.filterChips}>
              {selectedBranches.map((branch) => (
                <span
                  key={branch}
                  className={`${styles.chip} ${styles.chipBranch}`}
                  onClick={() => removeBranch(branch)}
                >
                  {branch} ×
                </span>
              ))}
            </div>
            <select
              className={styles.filterSelect}
              onChange={(e) => {
                if (e.target.value && !selectedBranches.includes(e.target.value)) {
                  setSelectedBranches([...selectedBranches, e.target.value])
                }
                e.target.value = ""
              }}
              value=""
            >
              <option value="">+ Add branch</option>
              {branchOptions
                .filter((branch) => !selectedBranches.includes(branch))
                .map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FilterSection

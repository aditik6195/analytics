import styles from "./TopCompanies.module.css"

const TopCompanies = ({ companies }) => {
  return (
    <section className={styles.topCompanies}>
      <h3>Top Recruiting Companies</h3>
      <div className={styles.tableContainer}>
        <table className={styles.companiesTable}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Total Offers</th>
              <th>Average Package (LPA)</th>
              <th>Highest Package (LPA)</th>
              <th>Industry</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td>{company.company}</td>
                <td>{company.offers}</td>
                <td>{company.avgPackage}</td>
                <td>{company.highestPackage}</td>
                <td>{company.industry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TopCompanies

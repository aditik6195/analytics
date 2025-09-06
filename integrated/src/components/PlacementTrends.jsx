import Chart from "react-apexcharts"
import styles from "./PlacementTrends.module.css"

const PlacementTrends = ({ trendsData, branchData }) => {
  return (
    <section className={styles.placementTrends}>
      <h3>Placement Trends</h3>
      <div className={styles.chartsContainer}>
        <div className={styles.chartContainer}>
          <Chart options={trendsData.options} series={trendsData.series} type="line" height={400} />
        </div>
        <div className={styles.chartContainer}>
          <Chart options={branchData.options} series={branchData.series} type="bar" height={400} />
        </div>
      </div>
    </section>
  )
}

export default PlacementTrends

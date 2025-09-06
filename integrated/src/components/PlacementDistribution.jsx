import Chart from "react-apexcharts"
import styles from "./PlacementDistribution.module.css"

const PlacementDistribution = ({ industryData, packageData }) => {
  return (
    <section className={styles.placementDistribution}>
      <h3>Placement Distribution</h3>
      <div className={styles.chartsContainer}>
        <div className={styles.chartContainer}>
          <Chart options={industryData.options} series={industryData.series} type="donut" height={400} />
        </div>
        <div className={styles.chartContainer}>
          <Chart options={packageData.options} series={packageData.series} type="bar" height={400} />
        </div>
      </div>
    </section>
  )
}

export default PlacementDistribution

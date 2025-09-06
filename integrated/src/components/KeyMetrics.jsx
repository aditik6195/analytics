import styles from "./KeyMetrics.module.css"

const KeyMetrics = ({ metrics }) => {
  return (
    <section className={styles.keyMetrics}>
      <h3>Key Metrics</h3>
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValue}>{metric.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default KeyMetrics

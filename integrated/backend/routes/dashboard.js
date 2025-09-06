import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// ==================== DASHBOARD ANALYTICS (USED BY FRONTEND) ====================

// Get branch-wise placement comparison
router.get('/branch-comparison', async (req, res) => {
  try {
    console.log('DEBUG /branch-comparison query:', req.query);
    const { year, branch } = req.query;
    const connection = await db.getConnection();
    // Prepare selected branches and years arrays
    const branchArr = branch ? branch.split(',').map(Number) : [1,2,3,4,5,6];
    const yearArr = year ? year.split(',') : ["2022-2023","2023-2024","2024-2025"];
    // Get all data for selected branches and years
    const sql = `
      SELECT 
        sem.eligibility_param_value as branch_code,
        CASE 
          WHEN sem.eligibility_param_value = 1 THEN 'Computer Science'
          WHEN sem.eligibility_param_value = 2 THEN 'Information Technology'
          WHEN sem.eligibility_param_value = 3 THEN 'Electronics & Communication'
          WHEN sem.eligibility_param_value = 4 THEN 'Mechanical Engineering'
          WHEN sem.eligibility_param_value = 5 THEN 'Civil Engineering'
          WHEN sem.eligibility_param_value = 6 THEN 'Electrical Engineering'
          ELSE CONCAT('Branch ', sem.eligibility_param_value)
        END as branch_name,
        j.academic_year as year,
        COUNT(DISTINCT sm.id) as total_students,
        COUNT(DISTINCT aj.student_id) as students_applied,
        COUNT(DISTINCT CASE WHEN aj.application_status = 'selected' THEN aj.student_id END) as students_placed,
        ROUND(
          LEAST(
            COUNT(DISTINCT CASE WHEN aj.application_status = 'selected' THEN aj.student_id END) * 100.0 / NULLIF(COUNT(DISTINCT sm.id), 0),
            100
          ), 2
        ) as placement_percentage,
        AVG(j.salary) as avg_package,
        MAX(j.salary) as max_package
      FROM student_master sm
      LEFT JOIN student_eligibility_mapping sem ON sm.id = sem.student_id AND sem.eligibility_param_name = 'branch'
      LEFT JOIN applied_jobs aj ON sm.id = aj.student_id
      LEFT JOIN jobs j ON aj.job_id = j.id
      WHERE sem.eligibility_param_value IN (${branchArr.map(() => '?').join(',')})
        AND j.academic_year IN (${yearArr.map(() => '?').join(',')})
      GROUP BY sem.eligibility_param_value, j.academic_year
      ORDER BY year DESC, placement_percentage DESC, total_students DESC
    `;
    const params = [...branchArr, ...yearArr];
    const [branchResult] = await connection.execute(sql, params);
    // Fill missing combinations with zeros
    const branchNameMap = {
      1: 'Computer Science',
      2: 'Information Technology',
      3: 'Electronics & Communication',
      4: 'Mechanical Engineering',
      5: 'Civil Engineering',
      6: 'Electrical Engineering',
    };
    const resultMap = {};
    branchResult.forEach(row => {
      resultMap[`${row.branch_code}_${row.year}`] = row;
    });
    const fullResult = [];
    for (const b of branchArr) {
      for (const y of yearArr) {
        const key = `${b}_${y}`;
        if (resultMap[key]) {
          fullResult.push(resultMap[key]);
        } else {
          fullResult.push({
            branch_code: b,
            branch_name: branchNameMap[b] || `Branch ${b}`,
            year: y,
            total_students: 0,
            students_applied: 0,
            students_placed: 0,
            placement_percentage: 0,
            avg_package: 0,
            max_package: 0
          });
        }
      }
    }
    connection.release();
    res.json(fullResult);
  } catch (error) {
    console.error('Error fetching branch comparison:', error);
    res.status(500).json({ error: 'Failed to fetch branch comparison' });
  }
});

// Get industry-wise placement distribution
router.get('/industry-distribution', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [distributionResult] = await connection.execute(`
      SELECT 
        i.industry_name,
        COUNT(DISTINCT c.id) as company_count,
        COUNT(aj.id) as total_applications,
        COUNT(CASE WHEN aj.application_status = 'selected' THEN 1 END) as selected_count
      FROM industry i
      LEFT JOIN company c ON i.id = c.industry_id
      LEFT JOIN jobs j ON c.id = j.company_id
      LEFT JOIN applied_jobs aj ON j.id = aj.job_id
      GROUP BY i.id, i.industry_name
      HAVING selected_count > 0
      ORDER BY company_count DESC
    `);
    connection.release();
    res.json(distributionResult);
  } catch (error) {
    console.error('Error fetching industry distribution:', error);
    res.status(500).json({ error: 'Failed to fetch industry distribution' });
  }
});

// Get package distribution
router.get('/package-distribution', async (req, res) => {
  try {
    const connection = await db.getConnection();
    // Count number of students placed in each package range
    const [packageResult] = await connection.execute(`
      SELECT 
        salary_range,
        COUNT(DISTINCT student_id) as student_count
      FROM (
        SELECT 
          aj.student_id,
          CASE 
            WHEN j.salary < 500000 THEN '0-5 LPA'
            WHEN j.salary < 1000000 THEN '5-10 LPA'
            WHEN j.salary < 1500000 THEN '10-15 LPA'
            WHEN j.salary < 2000000 THEN '15-20 LPA'
            WHEN j.salary < 2500000 THEN '20-25 LPA'
            ELSE '25+ LPA'
          END as salary_range
        FROM applied_jobs aj
        JOIN jobs j ON aj.job_id = j.id
        WHERE aj.application_status = 'selected'
      ) as student_salary_ranges
      GROUP BY salary_range
      ORDER BY 
        CASE salary_range
          WHEN '0-5 LPA' THEN 1
          WHEN '5-10 LPA' THEN 2
          WHEN '10-15 LPA' THEN 3
          WHEN '15-20 LPA' THEN 4
          WHEN '20-25 LPA' THEN 5
          ELSE 6
        END
    `);
    connection.release();
    res.json(packageResult);
  } catch (error) {
    console.error('Error fetching package distribution:', error);
    res.status(500).json({ error: 'Failed to fetch package distribution' });
  }
});

// ==================== COMPANIES (USED BY FRONTEND) ====================

// Get all companies for dashboard
router.get('/companies', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [companies] = await connection.execute(`
      SELECT 
        c.*,
        i.industry_name
      FROM company c
      LEFT JOIN industry i ON c.industry_id = i.id
      ORDER BY c.company_name
    `);
    connection.release();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get top recruiting companies for dashboard
router.get('/companies/top-recruiting', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [topCompanies] = await connection.execute(`
      SELECT 
        c.company_name,
        COUNT(DISTINCT j.id) as total_jobs,
        AVG(j.salary) as avg_salary,
        MAX(j.salary) as max_salary,
        i.industry_name,
        COUNT(aj.id) as total_applications,
        COUNT(CASE WHEN aj.application_status = 'selected' THEN 1 END) as selected_count
      FROM company c
      LEFT JOIN industry i ON c.industry_id = i.id
      LEFT JOIN jobs j ON c.id = j.company_id
      LEFT JOIN applied_jobs aj ON j.id = aj.job_id
      GROUP BY c.id, c.company_name, i.industry_name
      HAVING total_jobs > 0
      ORDER BY total_jobs DESC, avg_salary DESC
      LIMIT 10
    `);
    connection.release();
    res.json(topCompanies);
  } catch (error) {
    console.error('Error fetching top companies:', error);
    res.status(500).json({ error: 'Failed to fetch top companies' });
  }
});

export default router;

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
  feature: string;
  scenario: string;
  error?: string;
  screenshot?: string;
}

interface AnalyticsSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  avgDuration: number;
  testResults: TestResult[];
}

export class TestAnalytics {
  private static results: TestResult[] = [];

  static recordTest(result: TestResult) {
    this.results.push(result);
  }

  static getSummary(): AnalyticsSummary {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      totalTests,
      passed,
      failed,
      skipped,
      passRate: totalTests > 0 ? (passed / totalTests) * 100 : 0,
      avgDuration: totalTests > 0 ? totalDuration / totalTests : 0,
      testResults: this.results,
    };
  }

  static generateHTMLReport() {
    const summary = this.getSummary();
    const reportPath = path.join(process.cwd(), 'test-results', 'analytics-dashboard.html');
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Analytics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-bottom: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            color: #666;
            font-size: 14px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        
        .stat-card .icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .stat-card .label {
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .stat-card.success { border-top: 4px solid #4caf50; }
        .stat-card.success .value { color: #4caf50; }
        
        .stat-card.error { border-top: 4px solid #f44336; }
        .stat-card.error .value { color: #f44336; }
        
        .stat-card.warning { border-top: 4px solid #ff9800; }
        .stat-card.warning .value { color: #ff9800; }
        
        .stat-card.info { border-top: 4px solid #2196f3; }
        .stat-card.info .value { color: #2196f3; }
        
        .charts-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .chart-container h3 {
            margin-bottom: 20px;
            color: #333;
        }
        
        .results-table {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            overflow-x: auto;
        }
        
        .results-table h3 {
            margin-bottom: 20px;
            color: #333;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }
        
        tr:hover {
            background: #f5f5f5;
        }
        
        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-passed {
            background: #e8f5e9;
            color: #4caf50;
        }
        
        .status-failed {
            background: #ffebee;
            color: #f44336;
        }
        
        .status-skipped {
            background: #fff3e0;
            color: #ff9800;
        }
        
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            transition: width 1s ease;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>Test Analytics Dashboard</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${summary.passRate}%">
                    Pass Rate: ${summary.passRate.toFixed(1)}%
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card info">
                <div class="value">${summary.totalTests}</div>
                <div class="label">Total Tests</div>
            </div>
            
            <div class="stat-card success">
                <div class="value">${summary.passed}</div>
                <div class="label">Passed</div>
            </div>
            
            <div class="stat-card error">
                <div class="value">${summary.failed}</div>
                <div class="label">Failed</div>
            </div>
            
            <div class="stat-card warning">
                <div class="value">${summary.skipped}</div>
                <div class="label">Skipped</div>
            </div>
            
            <div class="stat-card info">
                <div class="value">${(summary.avgDuration / 1000).toFixed(2)}s</div>
                <div class="label">Avg Duration</div>
            </div>
        </div>
        
        <div class="charts-section">
            <div class="chart-container">
                <h3>Test Status Distribution</h3>
                <canvas id="statusChart"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Test Duration (seconds)</h3>
                <canvas id="durationChart"></canvas>
            </div>
        </div>
        
        <div class="results-table">
            <h3>Test Results Details</h3>
            <table>
                <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Feature</th>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${summary.testResults.map(result => `
                        <tr>
                            <td>${result.scenario}</td>
                            <td>${result.feature}</td>
                            <td><span class="status-badge status-${result.status}">${result.status}</span></td>
                            <td>${(result.duration / 1000).toFixed(2)}s</td>
                            <td>${new Date(result.timestamp).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        // Status Chart
        const statusCtx = document.getElementById('statusChart').getContext('2d');
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Skipped'],
                datasets: [{
                    data: [${summary.passed}, ${summary.failed}, ${summary.skipped}],
                    backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Duration Chart
        const durationCtx = document.getElementById('durationChart').getContext('2d');
        new Chart(durationCtx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(summary.testResults.slice(0, 10).map(r => r.scenario.substring(0, 20)))},
                datasets: [{
                    label: 'Duration (s)',
                    data: ${JSON.stringify(summary.testResults.slice(0, 10).map(r => (r.duration / 1000).toFixed(2)))},
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Duration (seconds)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>
    `;

    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportPath, html);
    console.log(`\nAnalytics Dashboard generated: ${reportPath}`);
    console.log(`Test Summary:`);
    console.log(`   Total: ${summary.totalTests}`);
    console.log(`   Passed: ${summary.passed}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Skipped: ${summary.skipped}`);
    console.log(`   Pass Rate: ${summary.passRate.toFixed(1)}%`);
  }

  static clear() {
    this.results = [];
  }
}


// Visualization Module for Workout Tracker
(function() {
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Create visualization elements
        createVisualizationUI();
        // Setup event listeners
        setupEventListeners();
    });

    // Create the visualization UI elements
    function createVisualizationUI() {
        // Create container for the visualization
        const vizContainer = document.createElement('div');
        vizContainer.className = 'card';
        vizContainer.id = 'visualization-card';
        vizContainer.style.display = 'none'; // Initially hidden
        
        // Add heading and toggle buttons
        vizContainer.innerHTML = `
            <h3>Workout History</h3>
            <div class="exercise-toggle" style="display:flex; gap:8px; margin-bottom:12px;">
                <button id="vizPushupToggle" style="flex:1; background:#4caf50; color:white; border:none; border-radius:8px; padding:10px;">Pushups</button>
                <button id="vizPullupToggle" style="flex:1; background:#2196f3; color:white; border:none; border-radius:8px; padding:10px;">Pullups</button>
            </div>
            <div class="time-period" style="display:flex; gap:4px; margin-bottom:12px;">
                <button class="period-btn active" data-period="week" style="flex:1; padding:8px; border:none; border-radius:8px; background:#007AFF; color:white;">Week</button>
                <button class="period-btn" data-period="month" style="flex:1; padding:8px; border:none; border-radius:8px; background:#f0f0f0; color:#666;">Month</button>
                <button class="period-btn" data-period="year" style="flex:1; padding:8px; border:none; border-radius:8px; background:#f0f0f0; color:#666;">Year</button>
                <button class="period-btn" data-period="all" style="flex:1; padding:8px; border:none; border-radius:8px; background:#f0f0f0; color:#666;">All</button>
            </div>
            <div class="chart-container" style="position:relative; height:250px; width:100%;">
                <canvas id="exerciseChart"></canvas>
            </div>
            <div class="stats-summary" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px;">
                <div style="background:#f8f9fa; padding:10px; border-radius:8px;">
                    <h4 style="margin:0; color:#4caf50;">Pushups</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
                        <div>
                            <div style="font-size:12px; color:#666;">Total</div>
                            <div id="viz-total-pushups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Average</div>
                            <div id="viz-avg-pushups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Max</div>
                            <div id="viz-max-pushups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Streak</div>
                            <div id="viz-streak-pushups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                    </div>
                </div>
                <div style="background:#f8f9fa; padding:10px; border-radius:8px;">
                    <h4 style="margin:0; color:#2196f3;">Pullups</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
                        <div>
                            <div style="font-size:12px; color:#666;">Total</div>
                            <div id="viz-total-pullups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Average</div>
                            <div id="viz-avg-pullups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Max</div>
                            <div id="viz-max-pullups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:#666;">Streak</div>
                            <div id="viz-streak-pullups" style="font-size:18px; font-weight:bold;">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add toggle button to main UI
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-visualization';
        toggleButton.textContent = 'Show History Graphs';
        toggleButton.style.display = 'block';
        toggleButton.style.width = '100%';
        toggleButton.style.margin = '16px 0';
        toggleButton.style.padding = '12px';
        toggleButton.style.backgroundColor = '#9c27b0';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '8px';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.fontWeight = 'bold';
        
        // Find the container to add these elements to
        const container = document.querySelector('.container');
        
        // Add the button after the first card
        const firstCard = container.querySelector('.card');
        firstCard.insertAdjacentElement('afterend', toggleButton);
        
        // Add the visualization container after the toggle button
        toggleButton.insertAdjacentElement('afterend', vizContainer);
    }
    
    // Set up event listeners for visualization
    function setupEventListeners() {
        // Toggle visualization display
        document.getElementById('toggle-visualization').addEventListener('click', function() {
            const vizCard = document.getElementById('visualization-card');
            const isVisible = vizCard.style.display !== 'none';
            
            // Toggle visibility
            vizCard.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Show History Graphs' : 'Hide History Graphs';
            
            // Initialize chart if becoming visible
            if (!isVisible) {
                initializeChart();
            }
        });
        
        // Period buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.period-btn').forEach(b => {
                    b.style.background = '#f0f0f0';
                    b.style.color = '#666';
                });
                this.style.background = '#007AFF';
                this.style.color = 'white';
                updateChart(this.dataset.period);
            });
        });
        
        // Exercise toggle buttons
        document.getElementById('vizPushupToggle').addEventListener('click', function() {
            toggleExercise('pushup', this);
        });
        
        document.getElementById('vizPullupToggle').addEventListener('click', function() {
            toggleExercise('pullup', this);
        });
    }
    
    // Chart variables
    let chart;
    let showPushups = true;
    let showPullups = true;
    
    // Initialize the chart
    function initializeChart() {
        // If chart already exists, just update data
        if (chart) {
            updateChart('week');
            return;
        }
        
        // Create new chart
        const ctx = document.getElementById('exerciseChart').getContext('2d');
        
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Pushups',
                        data: [],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        tension: 0.1
                    },
                    {
                        label: 'Pullups',
                        data: [],
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        borderColor: 'rgba(33, 150, 243, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(33, 150, 243, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
        
        // Update with initial data
        updateChart('week');
    }
    
    // Update chart data based on time period
    function updateChart(period = 'week') {
        // Get existing workout logs
        const pushupLogs = JSON.parse(localStorage.getItem('pushupLogs')) || [];
        const pullupLogs = JSON.parse(localStorage.getItem('pullupLogs')) || [];
        
        if (!chart || (pushupLogs.length === 0 && pullupLogs.length === 0)) {
            return;
        }
        
        // Format data for visualization
        const formattedPushups = pushupLogs.map(log => ({
            date: new Date(log.date).toISOString().split('T')[0],
            exercise: 'pushup',
            count: log.count
        }));
        
        const formattedPullups = pullupLogs.map(log => ({
            date: new Date(log.date).toISOString().split('T')[0],
            exercise: 'pullup',
            count: log.count
        }));
        
        const allData = [...formattedPushups, ...formattedPullups];
        
        // Get all unique dates
        const allDates = [...new Set(allData.map(item => item.date))];
        const sortedDates = allDates.sort((a, b) => new Date(a) - new Date(b));
        
        if (sortedDates.length === 0) return;
        
        // Filter data based on selected time period
        let filteredDates = sortedDates;
        const now = new Date();
        
        if (period === 'week') {
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filteredDates = sortedDates.filter(date => new Date(date) >= oneWeekAgo);
        } else if (period === 'month') {
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filteredDates = sortedDates.filter(date => new Date(date) >= oneMonthAgo);
        } else if (period === 'year') {
            const oneYearAgo = new Date(now);
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            filteredDates = sortedDates.filter(date => new Date(date) >= oneYearAgo);
        }
        
        // Create datasets with daily data
        const pushupMap = new Map();
        formattedPushups.forEach(item => {
            pushupMap.set(item.date, item.count);
        });
        
        const pullupMap = new Map();
        formattedPullups.forEach(item => {
            pullupMap.set(item.date, item.count);
        });
        
        // Create datasets with filled dates
        const pushupData = filteredDates.map(date => ({
            x: date,
            y: pushupMap.has(date) ? pushupMap.get(date) : 0
        }));
        
        const pullupData = filteredDates.map(date => ({
            x: date,
            y: pullupMap.has(date) ? pullupMap.get(date) : 0
        }));
        
        // Update chart
        chart.data.labels = filteredDates;
        chart.data.datasets[0].data = pushupData;
        chart.data.datasets[1].data = pullupData;
        chart.data.datasets[0].hidden = !showPushups;
        chart.data.datasets[1].hidden = !showPullups;
        chart.update();
        
        // Update stats
        updateStats(formattedPushups, formattedPullups);
    }
    
    // Toggle exercise visibility
    function toggleExercise(exercise, button) {
        if (exercise === 'pushup') {
            showPushups = !showPushups;
            button.style.opacity = showPushups ? '1' : '0.5';
        } else {
            showPullups = !showPullups;
            button.style.opacity = showPullups ? '1' : '0.5';
        }
        
        if (chart) {
            chart.data.datasets[0].hidden = !showPushups;
            chart.data.datasets[1].hidden = !showPullups;
            chart.update();
        }
    }
    
    // Update stats display
    function updateStats(pushupData, pullupData) {
        // Pushup stats
        const totalPushups = pushupData.reduce((sum, item) => sum + item.count, 0);
        document.getElementById('viz-total-pushups').textContent = totalPushups;
        
        const daysWithPushups = pushupData.filter(item => item.count > 0).length;
        const avgPushups = daysWithPushups ? Math.round(totalPushups / daysWithPushups) : 0;
        document.getElementById('viz-avg-pushups').textContent = avgPushups;
        
        const maxPushups = pushupData.length ? Math.max(...pushupData.map(item => item.count)) : 0;
        document.getElementById('viz-max-pushups').textContent = maxPushups;
        
        const pushupStreak = calculateStreak(pushupData);
        document.getElementById('viz-streak-pushups').textContent = pushupStreak;
        
        // Pullup stats
        const totalPullups = pullupData.reduce((sum, item) => sum + item.count, 0);
        document.getElementById('viz-total-pullups').textContent = totalPullups;
        
        const daysWithPullups = pullupData.filter(item => item.count > 0).length;
        const avgPullups = daysWithPullups ? Math.round(totalPullups / daysWithPullups) : 0;
        document.getElementById('viz-avg-pullups').textContent = avgPullups;
        
        const maxPullups = pullupData.length ? Math.max(...pullupData.map(item => item.count)) : 0;
        document.getElementById('viz-max-pullups').textContent = maxPullups;
        
        const pullupStreak = calculateStreak(pullupData);
        document.getElementById('viz-streak-pullups').textContent = pullupStreak;
    }
    
    // Calculate current streak
    function calculateStreak(data) {
        if (!data.length) return 0;
        
        let currentStreak = 0;
        
        // Sort by date descending to check recent dates first
        const sortedDatesDesc = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = sortedDatesDesc.find(item => item.date === today);
        
        if (todayEntry && todayEntry.count > 0) {
            // If there's an entry for today with activity, start counting streak
            currentStreak = 1;
            
            // Check previous days
            let prevDate = new Date(today);
            while (true) {
                prevDate.setDate(prevDate.getDate() - 1);
                const prevDateStr = prevDate.toISOString().split('T')[0];
                const entry = sortedDatesDesc.find(item => item.date === prevDateStr);
                
                if (entry && entry.count > 0) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        } else {
            // Check if there was activity yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const yesterdayEntry = sortedDatesDesc.find(item => item.date === yesterdayStr);
            
            if (yesterdayEntry && yesterdayEntry.count > 0) {
                currentStreak = 1;
                
                // Check previous days
                let prevDate = new Date(yesterdayStr);
                while (true) {
                    prevDate.setDate(prevDate.getDate() - 1);
                    const prevDateStr = prevDate.toISOString().split('T')[0];
                    const entry = sortedDatesDesc.find(item => item.date === prevDateStr);
                    
                    if (entry && entry.count > 0) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
            }
        }
        
        return currentStreak;
    }
})();

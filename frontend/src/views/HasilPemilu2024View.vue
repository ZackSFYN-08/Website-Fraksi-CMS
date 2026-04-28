<template>
  <div class="hasil-pemilu-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Terima kasih telah memilih PKS 🙌</h1>
        <p>untuk semua Masyarakat Kota Bandung atas Kepercayaan yang diberikan kepada PKS Kota Bandung</p>
        
        <!-- Alhamdulillah & Summary Highlight -->
        <div class="alhamdulillah-highlight float-animation compact-highlight">
          <div class="font-amiri ar-text">الحمد لله</div>
          <div class="main-stats-grid">
            <div class="pks-stat">
              <div class="vote-count">{{ voteCountDisplay }}</div>
              <div class="vote-label">Suara PKS</div>
            </div>
            <div class="pks-stat">
              <div class="vote-count">{{ seatCountDisplay }}</div>
              <div class="vote-label">Kursi PKS</div>
            </div>
          </div>
          
          <div class="city-summary-line">
            <div class="cs-item text-sm">
              <i class="fas fa-vote-yea"></i> Total Suara: <strong>1.228.259</strong>
            </div>
            <div class="cs-item text-sm">
              <i class="fas fa-chair"></i> Total Kursi: <strong>50</strong>
            </div>
          </div>

          <div class="win-badge">
            <i class="fas fa-trophy"></i> 3 dari 7 Dapil
          </div>
        </div>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Visualizations Section -->
    <section class="container charts-section">
      <div class="charts-grid">
        <!-- Votes Chart -->
        <div class="chart-card glass-card compact-card" data-reveal="fade-up">
          <h3 class="chart-header">
            <i class="fas fa-chart-bar"></i> Perolehan Suara per Partai
          </h3>
          <div class="chart-wrapper">
            <canvas id="votesChart"></canvas>
          </div>
        </div>

        <!-- Seats Chart -->
        <div class="chart-card glass-card compact-card" data-reveal="fade-up" data-reveal-delay="200">
          <h3 class="chart-header">
            <i class="fas fa-chair"></i> Perolehan Kursi per Partai
          </h3>
          <div class="chart-wrapper">
            <canvas id="seatsChart"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- Proporsi & Tabel Lanjutan -->
    <section class="container details-section">
      <div class="details-grid">
        <!-- Donut Proporsi -->
        <div class="donut-card glass-card compact-card float-independent" data-reveal="fade-right">
          <h3 class="chart-header">
            <i class="fas fa-chart-pie"></i> Proporsi Kursi PKS
          </h3>
          <div class="donut-wrapper">
            <canvas id="donutChart"></canvas>
            <div class="donut-center">
              <span class="d-val">11/50</span>
              <span class="d-sub">Kursi PKS</span>
            </div>
          </div>
          <p class="donut-footer">Total 50 Kursi DPRD</p>
        </div>

        <!-- Tabel Rekapitulasi -->
        <div class="table-card glass-card compact-card" data-reveal="fade-left">
          <h3 class="chart-header">
            <i class="fas fa-list-ol"></i> Rekapitulasi Lengkap
          </h3>
          <div class="table-responsive">
            <table class="rekap-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Partai</th>
                  <th>Suara</th>
                  <th>Kursi</th>
                  <th>% Suara</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in electionData" :key="p.name" 
                  :class="{ 'is-pks': p.name === 'PKS' }"
                  data-reveal="fade-up" 
                  :data-reveal-delay="300 + (i * 50)"
                >
                  <td class="t-no">{{ i + 1 }}</td>
                  <td class="t-name">{{ p.name }}</td>
                  <td class="t-votes">{{ p.votes.toLocaleString('id-ID') }}</td>
                  <td class="t-seats">{{ p.seats }}</td>
                  <td class="t-perc">{{ ((p.votes / totalVotes) * 100).toFixed(2) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="results-footer container">
      <div class="footer-badge">
        <i class="fas fa-check-circle"></i> Berdasarkan hasil rekapitulasi penghitungan suara di Rapat Pleno KPU Kota Bandung
      </div>
      <p class="copyright">&copy; 2024 Fraksi PKS DPRD Kota Bandung</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { staggerReveal } from '../utils/animations'
import anime from 'animejs'

useScrollReveal()

const voteCountDisplay = ref(0)
const seatCountDisplay = ref(0)

const totalVotes = 1228259
const electionData = [
  { name: 'PKS', votes: 366760, seats: 11 },
  { name: 'Gerindra', votes: 197241, seats: 7 },
  { name: 'Golkar', votes: 175600, seats: 7 },
  { name: 'PDI Perjuangan', votes: 160656, seats: 7 },
  { name: 'NasDem', votes: 128681, seats: 6 },
  { name: 'PKB', votes: 84919, seats: 5 },
  { name: 'PSI', votes: 58590, seats: 4 },
  { name: 'Demokrat', votes: 55812, seats: 3 }
]

let charts = []

onMounted(() => {
  // Counting Animation for Main Stats
  anime({
    targets: { val: 0 },
    val: 366760,
    duration: 2000,
    easing: 'easeOutExpo',
    update: (anim) => {
      voteCountDisplay.value = Math.round(anim.animations[0].currentValue).toLocaleString('id-ID')
    }
  })

  anime({
    targets: { val: 0 },
    val: 11,
    duration: 1500,
    delay: 500,
    easing: 'easeOutExpo',
    update: (anim) => {
      seatCountDisplay.value = Math.round(anim.animations[0].currentValue)
    }
  })

  // Stagger reveal for table rows
  nextTick(() => {
    const rows = document.querySelectorAll('.rekap-table tbody tr')
    staggerReveal(rows, 800)
  })

  // Load Chart.js CDN
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
  script.onload = () => initCharts()
  document.head.appendChild(script)
})

onUnmounted(() => {
  charts.forEach(c => c.destroy())
})

const initCharts = () => {
  const commonOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#002244',
        titleFont: { family: 'Montserrat', size: 14, weight: 'bold' },
        bodyFont: { family: 'Montserrat', size: 13 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: { display: false },
      y: { 
        ticks: { color: '#64748B', font: { family: 'Montserrat', weight: '700', size: 12 } },
        grid: { display: false }
      }
    }
  }

  // Votes
  charts.push(new Chart(document.getElementById('votesChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: electionData.map(d => d.name),
      datasets: [{
        data: electionData.map(d => d.votes),
        backgroundColor: electionData.map(d => d.name === 'PKS' ? '#F07A1E' : '#334155'),
        borderRadius: 8,
        barThickness: 28
      }]
    },
    options: {
      ...commonOptions,
      animation: { duration: 2000, easing: 'easeOutQuart' }
    }
  }))

  // Seats
  setTimeout(() => {
    charts.push(new Chart(document.getElementById('seatsChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: electionData.map(d => d.name),
        datasets: [{
          data: electionData.map(d => d.seats),
          backgroundColor: electionData.map(d => d.name === 'PKS' ? '#FFB347' : '#1E293B'),
          borderRadius: 8,
          barThickness: 28
        }]
      },
      options: {
        ...commonOptions,
        animation: { duration: 1800, easing: 'easeOutQuart' }
      }
    }))
  }, 1000)

  // Donut
  charts.push(new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ['PKS', 'Lainnya'],
      datasets: [{
        data: [11, 39],
        backgroundColor: ['#F07A1E', '#E2E8F0'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '72%',
      plugins: { legend: { display: false } },
      animation: { duration: 2000, animateRotate: true, easing: 'easeOutQuart' }
    }
  }))
}
</script>

<style scoped>
.hasil-pemilu-view {
  background-color: var(--pks-bg);
  min-height: 100vh;
  padding-bottom: 40px;
}

/* Header Alhamdulillah & Stats */
.alhamdulillah-highlight {
  margin-top: 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 30px 40px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
  min-width: 420px;
  max-width: 550px;
  position: relative;
  z-index: 5;
}

.ar-text {
  font-size: 2.8rem;
  color: var(--pks-orange);
  margin-bottom: 15px;
  font-family: 'Amiri', serif;
}

.main-stats-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.vote-count {
  font-size: 2.8rem;
  font-weight: 900;
  color: white;
  line-height: 1;
  margin-bottom: 4px;
}

.vote-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
}

.city-summary-line {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 20px;
}

.cs-item {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.cs-item i { color: var(--pks-orange); margin-right: 6px; }
.cs-item strong { color: white; font-weight: 800; }

.win-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--pks-orange);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-weight: 800;
  font-size: 0.7rem;
  text-transform: uppercase;
  box-shadow: 0 10px 25px rgba(240, 122, 30, 0.4);
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

.summary-box {
  padding: 40px 30px;
  text-align: center;
  background: white;
}

.s-icon { font-size: 2.5rem; margin-bottom: 15px; }
.s-value {
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--pks-navy);
  margin-bottom: 5px;
}
.s-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pks-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.winner-box {
  border-color: var(--pks-orange);
  background: linear-gradient(to bottom right, #ffffff, #fff5eb);
}
.winner-box .s-value { color: var(--pks-orange); }

/* Charts Area */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.chart-card {
  padding: 25px;
  background: white;
}

.compact-card {
  padding: 25px !important;
}

.chart-header {
  font-size: 0.95rem;
  color: var(--pks-navy);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.chart-header i { color: var(--pks-orange); opacity: 0.5; }

.chart-wrapper {
  height: 400px;
  position: relative;
}

/* Details Section */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-top: 30px;
}

.donut-card {
  padding: 30px;
  text-align: center;
  background: white;
}

.donut-wrapper {
  width: 240px;
  height: 240px;
  margin: 0 auto 30px;
  position: relative;
}

.donut-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.d-val { font-size: 2rem; font-weight: 900; color: var(--pks-navy); }
.d-sub { font-size: 0.7rem; font-weight: 700; color: var(--pks-text-muted); text-transform: uppercase; }

.donut-footer { color: var(--pks-text-muted); font-size: 0.85rem; font-weight: 500; }

.table-card {
  padding: 40px;
  background: white;
}

/* Table Styling */
.table-responsive { overflow-x: auto; }
.rekap-table {
  width: 100%;
  border-collapse: collapse;
}

.rekap-table th {
  text-align: left;
  padding: 10px 15px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--pks-text-muted);
  border-bottom: 2px solid var(--pks-gray);
}

.rekap-table td {
  padding: 10px 15px;
  border-bottom: 1px solid var(--pks-gray);
  font-size: 0.88rem;
}

.t-no { font-weight: 700; color: var(--pks-text-muted); width: 40px; }
.t-name { font-weight: 800; color: var(--pks-navy); }
.t-votes, .t-seats { font-weight: 900; color: var(--pks-navy); }
.t-perc { color: var(--pks-text-muted); font-size: 0.8rem; }

.is-pks {
  background: var(--pks-orange-light);
}
.is-pks td { border-bottom-color: rgba(240, 122, 30, 0.1); }
.is-pks .t-name, .is-pks .t-votes, .is-pks .t-seats { color: var(--pks-orange); }

/* Footer Area */
.results-footer {
  text-align: center;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.footer-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--pks-navy-light);
  color: var(--pks-navy);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.85rem;
}

.copyright { color: var(--pks-text-muted); font-size: 0.85rem; }

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .charts-grid { grid-template-columns: 1fr; }
  .details-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .summary-grid { grid-template-columns: 1fr; }
  .vote-count { font-size: 3rem; }
  .ar-text { font-size: 2.8rem; }
  .chart-card, .donut-card, .table-card { padding: 30px 20px; }
}

/* Extra Floating Animations */
.float-animation { animation: float-y 6s ease-in-out infinite; }
@keyframes float-y { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.float-independent { animation: float-y-2 5s ease-in-out infinite; }
@keyframes float-y-2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
</style>

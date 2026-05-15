"use client"

import { useState, useRef } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

// --- Types ---
interface TaskItem {
  id: string
  category: 'facility' | 'programs' | 'registration'
  categoryLabel: string
  timestamp: string
  title: string
  description: string
  variant?: 'default' | 'warning' | 'info'
  onClick?: () => void
}

interface DashboardHomeProps {
  // Persona
  personaId: 'alex' | 'maria'
  // Alerts as tasks
  tasks?: TaskItem[]
  // Week calendar
  simulatedToday?: Date
  onNavigateToCalendar?: () => void
}

// --- Data ---
const ALEX_WEEKLY_DATA = [
  { day: 'Mon', programs: 1800, tickets: 400, sponsorships: 180, streaming: 120 },
  { day: 'Tue', programs: 1750, tickets: 380, sponsorships: 200, streaming: 100 },
  { day: 'Wed', programs: 1900, tickets: 420, sponsorships: 190, streaming: 140 },
  { day: 'Thu', programs: 1650, tickets: 350, sponsorships: 210, streaming: 110 },
  { day: 'Fri', programs: 1700, tickets: 390, sponsorships: 185, streaming: 130 },
  { day: 'Sat', programs: 1950, tickets: 450, sponsorships: 220, streaming: 160 },
  { day: 'Sun', programs: 1850, tickets: 410, sponsorships: 195, streaming: 140 },
]

const MARIA_WEEKLY_DATA = [
  { day: 'Mon', programs: 950, tickets: 180, sponsorships: 90, streaming: 60 },
  { day: 'Tue', programs: 900, tickets: 160, sponsorships: 100, streaming: 50 },
  { day: 'Wed', programs: 1050, tickets: 200, sponsorships: 95, streaming: 70 },
  { day: 'Thu', programs: 880, tickets: 150, sponsorships: 105, streaming: 55 },
  { day: 'Fri', programs: 920, tickets: 175, sponsorships: 92, streaming: 65 },
  { day: 'Sat', programs: 1100, tickets: 220, sponsorships: 110, streaming: 80 },
  { day: 'Sun', programs: 980, tickets: 190, sponsorships: 98, streaming: 70 },
]

const CHART_CONFIG: ChartConfig = {
  programs: { label: 'Programs', color: '#1e40af' },
  tickets: { label: 'Tickets', color: '#16a34a' },
  sponsorships: { label: 'Sponsorships', color: '#ea580c' },
  streaming: { label: 'Streaming', color: '#7c3aed' },
}

const ALEX_METRICS = {
  thisWeek: 11622,
  vsLastWeek: 15.2,
  nextPayout: 6234.10,
  payoutDate: 'May 14',
  programs: { amount: 7190, change: 22.1 },
  tickets: { amount: 2190, change: 14.8 },
  sponsorships: { amount: 1330, change: 9.6 },
  streaming: { amount: 820, change: 3.5 },
  videoUploaded: { value: '124h', change: '9hr' },
  videoWatched: { value: '287h', change: '9hr' },
}

const MARIA_METRICS = {
  thisWeek: 5780,
  vsLastWeek: 8.4,
  nextPayout: 3420.50,
  payoutDate: 'May 14',
  programs: { amount: 3950, change: 12.3 },
  tickets: { amount: 975, change: 8.2 },
  sponsorships: { amount: 590, change: 5.1 },
  streaming: { amount: 265, change: 2.8 },
  videoUploaded: { value: '48h', change: '3hr' },
  videoWatched: { value: '156h', change: '6hr' },
}

// Mini sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 48
  const height = 20
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="sparkline">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

// Task card component
function TaskCard({ task }: { task: TaskItem }) {
  const categoryColors: Record<string, string> = {
    facility: '#607081',
    programs: '#ea580c',
    registration: '#16a34a',
  }
  const categoryIcons: Record<string, JSX.Element> = {
    facility: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 14V6l6-4 6 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14v-4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    programs: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    registration: <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  }

  return (
    <button className="dashboard-task-card" onClick={task.onClick}>
      <div className="dashboard-task-header">
        <div className="dashboard-task-category" style={{ color: categoryColors[task.category] || '#607081' }}>
          {categoryIcons[task.category]}
          <span>{task.categoryLabel}</span>
        </div>
        <span className="dashboard-task-time">{task.timestamp}</span>
      </div>
      <div className="dashboard-task-title">{task.title}</div>
      <div className="dashboard-task-desc">{task.description}</div>
    </button>
  )
}

// Week strip component
function WeekStrip({ simulatedToday, onDayClick }: { simulatedToday: Date; onDayClick?: () => void }) {
  const startOfWeek = new Date(simulatedToday)
  startOfWeek.setDate(simulatedToday.getDate() - simulatedToday.getDay() + 1) // Monday

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    weekDates.push(d)
  }

  const monthName = startOfWeek.toLocaleDateString('en-US', { month: 'long' })
  const startDay = startOfWeek.getDate()

  return (
    <div className="dashboard-week-section">
      <h3 className="dashboard-section-title">Week of {monthName} {startDay}</h3>
      <div className="dashboard-week-strip">
        {weekDates.map((date, i) => {
          const isToday = date.toDateString() === simulatedToday.toDateString()
          return (
            <button
              key={i}
              className={`dashboard-week-day ${isToday ? 'dashboard-week-day--today' : ''}`}
              onClick={onDayClick}
            >
              <span className="dashboard-week-day-name">{days[i]}</span>
              <span className="dashboard-week-day-num">{date.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardHome({
  personaId,
  tasks = [],
  simulatedToday = new Date(),
  onNavigateToCalendar,
}: DashboardHomeProps) {
  const metrics = personaId === 'alex' ? ALEX_METRICS : MARIA_METRICS
  const weeklyData = personaId === 'alex' ? ALEX_WEEKLY_DATA : MARIA_WEEKLY_DATA
  const [taskPage, setTaskPage] = useState(0)
  const tasksPerPage = 3
  const totalPages = Math.ceil(tasks.length / tasksPerPage)
  const visibleTasks = tasks.slice(taskPage * tasksPerPage, (taskPage + 1) * tasksPerPage)
  const taskScrollRef = useRef<HTMLDivElement>(null)

  // Sparkline data extraction
  const programsSparkline = weeklyData.map(d => d.programs)
  const ticketsSparkline = weeklyData.map(d => d.tickets)
  const sponsorshipsSparkline = weeklyData.map(d => d.sponsorships)
  const streamingSparkline = weeklyData.map(d => d.streaming)

  return (
    <div className="dashboard-home">
      {/* Overview Section */}
      <section className="dashboard-overview">
        <h2 className="dashboard-section-title">Overview</h2>
        <div className="dashboard-overview-grid">
          {/* Left: This Week + Chart */}
          <div className="dashboard-overview-main">
            <div className="dashboard-this-week">
              <span className="dashboard-this-week-label">This Week</span>
              <span className="dashboard-this-week-amount">${metrics.thisWeek.toLocaleString()}</span>
              <span className="dashboard-this-week-change">+{metrics.vsLastWeek}% vs prior week</span>
            </div>
            <div className="dashboard-chart">
              <ChartContainer config={CHART_CONFIG} className="dashboard-chart-container">
                <LineChart data={weeklyData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#607081' }} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="programs" stroke="var(--color-programs)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-programs)' }} />
                  <Line type="monotone" dataKey="tickets" stroke="var(--color-tickets)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-tickets)' }} />
                  <Line type="monotone" dataKey="sponsorships" stroke="var(--color-sponsorships)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-sponsorships)' }} />
                  <Line type="monotone" dataKey="streaming" stroke="var(--color-streaming)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-streaming)' }} />
                </LineChart>
              </ChartContainer>
            </div>
          </div>

          {/* Right: Next Payout + Breakdown */}
          <div className="dashboard-overview-side">
            <div className="dashboard-payout">
              <div className="dashboard-payout-header">
                <span className="dashboard-payout-label">Next Payout</span>
                <span className="dashboard-payout-badge">Automatic Transfer</span>
              </div>
              <span className="dashboard-payout-amount">${metrics.nextPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="dashboard-payout-date">Scheduled for {metrics.payoutDate}</span>
            </div>
            <div className="dashboard-breakdown">
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Programs</span>
                <div className="dashboard-metric-row">
                  <span className="dashboard-metric-amount">${metrics.programs.amount.toLocaleString()}</span>
                  <Sparkline data={programsSparkline} color="#1e40af" />
                </div>
                <span className="dashboard-metric-change">{metrics.programs.change}% vs prior</span>
              </div>
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Tickets</span>
                <div className="dashboard-metric-row">
                  <span className="dashboard-metric-amount">${metrics.tickets.amount.toLocaleString()}</span>
                  <Sparkline data={ticketsSparkline} color="#16a34a" />
                </div>
                <span className="dashboard-metric-change">{metrics.tickets.change}% vs prior</span>
              </div>
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Sponsorships</span>
                <div className="dashboard-metric-row">
                  <span className="dashboard-metric-amount">${metrics.sponsorships.amount.toLocaleString()}</span>
                  <Sparkline data={sponsorshipsSparkline} color="#ea580c" />
                </div>
                <span className="dashboard-metric-change">{metrics.sponsorships.change}% vs prior</span>
              </div>
              <div className="dashboard-metric-card">
                <span className="dashboard-metric-label">Streaming</span>
                <div className="dashboard-metric-row">
                  <span className="dashboard-metric-amount">${metrics.streaming.amount.toLocaleString()}</span>
                  <Sparkline data={streamingSparkline} color="#7c3aed" />
                </div>
                <span className="dashboard-metric-change">{metrics.streaming.change}% vs prior</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks + Activity Row */}
      <div className="dashboard-tasks-activity-row">
        {/* Tasks Section */}
        <section className="dashboard-tasks-section">
          <div className="dashboard-tasks-header">
            <h3 className="dashboard-section-title">Tasks</h3>
            {tasks.length > 0 && (
              <div className="dashboard-tasks-pagination">
                <span className="dashboard-tasks-page">{taskPage + 1} of {totalPages || 1}</span>
                <button
                  className="dashboard-tasks-nav"
                  onClick={() => setTaskPage(p => Math.max(0, p - 1))}
                  disabled={taskPage === 0}
                  aria-label="Previous tasks"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="dashboard-tasks-nav"
                  onClick={() => setTaskPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={taskPage >= totalPages - 1}
                  aria-label="Next tasks"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}
          </div>
          <div className="dashboard-tasks-list" ref={taskScrollRef}>
            {visibleTasks.length > 0 ? (
              visibleTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <div className="dashboard-tasks-empty">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>No tasks right now</span>
              </div>
            )}
          </div>
        </section>

        {/* Activity Section */}
        <section className="dashboard-activity-section">
          <h3 className="dashboard-section-title">Activity</h3>
          <div className="dashboard-activity-grid">
            <div className="dashboard-activity-card">
              <span className="dashboard-activity-label">Video Uploaded</span>
              <div className="dashboard-activity-row">
                <span className="dashboard-activity-value">{metrics.videoUploaded.value}</span>
                <Sparkline data={[80, 95, 88, 110, 105, 120, 124]} color="#16a34a" />
              </div>
              <span className="dashboard-activity-change">{metrics.videoUploaded.change} vs prior</span>
            </div>
            <div className="dashboard-activity-card">
              <span className="dashboard-activity-label">Video Watched</span>
              <div className="dashboard-activity-row">
                <span className="dashboard-activity-value">{metrics.videoWatched.value}</span>
                <Sparkline data={[200, 220, 240, 255, 270, 280, 287]} color="#16a34a" />
              </div>
              <span className="dashboard-activity-change">{metrics.videoWatched.change} vs prior</span>
            </div>
          </div>
        </section>
      </div>

      {/* Week Strip */}
      <WeekStrip simulatedToday={simulatedToday} onDayClick={onNavigateToCalendar} />
    </div>
  )
}

export type { TaskItem }

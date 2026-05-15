"use client"

import { useState } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import type { CalendarEvent } from './CalendarView'

// --- Types ---
export interface TaskItem {
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
  personaId: 'alex' | 'maria'
  tasks?: TaskItem[]
  simulatedToday?: Date
  onNavigateToCalendar?: () => void
  events?: CalendarEvent[]
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

// Sparkline SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 56
  const height = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

// Category indicator - hatched circle or warning triangle
function CategoryIndicator({ category, variant }: { category: string; variant?: string }) {
  if (variant === 'warning') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14 13H2L8 2Z" fill="#dc2626" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 6v3M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  
  // Hatched/striped circle pattern
  const colors: Record<string, string> = {
    facility: '#607081',
    programs: '#16a34a',
    registration: '#1e40af',
  }
  const color = colors[category] || '#607081'
  
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <defs>
        <pattern id={`hatch-${category}`} patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke={color} strokeWidth="1.5" />
        </pattern>
        <clipPath id={`circle-${category}`}>
          <circle cx="8" cy="8" r="6" />
        </clipPath>
      </defs>
      <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="0" y="0" width="16" height="16" fill={`url(#hatch-${category})`} clipPath={`url(#circle-${category})`} />
    </svg>
  )
}

// Task card
function TaskCard({ task }: { task: TaskItem }) {
  return (
    <button className="db-task-card" onClick={task.onClick}>
      <div className="db-task-header">
        <div className="db-task-category">
          <CategoryIndicator category={task.category} variant={task.variant} />
          <span>{task.categoryLabel}</span>
        </div>
        <span className="db-task-time">{task.timestamp}</span>
      </div>
      <div className="db-task-title">{task.title}</div>
      <div className="db-task-desc">{task.description}</div>
    </button>
  )
}

// Week calendar strip
function WeekStrip({ simulatedToday, onDayClick, events = [] }: { simulatedToday: Date; onDayClick?: () => void; events?: CalendarEvent[] }) {
  const startOfWeek = new Date(simulatedToday)
  startOfWeek.setDate(simulatedToday.getDate() - simulatedToday.getDay() + 1)

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekDates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    weekDates.push(d)
  }

  const monthName = startOfWeek.toLocaleDateString('en-US', { month: 'long' })
  const startDay = startOfWeek.getDate()

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate.toDateString() === date.toDateString()
    }).slice(0, 3) // Max 3 events displayed per day
  }

  return (
    <section className="db-week-section">
      <h3 className="db-section-title">Week of {monthName} {startDay}</h3>
      <div className="db-week-grid">
        {weekDates.map((date, i) => {
          const isToday = date.toDateString() === simulatedToday.toDateString()
          const dayEvents = getEventsForDate(date)
          return (
            <button
              key={i}
              className={`db-week-day${isToday ? ' db-week-day--today' : ''}`}
              onClick={onDayClick}
            >
              <span className="db-week-day-name">{days[i]}</span>
              <span className="db-week-day-num">{date.getDate()}</span>
              {dayEvents.length > 0 && (
                <div className="db-week-events">
                  {dayEvents.map((event, idx) => (
                    <div 
                      key={event.id || idx} 
                      className="db-week-event"
                      style={{ backgroundColor: event.color || '#607081' }}
                      title={`${event.title} - ${event.time}`}
                    >
                      <span className="db-week-event-title">{event.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default function DashboardHome({
  personaId,
  tasks = [],
  simulatedToday = new Date(),
  onNavigateToCalendar,
  events = [],
}: DashboardHomeProps) {
  const metrics = personaId === 'alex' ? ALEX_METRICS : MARIA_METRICS
  const weeklyData = personaId === 'alex' ? ALEX_WEEKLY_DATA : MARIA_WEEKLY_DATA
  const [taskPage, setTaskPage] = useState(0)
  const tasksPerPage = 3
  const totalPages = Math.max(1, Math.ceil(tasks.length / tasksPerPage))
  const visibleTasks = tasks.slice(taskPage * tasksPerPage, (taskPage + 1) * tasksPerPage)

  // Sparkline data
  const programsSparkline = weeklyData.map(d => d.programs)
  const ticketsSparkline = weeklyData.map(d => d.tickets)
  const sponsorshipsSparkline = weeklyData.map(d => d.sponsorships)
  const streamingSparkline = weeklyData.map(d => d.streaming)

  return (
    <div className="db-home">
      {/* Overview */}
      <section className="db-overview">
        <h2 className="db-section-title">Overview</h2>
        <div className="db-overview-layout">
          {/* Chart area */}
          <div className="db-chart-area">
            <div className="db-this-week">
              <span className="db-this-week-label">This Week</span>
              <span className="db-this-week-amount">${metrics.thisWeek.toLocaleString()}</span>
              <span className="db-this-week-change">+{metrics.vsLastWeek}% vs prior week</span>
            </div>
            <div className="db-chart">
              <ChartContainer config={CHART_CONFIG} className="db-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData} margin={{ top: 20, right: 12, bottom: 0, left: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 13, fill: '#607081' }}
                      dy={8}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="programs" stroke="var(--color-programs)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-programs)', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="tickets" stroke="var(--color-tickets)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-tickets)', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="sponsorships" stroke="var(--color-sponsorships)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-sponsorships)', strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="streaming" stroke="var(--color-streaming)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-streaming)', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Sidebar: Payout + Metrics */}
          <div className="db-sidebar">
            <div className="db-payout">
              <div className="db-payout-header">
                <span className="db-payout-label">Next Payout</span>
                <span className="db-payout-badge">Automatic Transfer</span>
              </div>
              <span className="db-payout-amount">${metrics.nextPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="db-payout-date">Scheduled for {metrics.payoutDate}</span>
            </div>
            <div className="db-metrics-grid">
              <div className="db-metric">
                <span className="db-metric-label">Tickets</span>
                <div className="db-metric-row">
                  <span className="db-metric-amount">${metrics.tickets.amount.toLocaleString()}</span>
                  <span className="db-metric-sparkline">
                    <Sparkline data={ticketsSparkline} color="#16a34a" />
                  </span>
                </div>
                <span className="db-metric-change">{metrics.tickets.change}% vs prior</span>
              </div>
              <div className="db-metric">
                <span className="db-metric-label">Programs</span>
                <div className="db-metric-row">
                  <span className="db-metric-amount">${metrics.programs.amount.toLocaleString()}</span>
                  <span className="db-metric-sparkline">
                    <Sparkline data={programsSparkline} color="#1e40af" />
                  </span>
                </div>
                <span className="db-metric-change">{metrics.programs.change}% vs prior</span>
              </div>
              <div className="db-metric">
                <span className="db-metric-label">Streaming</span>
                <div className="db-metric-row">
                  <span className="db-metric-amount">${metrics.streaming.amount.toLocaleString()}</span>
                  <span className="db-metric-sparkline">
                    <Sparkline data={streamingSparkline} color="#ea580c" />
                  </span>
                </div>
                <span className="db-metric-change">{metrics.streaming.change}% vs prior</span>
              </div>
              <div className="db-metric">
                <span className="db-metric-label">Sponsorships</span>
                <div className="db-metric-row">
                  <span className="db-metric-amount">${metrics.sponsorships.amount.toLocaleString()}</span>
                  <span className="db-metric-sparkline">
                    <Sparkline data={sponsorshipsSparkline} color="#7c3aed" />
                  </span>
                </div>
                <span className="db-metric-change">{metrics.sponsorships.change}% vs prior</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks + Activity */}
      <div className="db-tasks-activity">
        <section className="db-tasks">
          <div className="db-tasks-header">
            <h3 className="db-section-title">Tasks</h3>
            <div className="db-tasks-pagination">
              <span className="db-tasks-page">{Math.min(taskPage + 1, totalPages)} of {totalPages}</span>
              <button
                className="db-tasks-nav"
                onClick={() => setTaskPage(p => Math.max(0, p - 1))}
                disabled={taskPage === 0}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                className="db-tasks-nav"
                onClick={() => setTaskPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={taskPage >= totalPages - 1 || tasks.length === 0}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
          <div className="db-tasks-list">
            {visibleTasks.length > 0 ? (
              visibleTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <div className="db-tasks-empty">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>No tasks right now</span>
              </div>
            )}
          </div>
        </section>

        <section className="db-activity">
          <h3 className="db-section-title">Activity</h3>
          <div className="db-activity-cards">
            <div className="db-activity-card">
              <span className="db-activity-label">Video Uploaded</span>
              <div className="db-activity-row">
                <span className="db-activity-value">{metrics.videoUploaded.value}</span>
                <span className="db-activity-sparkline">
                  <Sparkline data={[80, 95, 88, 110, 105, 120, 124]} color="#607081" />
                </span>
              </div>
              <span className="db-activity-change">{metrics.videoUploaded.change} vs prior</span>
            </div>
            <div className="db-activity-card">
              <span className="db-activity-label">Video Watched</span>
              <div className="db-activity-row">
                <span className="db-activity-value">{metrics.videoWatched.value}</span>
                <span className="db-activity-sparkline">
                  <Sparkline data={[200, 220, 240, 255, 270, 280, 287]} color="#607081" />
                </span>
              </div>
              <span className="db-activity-change">{metrics.videoWatched.change} vs prior</span>
            </div>
          </div>
        </section>
      </div>

      {/* Week Strip */}
      <WeekStrip simulatedToday={simulatedToday} onDayClick={onNavigateToCalendar} events={events} />
    </div>
  )
}

'use client';

import React, { useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import type { PersonaId } from '@/lib/persona-context';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  time: string;
  endTime?: string;
  sport: string;
  type: 'game' | 'practice' | 'meeting' | 'event' | 'tryout';
  location: string;
  color: string;
}

const SPORT_COLORS: Record<string, string> = {
  'Football': '#1b3a2a',
  'Boys Soccer': '#1e40af',
  'Cross Country': '#b45309',
  'Girls Volleyball': '#7c3aed',
  'Girls Tennis': '#0891b2',
  // Maria
  'Flag Football U10': '#1a2744',
  'Flag Football U12': '#334155',
  'Tackle Football U14': '#1e3a5f',
  'Cheer': '#9333ea',
};

function generateAlexEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const year = 2026;
  const month = 4; // May (0-indexed)

  // Football
  events.push(
    { id: 'a1', title: 'Football - Spring Practice', date: new Date(year, month, 4), time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a2', title: 'Football - Spring Practice', date: new Date(year, month, 6), time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a3', title: 'Football - Spring Practice', date: new Date(year, month, 11), time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a4', title: 'Football - Spring Practice', date: new Date(year, month, 13), time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a5', title: 'Football - Spring Scrimmage', date: new Date(year, month, 16), time: '10:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'game', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a6', title: 'Football - Film Review', date: new Date(year, month, 18), time: '3:30 PM', endTime: '4:30 PM', sport: 'Football', type: 'meeting', location: 'Athletics Classroom', color: SPORT_COLORS['Football'] },
    { id: 'a7', title: 'Football - Spring Practice', date: new Date(year, month, 20), time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
    { id: 'a8', title: 'Football - Spring Game', date: new Date(year, month, 22), time: '7:00 PM', endTime: '9:00 PM', sport: 'Football', type: 'game', location: 'Memorial Stadium', color: SPORT_COLORS['Football'] },
  );

  // Boys Soccer
  events.push(
    { id: 'a9', title: 'Boys Soccer - Practice', date: new Date(year, month, 4), time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: SPORT_COLORS['Boys Soccer'] },
    { id: 'a10', title: 'Boys Soccer vs. Eastside', date: new Date(year, month, 5), time: '4:30 PM', endTime: '6:30 PM', sport: 'Boys Soccer', type: 'game', location: 'Soccer Complex', color: SPORT_COLORS['Boys Soccer'] },
    { id: 'a11', title: 'Boys Soccer - Practice', date: new Date(year, month, 7), time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: SPORT_COLORS['Boys Soccer'] },
    { id: 'a12', title: 'Boys Soccer vs. Westview', date: new Date(year, month, 12), time: '4:30 PM', endTime: '6:30 PM', sport: 'Boys Soccer', type: 'game', location: 'Westview HS', color: SPORT_COLORS['Boys Soccer'] },
    { id: 'a13', title: 'Boys Soccer - Practice', date: new Date(year, month, 14), time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: SPORT_COLORS['Boys Soccer'] },
    { id: 'a14', title: 'Boys Soccer vs. Central', date: new Date(year, month, 19), time: '6:00 PM', endTime: '8:00 PM', sport: 'Boys Soccer', type: 'game', location: 'Soccer Complex', color: SPORT_COLORS['Boys Soccer'] },
  );

  // Cross Country
  events.push(
    { id: 'a15', title: 'Cross Country - Morning Run', date: new Date(year, month, 5), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: SPORT_COLORS['Cross Country'] },
    { id: 'a16', title: 'Cross Country - Morning Run', date: new Date(year, month, 7), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: SPORT_COLORS['Cross Country'] },
    { id: 'a17', title: 'Cross Country - Morning Run', date: new Date(year, month, 12), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: SPORT_COLORS['Cross Country'] },
    { id: 'a18', title: 'Cross Country - Invitational', date: new Date(year, month, 9), time: '8:00 AM', endTime: '12:00 PM', sport: 'Cross Country', type: 'game', location: 'Pioneers Park', color: SPORT_COLORS['Cross Country'] },
    { id: 'a19', title: 'Cross Country - Morning Run', date: new Date(year, month, 19), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: SPORT_COLORS['Cross Country'] },
  );

  // Girls Volleyball
  events.push(
    { id: 'a20', title: 'Volleyball - Practice', date: new Date(year, month, 5), time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: SPORT_COLORS['Girls Volleyball'] },
    { id: 'a21', title: 'Volleyball - Practice', date: new Date(year, month, 7), time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: SPORT_COLORS['Girls Volleyball'] },
    { id: 'a22', title: 'Volleyball vs. North Platte', date: new Date(year, month, 8), time: '6:00 PM', endTime: '8:00 PM', sport: 'Girls Volleyball', type: 'game', location: 'Main Gym', color: SPORT_COLORS['Girls Volleyball'] },
    { id: 'a23', title: 'Volleyball - Practice', date: new Date(year, month, 12), time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: SPORT_COLORS['Girls Volleyball'] },
    { id: 'a24', title: 'Volleyball vs. Elkhorn', date: new Date(year, month, 15), time: '6:00 PM', endTime: '8:00 PM', sport: 'Girls Volleyball', type: 'game', location: 'Elkhorn HS', color: SPORT_COLORS['Girls Volleyball'] },
    { id: 'a25', title: 'Volleyball - Tournament', date: new Date(year, month, 23), time: '8:00 AM', endTime: '5:00 PM', sport: 'Girls Volleyball', type: 'game', location: 'Main Gym', color: SPORT_COLORS['Girls Volleyball'] },
  );

  // Girls Tennis
  events.push(
    { id: 'a26', title: 'Tennis - Practice', date: new Date(year, month, 4), time: '3:30 PM', endTime: '5:00 PM', sport: 'Girls Tennis', type: 'practice', location: 'Tennis Courts', color: SPORT_COLORS['Girls Tennis'] },
    { id: 'a27', title: 'Tennis - Dual vs. Prep', date: new Date(year, month, 6), time: '4:00 PM', endTime: '6:00 PM', sport: 'Girls Tennis', type: 'game', location: 'Tennis Courts', color: SPORT_COLORS['Girls Tennis'] },
    { id: 'a28', title: 'Tennis - Practice', date: new Date(year, month, 11), time: '3:30 PM', endTime: '5:00 PM', sport: 'Girls Tennis', type: 'practice', location: 'Tennis Courts', color: SPORT_COLORS['Girls Tennis'] },
    { id: 'a29', title: 'Tennis - Invitational', date: new Date(year, month, 17), time: '9:00 AM', endTime: '3:00 PM', sport: 'Girls Tennis', type: 'game', location: 'Mahoney Park', color: SPORT_COLORS['Girls Tennis'] },
  );

  // AD Meetings
  events.push(
    { id: 'a30', title: 'AD Staff Meeting', date: new Date(year, month, 4), time: '7:30 AM', endTime: '8:15 AM', sport: 'Football', type: 'meeting', location: 'AD Office', color: '#64748b' },
    { id: 'a31', title: 'Booster Club Meeting', date: new Date(year, month, 11), time: '6:00 PM', endTime: '7:00 PM', sport: 'Football', type: 'meeting', location: 'Library', color: '#64748b' },
    { id: 'a32', title: 'NSAA Compliance Call', date: new Date(year, month, 14), time: '10:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'meeting', location: 'AD Office', color: '#64748b' },
    { id: 'a33', title: 'Coaches All-Sport Mtg', date: new Date(year, month, 18), time: '7:00 AM', endTime: '7:45 AM', sport: 'Football', type: 'meeting', location: 'AD Office', color: '#64748b' },
    { id: 'a34', title: 'Fall Sports Parent Night', date: new Date(year, month, 21), time: '6:30 PM', endTime: '8:00 PM', sport: 'Football', type: 'event', location: 'Auditorium', color: '#64748b' },
  );

  return events;
}

function generateMariaEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const year = 2026;
  const month = 4; // May

  events.push(
    { id: 'm1', title: 'U14 Tackle - Practice', date: new Date(year, month, 4), time: '5:30 PM', endTime: '7:00 PM', sport: 'Tackle Football U14', type: 'practice', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm2', title: 'U12 Flag - Practice', date: new Date(year, month, 5), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football U12', type: 'practice', location: 'Pioneer Park Field 1', color: SPORT_COLORS['Flag Football U12'] },
    { id: 'm3', title: 'U10 Flag - Practice', date: new Date(year, month, 5), time: '5:30 PM', endTime: '6:30 PM', sport: 'Flag Football U10', type: 'practice', location: 'Pioneer Park Field 3', color: SPORT_COLORS['Flag Football U10'] },
    { id: 'm4', title: 'U14 Tackle - Practice', date: new Date(year, month, 6), time: '5:30 PM', endTime: '7:00 PM', sport: 'Tackle Football U14', type: 'practice', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm5', title: 'Cheer - Practice', date: new Date(year, month, 6), time: '5:00 PM', endTime: '6:30 PM', sport: 'Cheer', type: 'practice', location: 'Community Center', color: SPORT_COLORS['Cheer'] },
    { id: 'm6', title: 'Board Meeting', date: new Date(year, month, 7), time: '7:00 PM', endTime: '8:30 PM', sport: 'Tackle Football U14', type: 'meeting', location: 'Community Center', color: '#64748b' },
    { id: 'm7', title: 'U14 vs. Omaha Wolves', date: new Date(year, month, 9), time: '10:00 AM', endTime: '12:00 PM', sport: 'Tackle Football U14', type: 'game', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm8', title: 'U12 Flag Jamboree', date: new Date(year, month, 9), time: '1:00 PM', endTime: '4:00 PM', sport: 'Flag Football U12', type: 'game', location: 'Pioneer Park Fields', color: SPORT_COLORS['Flag Football U12'] },
    { id: 'm9', title: 'U14 Tackle - Practice', date: new Date(year, month, 11), time: '5:30 PM', endTime: '7:00 PM', sport: 'Tackle Football U14', type: 'practice', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm10', title: 'U12 Flag - Practice', date: new Date(year, month, 12), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football U12', type: 'practice', location: 'Pioneer Park Field 1', color: SPORT_COLORS['Flag Football U12'] },
    { id: 'm11', title: 'U10 Flag - Practice', date: new Date(year, month, 12), time: '5:30 PM', endTime: '6:30 PM', sport: 'Flag Football U10', type: 'practice', location: 'Pioneer Park Field 3', color: SPORT_COLORS['Flag Football U10'] },
    { id: 'm12', title: 'Cheer - Practice', date: new Date(year, month, 13), time: '5:00 PM', endTime: '6:30 PM', sport: 'Cheer', type: 'practice', location: 'Community Center', color: SPORT_COLORS['Cheer'] },
    { id: 'm13', title: 'U14 Tackle - Practice', date: new Date(year, month, 13), time: '5:30 PM', endTime: '7:00 PM', sport: 'Tackle Football U14', type: 'practice', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm14', title: 'Equipment Check-in', date: new Date(year, month, 14), time: '6:00 PM', endTime: '8:00 PM', sport: 'Tackle Football U14', type: 'event', location: 'Storage Building', color: '#64748b' },
    { id: 'm15', title: 'U14 vs. Bellevue Tigers', date: new Date(year, month, 16), time: '10:00 AM', endTime: '12:00 PM', sport: 'Tackle Football U14', type: 'game', location: 'Bellevue Sports Complex', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm16', title: 'U10 Flag Tournament', date: new Date(year, month, 16), time: '9:00 AM', endTime: '2:00 PM', sport: 'Flag Football U10', type: 'game', location: 'Seymour Smith Park', color: SPORT_COLORS['Flag Football U10'] },
    { id: 'm17', title: 'Fundraiser Committee', date: new Date(year, month, 18), time: '6:30 PM', endTime: '7:30 PM', sport: 'Tackle Football U14', type: 'meeting', location: 'Community Center', color: '#64748b' },
    { id: 'm18', title: 'U14 Tackle - Practice', date: new Date(year, month, 18), time: '5:30 PM', endTime: '7:00 PM', sport: 'Tackle Football U14', type: 'practice', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
    { id: 'm19', title: 'U12 Flag - Practice', date: new Date(year, month, 19), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football U12', type: 'practice', location: 'Pioneer Park Field 1', color: SPORT_COLORS['Flag Football U12'] },
    { id: 'm20', title: 'Cheer - Practice', date: new Date(year, month, 20), time: '5:00 PM', endTime: '6:30 PM', sport: 'Cheer', type: 'practice', location: 'Community Center', color: SPORT_COLORS['Cheer'] },
    { id: 'm21', title: 'Photo Day (All Teams)', date: new Date(year, month, 21), time: '9:00 AM', endTime: '1:00 PM', sport: 'Tackle Football U14', type: 'event', location: 'Pioneer Park', color: '#64748b' },
    { id: 'm22', title: 'U14 vs. Papillion Panthers', date: new Date(year, month, 23), time: '10:00 AM', endTime: '12:00 PM', sport: 'Tackle Football U14', type: 'game', location: 'Pioneer Park Field 2', color: SPORT_COLORS['Tackle Football U14'] },
  );

  return events;
}

const EVENTS_BY_PERSONA: Record<PersonaId, CalendarEvent[]> = {
  alex: generateAlexEvents(),
  maria: generateMariaEvents(),
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type ViewMode = 'month' | 'week' | 'agenda';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function formatEventType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function TypeDot({ color }: { color: string }) {
  return <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />;
}

// ---- MONTH VIEW ----
function MonthView({ year, month, events }: { year: number; month: number; events: CalendarEvent[] }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal-month">
      <div className="cal-month-header">
        {DAYS.map(d => <div key={d} className="cal-month-day-label">{d}</div>)}
      </div>
      <div className="cal-month-grid">
        {cells.map((day, i) => {
          const cellDate = day ? new Date(year, month, day) : null;
          const dayEvents = cellDate ? events.filter(e => isSameDay(e.date, cellDate)) : [];
          const isToday = cellDate && isSameDay(cellDate, today);
          return (
            <div key={i} className={`cal-month-cell ${!day ? 'cal-month-cell--empty' : ''} ${isToday ? 'cal-month-cell--today' : ''}`}>
              {day && (
                <>
                  <span className={`cal-month-cell-day ${isToday ? 'cal-month-cell-day--today' : ''}`}>{day}</span>
                  <div className="cal-month-cell-events">
                    {dayEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} className="cal-month-event" style={{ borderLeftColor: ev.color }}>
                        <span className="cal-month-event-time">{ev.time.replace(':00', '').replace(' ', '')}</span>
                        <span className="cal-month-event-title">{ev.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && <div className="cal-month-more">+{dayEvents.length - 3} more</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- WEEK VIEW ----
function WeekView({ weekStart, events }: { weekStart: Date; events: CalendarEvent[] }) {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  const today = new Date();
  const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6am-8pm

  return (
    <div className="cal-week">
      <div className="cal-week-header">
        <div className="cal-week-time-gutter" />
        {days.map((d, i) => (
          <div key={i} className={`cal-week-day-header ${isSameDay(d, today) ? 'cal-week-day-header--today' : ''}`}>
            <span className="cal-week-day-name">{DAYS[d.getDay()]}</span>
            <span className={`cal-week-day-num ${isSameDay(d, today) ? 'cal-week-day-num--today' : ''}`}>{d.getDate()}</span>
          </div>
        ))}
      </div>
      <div className="cal-week-body">
        {hours.map(hour => (
          <div key={hour} className="cal-week-row">
            <div className="cal-week-time-gutter cal-week-time-label">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            {days.map((d, di) => {
              const dayEvents = events.filter(e => {
                if (!isSameDay(e.date, d)) return false;
                const match = e.time.match(/^(\d+):?(\d*)\s*(AM|PM)$/i);
                if (!match) return false;
                let h = parseInt(match[1]);
                const ampm = match[3].toUpperCase();
                if (ampm === 'PM' && h !== 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                return h === hour;
              });
              return (
                <div key={di} className="cal-week-cell">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="cal-week-event" style={{ backgroundColor: ev.color + '18', borderLeftColor: ev.color }}>
                      <span className="cal-week-event-title">{ev.title}</span>
                      <span className="cal-week-event-time">{ev.time} - {ev.endTime}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- AGENDA VIEW ----
function AgendaView({ year, month, events }: { year: number; month: number; events: CalendarEvent[] }) {
  const monthEvents = events
    .filter(e => e.date.getFullYear() === year && e.date.getMonth() === month)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));

  const grouped: Record<string, CalendarEvent[]> = {};
  monthEvents.forEach(e => {
    const key = e.date.toISOString().split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  const today = new Date();

  return (
    <div className="cal-agenda">
      {Object.entries(grouped).map(([dateKey, dayEvents]) => {
        const date = new Date(dateKey + 'T12:00:00');
        const isToday = isSameDay(date, today);
        return (
          <div key={dateKey} className="cal-agenda-day">
            <div className={`cal-agenda-date ${isToday ? 'cal-agenda-date--today' : ''}`}>
              <span className="cal-agenda-date-weekday">{DAYS[date.getDay()]}</span>
              <span className="cal-agenda-date-full">{MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</span>
            </div>
            <div className="cal-agenda-events">
              {dayEvents.map(ev => (
                <div key={ev.id} className="cal-agenda-event" style={{ borderLeftColor: ev.color }}>
                  <div className="cal-agenda-event-left">
                    <TypeDot color={ev.color} />
                    <div className="cal-agenda-event-info">
                      <span className="cal-agenda-event-title">{ev.title}</span>
                      <span className="cal-agenda-event-meta">{ev.location}</span>
                    </div>
                  </div>
                  <div className="cal-agenda-event-right">
                    <span className="cal-agenda-event-time">{ev.time} - {ev.endTime}</span>
                    <span className="cal-agenda-event-type">{formatEventType(ev.type)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- MAIN CALENDAR ----
export default function CalendarView() {
  const { activePersona } = usePersona();
  const [view, setView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 15)); // May 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const events = EVENTS_BY_PERSONA[activePersona.id];
  const weekStart = getWeekStart(currentDate);

  function prevPeriod() {
    if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  }
  function nextPeriod() {
    if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  }
  function goToday() {
    setCurrentDate(new Date(2026, 4, 15));
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const headerLabel = view === 'week'
    ? `${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekStart.getMonth() !== weekEnd.getMonth() ? MONTHS[weekEnd.getMonth()] + ' ' : ''}${weekEnd.getDate()}, ${year}`
    : `${MONTHS[month]} ${year}`;

  return (
    <div className="cal-container">
      <div className="cal-toolbar">
        <div className="cal-toolbar-left">
          <h1 className="page-header-title">Calendar</h1>
          <div className="cal-nav-group">
            <button className="cal-nav-btn" onClick={prevPeriod} aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="cal-today-btn" onClick={goToday}>Today</button>
            <button className="cal-nav-btn" onClick={nextPeriod} aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <span className="cal-header-label">{headerLabel}</span>
        </div>
        <div className="cal-toolbar-right">
          <div className="cal-view-toggle">
            {(['month', 'week', 'agenda'] as ViewMode[]).map(v => (
              <button key={v} className={`cal-view-btn ${view === v ? 'cal-view-btn--active' : ''}`} onClick={() => setView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="cal-body">
        {view === 'month' && <MonthView year={year} month={month} events={events} />}
        {view === 'week' && <WeekView weekStart={weekStart} events={events} />}
        {view === 'agenda' && <AgendaView year={year} month={month} events={events} />}
      </div>
    </div>
  );
}

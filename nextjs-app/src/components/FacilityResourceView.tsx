'use client';

import React, { useState } from 'react';
import type { CalendarEvent } from './CalendarView';

// Surface definitions with venue grouping
interface Surface {
  id: string;
  name: string;
  venue: string;
  matchLocations: string[]; // event.location values that map to this surface
}

const SURFACES: Surface[] = [
  { id: 'spartan-field', name: 'Spartan Field', venue: 'Memorial Stadium', matchLocations: ['Memorial Stadium'] },
  { id: 'field-1', name: 'Field 1', venue: 'Soccer Complex', matchLocations: ['Soccer Complex'] },
  { id: 'field-2', name: 'Field 2', venue: 'Soccer Complex', matchLocations: [] },
  { id: 'court-1', name: 'Court 1', venue: 'Main Gym', matchLocations: ['Main Gym'] },
  { id: 'court-2', name: 'Court 2', venue: 'Main Gym', matchLocations: [] },
  { id: 'courts-1-4', name: 'Courts 1-4', venue: 'Tennis Courts', matchLocations: ['Tennis Courts'] },
  { id: 'course', name: 'Course', venue: 'Trails / City Park', matchLocations: ['Trails / City Park'] },
  { id: 'floor', name: 'Floor', venue: 'Weight Room', matchLocations: ['Weight Room'] },
  { id: 'stage', name: 'Stage', venue: 'Auditorium', matchLocations: ['Auditorium'] },
];

const HOURS_START = 6;
const HOURS_END = 22;
const HOUR_HEIGHT = 60;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseTime(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 8;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h + min / 60;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface FacilityResourceViewProps {
  events: CalendarEvent[];
  cancelledEventIds: Set<string>;
  simulatedToday?: Date;
}

export default function FacilityResourceView({ events, cancelledEventIds, simulatedToday }: FacilityResourceViewProps) {
  const today = simulatedToday || new Date(2026, 4, 15);
  const [currentDate, setCurrentDate] = useState(today);

  // Reset when simulated today changes (chapter switch)
  React.useEffect(() => {
    setCurrentDate(today);
  }, [today.getTime()]);

  function prevDay() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  }
  function nextDay() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  }
  function goToday() {
    setCurrentDate(today);
  }

  const headerLabel = `${DAYS_OF_WEEK[currentDate.getDay()]}, ${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  // Get events for the current day, map to surfaces
  const dayEvents = events.filter(ev => sameDay(ev.date, currentDate));
  function getEventsForSurface(surface: Surface): CalendarEvent[] {
    return dayEvents.filter(ev => surface.matchLocations.includes(ev.location));
  }

  const totalHeight = (HOURS_END - HOURS_START) * HOUR_HEIGHT;

  return (
    <div className="cal-container">
      {/* Toolbar -- same structure as CalendarView */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="cal-nav-group">
            <button className="cal-nav-btn" onClick={prevDay} aria-label="Previous day">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="cal-today-btn" onClick={goToday}>Today</button>
            <button className="cal-nav-btn" onClick={nextDay} aria-label="Next day">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <span className="cal-header-label">{headerLabel}</span>
        <div className="toolbar-right" />
      </div>

      {/* Day resource grid -- uses cal-body as the scroll container */}
      <div className="cal-body" style={{ overflow: 'auto' }}>
        <div style={{ minWidth: `${SURFACES.length * 140 + 64}px` }}>
          {/* Header row: surface columns */}
          <div className="resource-header">
            <div className="resource-time-gutter resource-header-cell" />
            {SURFACES.map(surface => (
              <div key={surface.id} className="resource-header-cell">
                <span className="resource-surface-name">{surface.name}</span>
                <span className="resource-venue-name">{surface.venue}</span>
              </div>
            ))}
          </div>

          {/* Time grid body */}
          <div className="resource-body" style={{ height: `${totalHeight}px` }}>
            {/* Time gutter */}
            <div className="resource-time-gutter">
              {Array.from({ length: HOURS_END - HOURS_START }, (_, i) => {
                const hour = HOURS_START + i;
                const label = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
                return (
                  <div key={hour} className="resource-time-slot" style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}>
                    <span className="resource-time-label">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* Surface columns */}
            {SURFACES.map(surface => {
              const surfaceEvents = getEventsForSurface(surface);
              return (
                <div key={surface.id} className="resource-column">
                  {Array.from({ length: HOURS_END - HOURS_START }, (_, i) => (
                    <div key={i} className="resource-hour-line" style={{ top: `${i * HOUR_HEIGHT}px` }} />
                  ))}

                  {surfaceEvents.map(ev => {
                    const start = parseTime(ev.time);
                    const end = ev.endTime ? parseTime(ev.endTime) : start + 1;
                    const top = (start - HOURS_START) * HOUR_HEIGHT;
                    const height = Math.max((end - start) * HOUR_HEIGHT, 20);
                    const isCancelled = cancelledEventIds.has(ev.id);

                    return (
                      <div
                        key={ev.id}
                        className={`resource-event ${isCancelled ? 'resource-event--cancelled' : ''}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          borderLeftColor: isCancelled ? '#9ca3af' : ev.color,
                          background: isCancelled ? '#f3f4f6' : ev.color + '18',
                        }}
                      >
                        <span className={`resource-event-title ${isCancelled ? 'resource-event-title--cancelled' : ''}`}>
                          {isCancelled ? 'CANCELED - ' : ''}{ev.title}
                        </span>
                        <span className="resource-event-time">{ev.time} - {ev.endTime || ''}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

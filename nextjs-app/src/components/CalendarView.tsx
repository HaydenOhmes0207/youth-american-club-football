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
  // Alex - HS summer camps/clinics
  'Football': '#1b3a2a',
  'Boys Soccer': '#1e40af',
  'Cross Country': '#b45309',
  'Girls Volleyball': '#7c3aed',
  'Girls Tennis': '#0891b2',
  'Strength & Conditioning': '#dc2626',
  'AD Admin': '#64748b',
  // Maria - club summer camps/clinics
  'Football Camp': '#1a2744',
  'Cheer Camp': '#7c3aed',
  'Flag Football Clinic': '#2d4a6e',
  'Speed & Agility': '#dc2626',
  'Club Admin': '#64748b',
};

function generateAlexEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const year = 2026;
  const month = 4; // May (0-indexed)
  const C = SPORT_COLORS;

  // --- WEEK 1 (Mon 5/4 - Sat 5/9) ---
  events.push(
    { id: 'a1', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 4), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a2', title: 'AD Staff Meeting', date: new Date(year, month, 4), time: '9:00 AM', endTime: '10:00 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] },
    { id: 'a3', title: 'Football Skills Camp (Day 1)', date: new Date(year, month, 5), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a4', title: 'Soccer Summer Clinic', date: new Date(year, month, 5), time: '5:00 PM', endTime: '7:00 PM', sport: 'Boys Soccer', type: 'event', location: 'Soccer Complex', color: C['Boys Soccer'] },
    { id: 'a5', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 6), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a6', title: 'Football Skills Camp (Day 2)', date: new Date(year, month, 6), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a7', title: 'Girls Tennis Clinic', date: new Date(year, month, 6), time: '4:00 PM', endTime: '6:00 PM', sport: 'Girls Tennis', type: 'event', location: 'Tennis Courts', color: C['Girls Tennis'] },
    { id: 'a8', title: 'Football Skills Camp (Day 3)', date: new Date(year, month, 7), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a9', title: 'XC Summer Miles Club', date: new Date(year, month, 7), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] },
    { id: 'a10', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 8), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a11', title: 'Volleyball Open Gym', date: new Date(year, month, 9), time: '9:00 AM', endTime: '11:00 AM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
  );

  // --- WEEK 2 (Mon 5/11 - Sat 5/16) ---
  events.push(
    { id: 'a12', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 11), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a13', title: 'Booster Club Meeting', date: new Date(year, month, 11), time: '6:00 PM', endTime: '7:00 PM', sport: 'AD Admin', type: 'meeting', location: 'Library', color: C['AD Admin'] },
    { id: 'a14', title: 'Soccer Summer Clinic', date: new Date(year, month, 12), time: '5:00 PM', endTime: '7:00 PM', sport: 'Boys Soccer', type: 'event', location: 'Soccer Complex', color: C['Boys Soccer'] },
    { id: 'a15', title: 'XC Summer Miles Club', date: new Date(year, month, 12), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] },
    { id: 'a16', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 13), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a17', title: 'Football 7-on-7 Camp (Day 1)', date: new Date(year, month, 13), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a18', title: 'NSAA Compliance Call', date: new Date(year, month, 14), time: '10:00 AM', endTime: '11:00 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] },
    { id: 'a19', title: 'Football 7-on-7 Camp (Day 2)', date: new Date(year, month, 14), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a20', title: 'XC Summer Miles Club', date: new Date(year, month, 14), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] },
  );
  // Today (5/15)
  events.push(
    { id: 'a21', title: 'Volleyball Summer Camp (Day 1)', date: new Date(year, month, 15), time: '9:00 AM', endTime: '12:00 PM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'a22', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 15), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a23', title: 'Girls Tennis Clinic', date: new Date(year, month, 15), time: '4:00 PM', endTime: '6:00 PM', sport: 'Girls Tennis', type: 'event', location: 'Tennis Courts', color: C['Girls Tennis'] },
  );
  events.push(
    { id: 'a24', title: 'Volleyball Summer Camp (Day 2)', date: new Date(year, month, 16), time: '9:00 AM', endTime: '12:00 PM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'a25', title: 'Soccer Summer Clinic', date: new Date(year, month, 16), time: '10:00 AM', endTime: '12:00 PM', sport: 'Boys Soccer', type: 'event', location: 'Soccer Complex', color: C['Boys Soccer'] },
  );

  // --- WEEK 3 (Mon 5/18 - Sat 5/23) ---
  events.push(
    { id: 'a26', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 18), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a27', title: 'Coaches All-Sport Planning Mtg', date: new Date(year, month, 18), time: '8:30 AM', endTime: '9:30 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] },
    { id: 'a28', title: 'Football Lineman Camp', date: new Date(year, month, 19), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'a29', title: 'Soccer Summer Clinic', date: new Date(year, month, 19), time: '5:00 PM', endTime: '7:00 PM', sport: 'Boys Soccer', type: 'event', location: 'Soccer Complex', color: C['Boys Soccer'] },
    { id: 'a30', title: 'Strength & Conditioning (Open)', date: new Date(year, month, 20), time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] },
    { id: 'a31', title: 'XC Summer Miles Club', date: new Date(year, month, 20), time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] },
    { id: 'a32', title: 'Fall Sports Parent Info Night', date: new Date(year, month, 21), time: '6:30 PM', endTime: '8:00 PM', sport: 'AD Admin', type: 'event', location: 'Auditorium', color: C['AD Admin'] },
    { id: 'a33', title: 'Volleyball Open Gym', date: new Date(year, month, 23), time: '9:00 AM', endTime: '11:00 AM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'a34', title: 'Girls Tennis Clinic', date: new Date(year, month, 23), time: '10:00 AM', endTime: '12:00 PM', sport: 'Girls Tennis', type: 'event', location: 'Tennis Courts', color: C['Girls Tennis'] },
  );

  return events;
}

function generateMariaEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const year = 2026;
  const month = 4; // May
  const C = SPORT_COLORS;

  // --- WEEK 1 (Mon 5/4 - Sat 5/9) ---
  events.push(
    { id: 'm1', title: 'Tackle Football Camp (5th-6th) Day 1', date: new Date(year, month, 4), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm2', title: 'Speed & Agility Clinic (All Ages)', date: new Date(year, month, 4), time: '5:30 PM', endTime: '7:00 PM', sport: 'Speed & Agility', type: 'event', location: 'Pioneer Park Field 2', color: C['Speed & Agility'] },
    { id: 'm3', title: 'Tackle Football Camp (5th-6th) Day 2', date: new Date(year, month, 5), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm4', title: 'Flag Football Intro Clinic (3rd-4th)', date: new Date(year, month, 5), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] },
    { id: 'm5', title: 'Tackle Football Camp (5th-6th) Day 3', date: new Date(year, month, 6), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm6', title: 'Cheer Summer Camp (Day 1)', date: new Date(year, month, 6), time: '5:00 PM', endTime: '7:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
    { id: 'm7', title: 'Cheer Summer Camp (Day 2)', date: new Date(year, month, 7), time: '5:00 PM', endTime: '7:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
    { id: 'm8', title: 'Board Meeting', date: new Date(year, month, 7), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'm9', title: 'Cheer Summer Camp (Day 3)', date: new Date(year, month, 8), time: '5:00 PM', endTime: '7:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
    { id: 'm10', title: 'Flag Football Jamboree (3rd-4th)', date: new Date(year, month, 9), time: '9:00 AM', endTime: '12:00 PM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Fields', color: C['Flag Football Clinic'] },
  );

  // --- WEEK 2 (Mon 5/11 - Sat 5/16) ---
  events.push(
    { id: 'm11', title: 'Tackle Football Camp (3rd-4th) Day 1', date: new Date(year, month, 11), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm12', title: 'Speed & Agility Clinic (All Ages)', date: new Date(year, month, 11), time: '5:30 PM', endTime: '7:00 PM', sport: 'Speed & Agility', type: 'event', location: 'Pioneer Park Field 2', color: C['Speed & Agility'] },
    { id: 'm13', title: 'Tackle Football Camp (3rd-4th) Day 2', date: new Date(year, month, 12), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm14', title: 'Coach Certification Workshop', date: new Date(year, month, 12), time: '6:00 PM', endTime: '8:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'm15', title: 'Tackle Football Camp (3rd-4th) Day 3', date: new Date(year, month, 13), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm16', title: 'QB & Receiver Clinic (5th-6th)', date: new Date(year, month, 13), time: '5:30 PM', endTime: '7:30 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 2', color: C['Football Camp'] },
    { id: 'm17', title: 'Equipment Fitting Day (All Teams)', date: new Date(year, month, 14), time: '10:00 AM', endTime: '2:00 PM', sport: 'Club Admin', type: 'event', location: 'Storage Building', color: C['Club Admin'] },
  );
  // Today (5/15)
  events.push(
    { id: 'm18', title: 'Summer Coaches Meeting', date: new Date(year, month, 15), time: '6:00 PM', endTime: '7:30 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'm19', title: 'Flag Football Clinic (3rd-4th)', date: new Date(year, month, 15), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] },
  );
  events.push(
    { id: 'm20', title: 'Lineman Camp (5th-6th)', date: new Date(year, month, 16), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm21', title: 'Cheer Tryout Prep Clinic', date: new Date(year, month, 16), time: '10:00 AM', endTime: '12:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
  );

  // --- WEEK 3 (Mon 5/18 - Sat 5/23) ---
  events.push(
    { id: 'm22', title: 'Speed & Agility Clinic (All Ages)', date: new Date(year, month, 18), time: '5:30 PM', endTime: '7:00 PM', sport: 'Speed & Agility', type: 'event', location: 'Pioneer Park Field 2', color: C['Speed & Agility'] },
    { id: 'm23', title: 'Fundraiser Committee', date: new Date(year, month, 18), time: '7:30 PM', endTime: '8:30 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'm24', title: 'Flag Football Clinic (3rd-4th)', date: new Date(year, month, 19), time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] },
    { id: 'm25', title: 'Defensive Skills Camp (5th-6th)', date: new Date(year, month, 20), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm26', title: 'Cheer Choreography Workshop', date: new Date(year, month, 20), time: '5:00 PM', endTime: '7:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
    { id: 'm27', title: 'Fall Registration Opens - Info Session', date: new Date(year, month, 21), time: '6:00 PM', endTime: '7:30 PM', sport: 'Club Admin', type: 'event', location: 'Community Center', color: C['Club Admin'] },
    { id: 'm28', title: 'End-of-Camp Scrimmage (5th-6th)', date: new Date(year, month, 23), time: '9:00 AM', endTime: '11:00 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'm29', title: 'Flag Football Fun Day (3rd-4th)', date: new Date(year, month, 23), time: '9:00 AM', endTime: '11:00 AM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] },
    { id: 'm30', title: 'Cheer Showcase', date: new Date(year, month, 23), time: '11:30 AM', endTime: '1:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
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

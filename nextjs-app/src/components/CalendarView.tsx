'use client';

import React, { useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import type { PersonaId } from '@/lib/persona-context';

export interface CalendarEvent {
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

export const SPORT_COLORS: Record<string, string> = {
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

// Helper to push a repeating weekly event across a date range
function repeatWeekly(
  events: CalendarEvent[], prefix: string, opts: Omit<CalendarEvent, 'id' | 'date'>,
  startDate: Date, endDate: Date, dayOfWeek: number, everyN = 1,
) {
  const d = new Date(startDate);
  // advance to first matching dayOfWeek
  while (d.getDay() !== dayOfWeek) d.setDate(d.getDate() + 1);
  let weekCount = 0;
  while (d <= endDate) {
    if (weekCount % everyN === 0) {
      events.push({ ...opts, id: `${prefix}-${events.length}`, date: new Date(d) });
    }
    d.setDate(d.getDate() + 7);
    weekCount++;
  }
}

export const alexOpponents = ['Westview', 'Eastside', 'Central', 'North Platte', 'Elkhorn', 'Millard North', 'Papillion', 'Bellevue', 'Ralston', 'Burke'];
const mariaOpponents = ['Omaha Wolves', 'Bellevue Bears', 'Papillion Hawks', 'Ralston Raiders', 'Elkhorn Eagles', 'Millard Mustangs', 'Gretna Grizzlies', 'Blair Bears', 'Bennington Badgers', 'Waverly Vikings'];

function generateAlexEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const C = SPORT_COLORS;

  // ===== MAY & JUNE: Summer camps, clinics, open gyms =====
  const summerStart = new Date(2026, 4, 4);  // May 4
  const summerEnd = new Date(2026, 6, 24);   // July 24

  // S&C open 3x/week (Mon, Wed, Fri)
  repeatWeekly(events, 'asc', { title: 'Strength & Conditioning (Open)', time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] }, summerStart, summerEnd, 1);
  repeatWeekly(events, 'asc', { title: 'Strength & Conditioning (Open)', time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] }, summerStart, summerEnd, 3);
  repeatWeekly(events, 'asc', { title: 'Strength & Conditioning (Open)', time: '7:00 AM', endTime: '8:30 AM', sport: 'Strength & Conditioning', type: 'practice', location: 'Weight Room', color: C['Strength & Conditioning'] }, summerStart, summerEnd, 5);

  // XC summer miles club (Tue, Thu)
  repeatWeekly(events, 'axc', { title: 'XC Summer Miles Club', time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] }, summerStart, summerEnd, 2);
  repeatWeekly(events, 'axc', { title: 'XC Summer Miles Club', time: '6:30 AM', endTime: '7:30 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] }, summerStart, summerEnd, 4);

  // Soccer clinic Tuesdays
  repeatWeekly(events, 'asoc', { title: 'Soccer Summer Clinic', time: '5:00 PM', endTime: '7:00 PM', sport: 'Boys Soccer', type: 'event', location: 'Soccer Complex', color: C['Boys Soccer'] }, summerStart, summerEnd, 2);

  // VB open gym Saturdays every 2 weeks
  repeatWeekly(events, 'avb', { title: 'Volleyball Open Gym', time: '9:00 AM', endTime: '11:00 AM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] }, summerStart, summerEnd, 6, 2);

  // Tennis clinic Wednesdays every 2 weeks
  repeatWeekly(events, 'atn', { title: 'Girls Tennis Clinic', time: '4:00 PM', endTime: '6:00 PM', sport: 'Girls Tennis', type: 'event', location: 'Tennis Courts', color: C['Girls Tennis'] }, summerStart, summerEnd, 3, 2);

  // Football camps (specific weeks in June)
  events.push(
    { id: 'afbc1', title: 'Football Skills Camp (Day 1)', date: new Date(2026, 4, 5), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afbc2', title: 'Football Skills Camp (Day 2)', date: new Date(2026, 4, 6), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afbc3', title: 'Football Skills Camp (Day 3)', date: new Date(2026, 4, 7), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afb7a', title: 'Football 7-on-7 Camp (Day 1)', date: new Date(2026, 5, 8), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afb7b', title: 'Football 7-on-7 Camp (Day 2)', date: new Date(2026, 5, 9), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afb7c', title: 'Football 7-on-7 Camp (Day 3)', date: new Date(2026, 5, 10), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afblc1', title: 'Football Lineman Camp (Day 1)', date: new Date(2026, 5, 22), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afblc2', title: 'Football Lineman Camp (Day 2)', date: new Date(2026, 5, 23), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afbqb1', title: 'QB & Receiver Camp (Day 1)', date: new Date(2026, 6, 6), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afbqb2', title: 'QB & Receiver Camp (Day 2)', date: new Date(2026, 6, 7), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
    { id: 'afbqb3', title: 'QB & Receiver Camp (Day 3)', date: new Date(2026, 6, 8), time: '8:00 AM', endTime: '11:00 AM', sport: 'Football', type: 'event', location: 'Memorial Stadium', color: C['Football'] },
  );

  // VB summer camp in June
  events.push(
    { id: 'avbcamp1', title: 'Volleyball Summer Camp (Day 1)', date: new Date(2026, 5, 15), time: '9:00 AM', endTime: '12:00 PM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'avbcamp2', title: 'Volleyball Summer Camp (Day 2)', date: new Date(2026, 5, 16), time: '9:00 AM', endTime: '12:00 PM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'avbcamp3', title: 'Volleyball Summer Camp (Day 3)', date: new Date(2026, 5, 17), time: '9:00 AM', endTime: '12:00 PM', sport: 'Girls Volleyball', type: 'event', location: 'Main Gym', color: C['Girls Volleyball'] },
  );

  // AD meetings (biweekly Mon)
  repeatWeekly(events, 'aadm', { title: 'AD Staff Meeting', time: '9:00 AM', endTime: '10:00 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] }, summerStart, summerEnd, 1, 2);

  // One-off admin events
  events.push(
    { id: 'aboost', title: 'Booster Club Meeting', date: new Date(2026, 4, 11), time: '6:00 PM', endTime: '7:00 PM', sport: 'AD Admin', type: 'meeting', location: 'Library', color: C['AD Admin'] },
    { id: 'ansaa', title: 'NSAA Compliance Call', date: new Date(2026, 4, 14), time: '10:00 AM', endTime: '11:00 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] },
    { id: 'aparent', title: 'Fall Sports Parent Info Night', date: new Date(2026, 6, 16), time: '6:30 PM', endTime: '8:00 PM', sport: 'AD Admin', type: 'event', location: 'Auditorium', color: C['AD Admin'] },
  );

  // ===== AUGUST: Preseason / Tryouts (Aug 3 - Aug 21) =====
  const preStart = new Date(2026, 7, 3);
  const preEnd = new Date(2026, 7, 21);

  // Football practice daily M-F
  for (let dow = 1; dow <= 5; dow++) {
    repeatWeekly(events, 'afbpre', { title: 'Football - Preseason Practice', time: '7:00 AM', endTime: '10:00 AM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: C['Football'] }, preStart, preEnd, dow);
  }
  // VB tryouts week 1, practice after
  events.push(
    { id: 'avbtry1', title: 'Volleyball Tryouts (Day 1)', date: new Date(2026, 7, 3), time: '3:00 PM', endTime: '5:00 PM', sport: 'Girls Volleyball', type: 'tryout', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'avbtry2', title: 'Volleyball Tryouts (Day 2)', date: new Date(2026, 7, 4), time: '3:00 PM', endTime: '5:00 PM', sport: 'Girls Volleyball', type: 'tryout', location: 'Main Gym', color: C['Girls Volleyball'] },
    { id: 'avbtry3', title: 'Volleyball Tryouts (Day 3)', date: new Date(2026, 7, 5), time: '3:00 PM', endTime: '5:00 PM', sport: 'Girls Volleyball', type: 'tryout', location: 'Main Gym', color: C['Girls Volleyball'] },
  );
  repeatWeekly(events, 'avbpre', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, new Date(2026, 7, 10), preEnd, 1);
  repeatWeekly(events, 'avbpre', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, new Date(2026, 7, 10), preEnd, 3);
  repeatWeekly(events, 'avbpre', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, new Date(2026, 7, 10), preEnd, 5);

  // Soccer tryouts
  events.push(
    { id: 'asoctry1', title: 'Boys Soccer Tryouts (Day 1)', date: new Date(2026, 7, 10), time: '4:00 PM', endTime: '6:00 PM', sport: 'Boys Soccer', type: 'tryout', location: 'Soccer Complex', color: C['Boys Soccer'] },
    { id: 'asoctry2', title: 'Boys Soccer Tryouts (Day 2)', date: new Date(2026, 7, 11), time: '4:00 PM', endTime: '6:00 PM', sport: 'Boys Soccer', type: 'tryout', location: 'Soccer Complex', color: C['Boys Soccer'] },
  );
  // Tennis tryouts
  events.push(
    { id: 'atntry1', title: 'Girls Tennis Tryouts', date: new Date(2026, 7, 10), time: '3:00 PM', endTime: '5:00 PM', sport: 'Girls Tennis', type: 'tryout', location: 'Tennis Courts', color: C['Girls Tennis'] },
  );
  // XC preseason M-F
  for (let dow = 1; dow <= 5; dow++) {
    repeatWeekly(events, 'axcpre', { title: 'Cross Country - Preseason Run', time: '6:30 AM', endTime: '8:00 AM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] }, preStart, preEnd, dow);
  }
  events.push(
    { id: 'afbscrim', title: 'Football - Preseason Scrimmage', date: new Date(2026, 7, 21), time: '7:00 PM', endTime: '9:00 PM', sport: 'Football', type: 'game', location: 'Memorial Stadium', color: C['Football'] },
  );

  // ===== FALL SEASON: Aug 28 - Nov 28 =====
  const fallStart = new Date(2026, 7, 28);  // Aug 28
  const fallEnd = new Date(2026, 10, 28);   // Nov 28

  // Football practices (Mon, Wed) + games (Fri)
  repeatWeekly(events, 'afbp', { title: 'Football - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: C['Football'] }, fallStart, fallEnd, 1);
  repeatWeekly(events, 'afbp', { title: 'Football - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Football', type: 'practice', location: 'Memorial Stadium', color: C['Football'] }, fallStart, fallEnd, 3);
  // Football Friday games removed — populated via AI schedule import demo

  // Boys Soccer practices (Mon, Wed, Thu) + games (Tue, Sat)
  repeatWeekly(events, 'asocp', { title: 'Boys Soccer - Practice', time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: C['Boys Soccer'] }, fallStart, fallEnd, 1);
  repeatWeekly(events, 'asocp', { title: 'Boys Soccer - Practice', time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: C['Boys Soccer'] }, fallStart, fallEnd, 3);
  repeatWeekly(events, 'asocp', { title: 'Boys Soccer - Practice', time: '4:00 PM', endTime: '5:45 PM', sport: 'Boys Soccer', type: 'practice', location: 'Soccer Complex', color: C['Boys Soccer'] }, fallStart, fallEnd, 4);
  // Soccer games removed — populated via AI schedule import demo

  // XC practices (Mon-Fri) + meets (Sat every 2 weeks)
  for (let dow = 1; dow <= 5; dow++) {
    repeatWeekly(events, 'axcp', { title: 'Cross Country - Practice', time: '3:30 PM', endTime: '5:00 PM', sport: 'Cross Country', type: 'practice', location: 'Trails / City Park', color: C['Cross Country'] }, fallStart, new Date(2026, 9, 31), dow);
  }
  const xcMeetNames = ['Pioneers Park Invitational', 'Elkhorn Invite', 'Heartland Conference Meet', 'Millard Invite', 'District Meet', 'State Qualifier'];
  const xcMeetLocs = ['Pioneers Park', 'Elkhorn Country Club', 'Walnut Creek', 'Millard West', 'Chalco Hills', 'Kearney Country Club'];
  let xcI = 0;
  repeatWeekly(events, 'axcm', { title: '', time: '8:00 AM', endTime: '12:00 PM', sport: 'Cross Country', type: 'game', location: '', color: C['Cross Country'] }, fallStart, new Date(2026, 9, 31), 6, 2);
  // patch XC meet titles
  events.filter(e => e.id.startsWith('axcm')).forEach((e, i) => {
    e.title = xcMeetNames[i % xcMeetNames.length];
    e.location = xcMeetLocs[i % xcMeetLocs.length];
  });

  // VB practices (Mon, Wed, Fri) + matches (Tue, Thu alternating)
  repeatWeekly(events, 'avbp', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, fallStart, fallEnd, 1);
  repeatWeekly(events, 'avbp', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, fallStart, fallEnd, 3);
  repeatWeekly(events, 'avbp', { title: 'Volleyball - Practice', time: '3:30 PM', endTime: '5:30 PM', sport: 'Girls Volleyball', type: 'practice', location: 'Main Gym', color: C['Girls Volleyball'] }, fallStart, fallEnd, 5);
  // VB matches + tournament removed — populated via AI schedule import demo

  // Tennis practices (Mon, Wed) + duals/invites
  repeatWeekly(events, 'atnp', { title: 'Girls Tennis - Practice', time: '3:30 PM', endTime: '5:00 PM', sport: 'Girls Tennis', type: 'practice', location: 'Tennis Courts', color: C['Girls Tennis'] }, fallStart, new Date(2026, 9, 17), 1);
  repeatWeekly(events, 'atnp', { title: 'Girls Tennis - Practice', time: '3:30 PM', endTime: '5:00 PM', sport: 'Girls Tennis', type: 'practice', location: 'Tennis Courts', color: C['Girls Tennis'] }, fallStart, new Date(2026, 9, 17), 3);
  const tnThur: Date[] = [];
  const tt = new Date(fallStart);
  while (tt.getDay() !== 4) tt.setDate(tt.getDate() + 1);
  for (let g = 0; g < 6 && tt <= new Date(2026, 9, 17); g++) { tnThur.push(new Date(tt)); tt.setDate(tt.getDate() + 14); }
  tnThur.forEach((d, i) => {
    const opp = alexOpponents[(i + 1) % alexOpponents.length];
    events.push({ id: `atng-${i}`, title: `Tennis Dual vs. ${opp}`, date: d, time: '4:00 PM', endTime: '6:00 PM', sport: 'Girls Tennis', type: 'game', location: i % 2 === 0 ? 'Tennis Courts' : `${opp} HS`, color: C['Girls Tennis'] });
  });
  events.push({ id: 'atninv', title: 'Tennis - Conference Invitational', date: new Date(2026, 9, 3), time: '9:00 AM', endTime: '3:00 PM', sport: 'Girls Tennis', type: 'game', location: 'Mahoney Park', color: C['Girls Tennis'] });

  // AD fall meetings biweekly Mon
  repeatWeekly(events, 'aadmf', { title: 'AD Staff Meeting', time: '7:30 AM', endTime: '8:15 AM', sport: 'AD Admin', type: 'meeting', location: 'AD Office', color: C['AD Admin'] }, fallStart, fallEnd, 1, 2);
  // Booster club monthly
  events.push(
    { id: 'aboostf1', title: 'Booster Club Meeting', date: new Date(2026, 8, 14), time: '6:00 PM', endTime: '7:00 PM', sport: 'AD Admin', type: 'meeting', location: 'Library', color: C['AD Admin'] },
    { id: 'aboostf2', title: 'Booster Club Meeting', date: new Date(2026, 9, 12), time: '6:00 PM', endTime: '7:00 PM', sport: 'AD Admin', type: 'meeting', location: 'Library', color: C['AD Admin'] },
    { id: 'aboostf3', title: 'Booster Club Meeting', date: new Date(2026, 10, 9), time: '6:00 PM', endTime: '7:00 PM', sport: 'AD Admin', type: 'meeting', location: 'Library', color: C['AD Admin'] },
  );
  // Special events (keep non-game ones)
  events.push(
    { id: 'afallbanq', title: 'Fall Sports Awards Banquet', date: new Date(2026, 10, 19), time: '6:00 PM', endTime: '8:30 PM', sport: 'AD Admin', type: 'event', location: 'Auditorium', color: C['AD Admin'] },
  );

  return events;
}

function generateMariaEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const C = SPORT_COLORS;

  // ===== MAY - JULY: Summer camps, clinics =====
  const summerStart = new Date(2026, 4, 4);
  const summerEnd = new Date(2026, 6, 24);

  // Speed & agility Mondays
  repeatWeekly(events, 'msa', { title: 'Speed & Agility Clinic (All Ages)', time: '5:30 PM', endTime: '7:00 PM', sport: 'Speed & Agility', type: 'event', location: 'Pioneer Park Field 2', color: C['Speed & Agility'] }, summerStart, summerEnd, 1);

  // Flag football clinics Thursdays
  repeatWeekly(events, 'mffc', { title: 'Flag Football Clinic (3rd-4th)', time: '5:30 PM', endTime: '7:00 PM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] }, summerStart, summerEnd, 4);

  // Cheer camp Wednesdays
  repeatWeekly(events, 'mcheer', { title: 'Cheer Camp', time: '5:00 PM', endTime: '7:00 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] }, summerStart, summerEnd, 3);

  // Board meeting 1st Thursday of month
  events.push(
    { id: 'mbd1', title: 'Board Meeting', date: new Date(2026, 4, 7), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mbd2', title: 'Board Meeting', date: new Date(2026, 5, 4), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mbd3', title: 'Board Meeting', date: new Date(2026, 6, 2), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
  );

  // Tackle football camps - multi-day blocks
  events.push(
    { id: 'mtfc1a', title: 'Tackle Football Camp (5th-6th) Day 1', date: new Date(2026, 4, 5), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mtfc1b', title: 'Tackle Football Camp (5th-6th) Day 2', date: new Date(2026, 4, 6), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mtfc1c', title: 'Tackle Football Camp (5th-6th) Day 3', date: new Date(2026, 4, 7), time: '9:00 AM', endTime: '12:00 PM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mtfc2a', title: 'Tackle Football Camp (3rd-4th) Day 1', date: new Date(2026, 4, 11), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mtfc2b', title: 'Tackle Football Camp (3rd-4th) Day 2', date: new Date(2026, 4, 12), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mtfc2c', title: 'Tackle Football Camp (3rd-4th) Day 3', date: new Date(2026, 4, 13), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mdfsc', title: 'Defensive Skills Camp (5th-6th)', date: new Date(2026, 5, 15), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mqbr1', title: 'QB & Receiver Clinic (5th-6th)', date: new Date(2026, 5, 16), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 2', color: C['Football Camp'] },
    { id: 'mlinc1', title: 'Lineman Camp (5th-6th) Day 1', date: new Date(2026, 5, 29), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mlinc2', title: 'Lineman Camp (5th-6th) Day 2', date: new Date(2026, 5, 30), time: '9:00 AM', endTime: '11:30 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mcampscrim', title: 'End-of-Camp Scrimmage (5th-6th)', date: new Date(2026, 6, 18), time: '9:00 AM', endTime: '11:00 AM', sport: 'Football Camp', type: 'event', location: 'Pioneer Park Field 1', color: C['Football Camp'] },
    { id: 'mflagfun', title: 'Flag Football Fun Day (3rd-4th)', date: new Date(2026, 6, 18), time: '9:00 AM', endTime: '11:00 AM', sport: 'Flag Football Clinic', type: 'event', location: 'Pioneer Park Field 3', color: C['Flag Football Clinic'] },
  );

  // Club admin summer events
  events.push(
    { id: 'mcoach', title: 'Coach Certification Workshop', date: new Date(2026, 4, 12), time: '6:00 PM', endTime: '8:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mequip', title: 'Equipment Fitting Day (All Teams)', date: new Date(2026, 4, 14), time: '10:00 AM', endTime: '2:00 PM', sport: 'Club Admin', type: 'event', location: 'Storage Building', color: C['Club Admin'] },
    { id: 'mcoachm', title: 'Summer Coaches Meeting', date: new Date(2026, 4, 15), time: '6:00 PM', endTime: '7:30 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mfund', title: 'Fundraiser Committee', date: new Date(2026, 4, 18), time: '7:30 PM', endTime: '8:30 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mreg', title: 'Fall Registration Opens - Info Session', date: new Date(2026, 5, 18), time: '6:00 PM', endTime: '7:30 PM', sport: 'Club Admin', type: 'event', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mcheershow', title: 'Cheer Showcase', date: new Date(2026, 6, 23), time: '6:00 PM', endTime: '7:30 PM', sport: 'Cheer Camp', type: 'event', location: 'Community Center Gym', color: C['Cheer Camp'] },
  );

  // ===== AUGUST: Equipment handout, preseason practices =====
  // Equipment handout
  events.push(
    { id: 'mequipf', title: 'Equipment Handout Day (All Teams)', date: new Date(2026, 7, 1), time: '9:00 AM', endTime: '2:00 PM', sport: 'Club Admin', type: 'event', location: 'Storage Building', color: C['Club Admin'] },
  );
  // Preseason practices: 6th/5th Mon+Wed, 4th/3rd Tue+Thu, Cheer Wed
  const preStart = new Date(2026, 7, 3);
  const preEnd = new Date(2026, 7, 22);
  repeatWeekly(events, 'mpre6', { title: '6th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '6th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, preStart, preEnd, 1);
  repeatWeekly(events, 'mpre6', { title: '6th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '6th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, preStart, preEnd, 3);
  repeatWeekly(events, 'mpre5', { title: '5th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '5th Football', type: 'practice', location: 'Pioneer Park Field 2', color: C['Football Camp'] }, preStart, preEnd, 1);
  repeatWeekly(events, 'mpre5', { title: '5th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '5th Football', type: 'practice', location: 'Pioneer Park Field 2', color: C['Football Camp'] }, preStart, preEnd, 3);
  repeatWeekly(events, 'mpre4', { title: '4th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '4th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, preStart, preEnd, 2);
  repeatWeekly(events, 'mpre4', { title: '4th Grade Football - Preseason', time: '5:30 PM', endTime: '7:00 PM', sport: '4th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, preStart, preEnd, 4);
  repeatWeekly(events, 'mpre3', { title: '3rd Grade Football - Preseason', time: '5:30 PM', endTime: '6:30 PM', sport: '3rd Football', type: 'practice', location: 'Pioneer Park Field 3', color: C['Football Camp'] }, preStart, preEnd, 2);
  repeatWeekly(events, 'mpre3', { title: '3rd Grade Football - Preseason', time: '5:30 PM', endTime: '6:30 PM', sport: '3rd Football', type: 'practice', location: 'Pioneer Park Field 3', color: C['Football Camp'] }, preStart, preEnd, 4);
  repeatWeekly(events, 'mprech', { title: 'All Cheer - Preseason Practice', time: '5:00 PM', endTime: '6:30 PM', sport: 'Cheer Camp', type: 'practice', location: 'Community Center Gym', color: C['Cheer Camp'] }, preStart, preEnd, 3);
  events.push(
    { id: 'mpreboard', title: 'Board Meeting', date: new Date(2026, 7, 6), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mphoto', title: 'Photo Day (All Teams)', date: new Date(2026, 7, 15), time: '9:00 AM', endTime: '2:00 PM', sport: 'Club Admin', type: 'event', location: 'Pioneer Park', color: C['Club Admin'] },
    { id: 'mprscrim', title: 'Preseason Scrimmage (All Grades)', date: new Date(2026, 7, 22), time: '9:00 AM', endTime: '1:00 PM', sport: 'Football Camp', type: 'game', location: 'Pioneer Park Fields', color: C['Football Camp'] },
  );

  // ===== FALL SEASON: Aug 29 - Nov 14 (10-week season) =====
  const fallStart = new Date(2026, 7, 29);
  const fallEnd = new Date(2026, 10, 14);

  // Weekly practices: 6th/5th Mon+Wed, 4th/3rd Tue+Thu, Cheer Wed
  repeatWeekly(events, 'mf6p', { title: '6th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '6th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, fallStart, fallEnd, 1);
  repeatWeekly(events, 'mf6p', { title: '6th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '6th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, fallStart, fallEnd, 3);
  repeatWeekly(events, 'mf5p', { title: '5th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '5th Football', type: 'practice', location: 'Pioneer Park Field 2', color: C['Football Camp'] }, fallStart, fallEnd, 1);
  repeatWeekly(events, 'mf5p', { title: '5th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '5th Football', type: 'practice', location: 'Pioneer Park Field 2', color: C['Football Camp'] }, fallStart, fallEnd, 3);
  repeatWeekly(events, 'mf4p', { title: '4th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '4th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, fallStart, fallEnd, 2);
  repeatWeekly(events, 'mf4p', { title: '4th Grade Football - Practice', time: '5:30 PM', endTime: '7:00 PM', sport: '4th Football', type: 'practice', location: 'Pioneer Park Field 1', color: C['Football Camp'] }, fallStart, fallEnd, 4);
  repeatWeekly(events, 'mf3p', { title: '3rd Grade Football - Practice', time: '5:30 PM', endTime: '6:30 PM', sport: '3rd Football', type: 'practice', location: 'Pioneer Park Field 3', color: C['Football Camp'] }, fallStart, fallEnd, 2);
  repeatWeekly(events, 'mf3p', { title: '3rd Grade Football - Practice', time: '5:30 PM', endTime: '6:30 PM', sport: '3rd Football', type: 'practice', location: 'Pioneer Park Field 3', color: C['Football Camp'] }, fallStart, fallEnd, 4);
  repeatWeekly(events, 'mchp', { title: 'All Cheer - Practice', time: '5:00 PM', endTime: '6:30 PM', sport: 'Cheer Camp', type: 'practice', location: 'Community Center Gym', color: C['Cheer Camp'] }, fallStart, fallEnd, 3);

  // Saturday games - 8 game season, each grade plays
  const gameSats: Date[] = [];
  const gs = new Date(2026, 8, 5); // first game Sat Sep 5
  for (let g = 0; g < 8; g++) { gameSats.push(new Date(gs)); gs.setDate(gs.getDate() + 7); }
  gameSats.forEach((d, i) => {
    const opp = mariaOpponents[i % mariaOpponents.length];
    const home = i % 2 === 0;
    const loc = home ? 'Pioneer Park' : `${opp} Field`;
    // 6th grade A & B
    events.push({ id: `mf6ga-${i}`, title: `6th A vs. ${opp}`, date: d, time: '9:00 AM', endTime: '10:30 AM', sport: '6th Football', type: 'game', location: `${loc} Field 1`, color: C['Football Camp'] });
    events.push({ id: `mf6gb-${i}`, title: `6th B vs. ${opp}`, date: d, time: '10:45 AM', endTime: '12:15 PM', sport: '6th Football', type: 'game', location: `${loc} Field 1`, color: C['Football Camp'] });
    // 5th grade A & B
    events.push({ id: `mf5ga-${i}`, title: `5th A vs. ${opp}`, date: d, time: '9:00 AM', endTime: '10:30 AM', sport: '5th Football', type: 'game', location: `${loc} Field 2`, color: C['Football Camp'] });
    events.push({ id: `mf5gb-${i}`, title: `5th B vs. ${opp}`, date: d, time: '10:45 AM', endTime: '12:15 PM', sport: '5th Football', type: 'game', location: `${loc} Field 2`, color: C['Football Camp'] });
    // 4th grade A & B
    events.push({ id: `mf4ga-${i}`, title: `4th A vs. ${opp}`, date: d, time: '11:00 AM', endTime: '12:15 PM', sport: '4th Football', type: 'game', location: `${loc} Field 3`, color: C['Football Camp'] });
    events.push({ id: `mf4gb-${i}`, title: `4th B vs. ${opp}`, date: d, time: '12:30 PM', endTime: '1:45 PM', sport: '4th Football', type: 'game', location: `${loc} Field 3`, color: C['Football Camp'] });
    // 3rd grade A & B
    events.push({ id: `mf3ga-${i}`, title: `3rd A vs. ${opp}`, date: d, time: '9:00 AM', endTime: '10:00 AM', sport: '3rd Football', type: 'game', location: `${loc} Field 4`, color: C['Football Camp'] });
    events.push({ id: `mf3gb-${i}`, title: `3rd B vs. ${opp}`, date: d, time: '10:15 AM', endTime: '11:15 AM', sport: '3rd Football', type: 'game', location: `${loc} Field 4`, color: C['Football Camp'] });
    // Cheer performance
    events.push({ id: `mchg-${i}`, title: 'All Cheer - Game Day', date: d, time: '8:30 AM', endTime: '1:00 PM', sport: 'Cheer Camp', type: 'event', location: loc, color: C['Cheer Camp'] });
  });

  // Board meetings monthly
  events.push(
    { id: 'mbdf1', title: 'Board Meeting', date: new Date(2026, 8, 3), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mbdf2', title: 'Board Meeting', date: new Date(2026, 9, 1), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
    { id: 'mbdf3', title: 'Board Meeting', date: new Date(2026, 10, 5), time: '7:30 PM', endTime: '9:00 PM', sport: 'Club Admin', type: 'meeting', location: 'Community Center', color: C['Club Admin'] },
  );

  // Special events
  events.push(
    { id: 'mhomecoming', title: 'Homecoming Tailgate (All Teams)', date: new Date(2026, 9, 3), time: '10:00 AM', endTime: '2:00 PM', sport: 'Club Admin', type: 'event', location: 'Pioneer Park', color: C['Club Admin'] },
    { id: 'mcheercomp', title: 'Cheer Competition - Metro Showcase', date: new Date(2026, 9, 17), time: '1:00 PM', endTime: '5:00 PM', sport: 'Cheer Camp', type: 'game', location: 'Civic Center', color: C['Cheer Camp'] },
    { id: 'mequipret', title: 'Equipment Return Day', date: new Date(2026, 10, 21), time: '9:00 AM', endTime: '1:00 PM', sport: 'Club Admin', type: 'event', location: 'Storage Building', color: C['Club Admin'] },
    { id: 'mbanquet', title: 'End-of-Season Awards Banquet', date: new Date(2026, 10, 22), time: '5:00 PM', endTime: '7:30 PM', sport: 'Club Admin', type: 'event', location: 'Community Center', color: C['Club Admin'] },
  );

  return events;
}

export const EVENTS_BY_PERSONA: Record<PersonaId, CalendarEvent[]> = {
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
function MonthView({ year, month, events, cancelledEventIds, today }: { year: number; month: number; events: CalendarEvent[]; cancelledEventIds: Set<string>; today: Date }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
                    {dayEvents.slice(0, 3).map(ev => {
                      const isCancelled = cancelledEventIds.has(ev.id);
                      return (
                        <div key={ev.id} className={`cal-month-event ${isCancelled ? 'cal-month-event--cancelled' : ''}`} style={{ borderLeftColor: isCancelled ? '#9ca3af' : ev.color }}>
                          <span className="cal-month-event-time">{ev.time.replace(':00', '').replace(' ', '')}</span>
                          <span className={`cal-month-event-title ${isCancelled ? 'cal-month-event-title--cancelled' : ''}`}>{ev.title}</span>
                        </div>
                      );
                    })}
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
function WeekView({ weekStart, events, cancelledEventIds, today }: { weekStart: Date; events: CalendarEvent[]; cancelledEventIds: Set<string>; today: Date }) {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
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
                  {dayEvents.map(ev => {
                    const isCancelled = cancelledEventIds.has(ev.id);
                    return (
                      <div key={ev.id} className={`cal-week-event ${isCancelled ? 'cal-week-event--cancelled' : ''}`} style={{ backgroundColor: isCancelled ? '#f3f4f6' : ev.color + '18', borderLeftColor: isCancelled ? '#9ca3af' : ev.color }}>
                        <span className={`cal-week-event-title ${isCancelled ? 'cal-week-event-title--cancelled' : ''}`}>{ev.title}</span>
                        <span className="cal-week-event-time">{ev.time} - {ev.endTime}</span>
                      </div>
                    );
                  })}
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
function AgendaView({ year, month, events, cancelledEventIds, today }: { year: number; month: number; events: CalendarEvent[]; cancelledEventIds: Set<string>; today: Date }) {
  const monthEvents = events
    .filter(e => e.date.getFullYear() === year && e.date.getMonth() === month)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));

  const grouped: Record<string, CalendarEvent[]> = {};
  monthEvents.forEach(e => {
    const key = e.date.toISOString().split('T')[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

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
              {dayEvents.map(ev => {
                const isCancelled = cancelledEventIds.has(ev.id);
                return (
                  <div key={ev.id} className={`cal-agenda-event ${isCancelled ? 'cal-agenda-event--cancelled' : ''}`} style={{ borderLeftColor: isCancelled ? '#9ca3af' : ev.color }}>
                    <div className="cal-agenda-event-left">
                      <TypeDot color={isCancelled ? '#9ca3af' : ev.color} />
                      <div className="cal-agenda-event-info">
                        <span className={`cal-agenda-event-title ${isCancelled ? 'cal-agenda-event-title--cancelled' : ''}`}>{ev.title}</span>
                        <span className="cal-agenda-event-meta">{ev.location}</span>
                      </div>
                    </div>
                    <div className="cal-agenda-event-right">
                      <span className="cal-agenda-event-time">{ev.time} - {ev.endTime}</span>
                      <span className="cal-agenda-event-type">{isCancelled ? 'Cancelled' : formatEventType(ev.type)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- MAIN CALENDAR ----
interface CalendarViewProps {
  extraEvents?: CalendarEvent[];
  cancelledEventIds?: Set<string>;
  simulatedToday?: Date;
}

export default function CalendarView({ extraEvents = [], cancelledEventIds = new Set(), simulatedToday }: CalendarViewProps) {
  const { activePersona } = usePersona();
  const today = simulatedToday || new Date(2026, 4, 15);
  const [view, setView] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(today);

  // Reset calendar position when simulated today changes (chapter switch)
  React.useEffect(() => {
    setCurrentDate(today);
  }, [today.getTime()]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const events = [...EVENTS_BY_PERSONA[activePersona.id], ...extraEvents];
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
    setCurrentDate(today);
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const headerLabel = view === 'week'
    ? `${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekStart.getMonth() !== weekEnd.getMonth() ? MONTHS[weekEnd.getMonth()] + ' ' : ''}${weekEnd.getDate()}, ${year}`
    : `${MONTHS[month]} ${year}`;

  return (
    <div className="cal-container">
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="cal-nav-group">
            <button className="cal-nav-btn" onClick={prevPeriod} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="cal-today-btn" onClick={goToday}>Today</button>
            <button className="cal-nav-btn" onClick={nextPeriod} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <span className="cal-header-label">{headerLabel}</span>
        <div className="toolbar-right">
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
        {view === 'month' && <MonthView year={year} month={month} events={events} cancelledEventIds={cancelledEventIds} today={today} />}
        {view === 'week' && <WeekView weekStart={weekStart} events={events} cancelledEventIds={cancelledEventIds} today={today} />}
        {view === 'agenda' && <AgendaView year={year} month={month} events={events} cancelledEventIds={cancelledEventIds} today={today} />}
      </div>
    </div>
  );
}

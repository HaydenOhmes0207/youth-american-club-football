'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import Button from '@/components/Button';
import TeamsTable from '@/components/TeamsTable';
import TeamsGrid from '@/components/TeamsGrid';
import Toolbar from '@/components/Toolbar';
import ActionBar from '@/components/ActionBar';
import CopyTeamsModal from '@/components/CopyTeamsModal';
import ArchiveTeamsModal from '@/components/ArchiveTeamsModal';
import UpgradeModal from '@/components/UpgradeModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import NewSeasonModal from '@/components/NewSeasonModal';
import type { TeamWithStats, Season, StaffUser, RosterAthlete } from '@/lib/actions/teams';
import ConfirmTeamsDrawer from '@/components/ConfirmTeamsDrawer';
import { deleteTeams, archiveTeams, updateTeam } from '@/lib/actions/teams';
import { type EmptyStateVariant } from '@/components/EmptyState';
import Select from '@/components/Select';
import StatsBar from '@/components/StatsBar';
import { useToast } from '@/components/Toast';

// --- High School mock data uses the same TeamsTable as club ---

// --- Maryville High School sport programs (static mock data) ---
const maryvilleTeams: TeamWithStats[] = [
  { id: 'mhs-1',  title: 'Varsity Football',         sport: 'football',     gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 52, maxRosterSize: 55, ageMin: null, ageMax: null, coachCount: 8, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-2',  title: 'JV Football',              sport: 'football',     gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 44, maxRosterSize: 50, ageMin: null, ageMax: null, coachCount: 5, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-3',  title: 'Freshman Football',        sport: 'football',     gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 38, maxRosterSize: 45, ageMin: null, ageMax: null, coachCount: 4, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-4',  title: 'Varsity Basketball (M)',   sport: 'basketball',   gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 15, maxRosterSize: 15, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-5',  title: 'JV Basketball (M)',        sport: 'basketball',   gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 12, maxRosterSize: 15, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-6',  title: 'Varsity Basketball (F)',   sport: 'basketball',   gender: 'female', grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 14, maxRosterSize: 15, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-7',  title: 'JV Basketball (F)',        sport: 'basketball',   gender: 'female', grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 11, maxRosterSize: 15, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-8',  title: 'Varsity Baseball',         sport: 'baseball',     gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 22, maxRosterSize: 25, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-9',  title: 'JV Baseball',              sport: 'baseball',     gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 20, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-10', title: 'Varsity Softball',         sport: 'softball',     gender: 'female', grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 20, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-11', title: 'JV Softball',              sport: 'softball',     gender: 'female', grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 15, maxRosterSize: 18, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-12', title: 'Varsity Soccer (M)',       sport: 'soccer',       gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 22, maxRosterSize: 24, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-13', title: 'JV Soccer (M)',            sport: 'soccer',       gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 22, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-14', title: 'Varsity Soccer (F)',       sport: 'soccer',       gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 20, maxRosterSize: 24, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-15', title: 'JV Soccer (F)',            sport: 'soccer',       gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 16, maxRosterSize: 20, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-16', title: 'Varsity Volleyball',       sport: 'volleyball',   gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 14, maxRosterSize: 14, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-17', title: 'JV Volleyball',            sport: 'volleyball',   gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 12, maxRosterSize: 14, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-18', title: 'Varsity Wrestling',        sport: 'wrestling',    gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 22, maxRosterSize: 28, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-19', title: 'JV Wrestling',             sport: 'wrestling',    gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 24, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-20', title: 'Varsity Track & Field (M)',sport: 'track',        gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 42, maxRosterSize: 50, ageMin: null, ageMax: null, coachCount: 5, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-21', title: 'Varsity Track & Field (F)',sport: 'track',        gender: 'female', grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 38, maxRosterSize: 50, ageMin: null, ageMax: null, coachCount: 4, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-22', title: 'Varsity Cheer',            sport: 'cheer',        gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 20, maxRosterSize: 25, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-23', title: 'JV Cheer',                 sport: 'cheer',        gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 16, maxRosterSize: 20, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-24', title: 'Varsity Swimming (M)',     sport: 'swimming',     gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 28, maxRosterSize: 35, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-25', title: 'Varsity Swimming (F)',     sport: 'swimming',     gender: 'female', grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 25, maxRosterSize: 35, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-26', title: 'Varsity Ice Hockey',       sport: 'icehockey',    gender: 'male',   grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 22, maxRosterSize: 25, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-27', title: 'Varsity Lacrosse (M)',     sport: 'lacrosse',     gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 24, maxRosterSize: 28, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-28', title: 'Varsity Lacrosse (F)',     sport: 'lacrosse',     gender: 'female', grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 20, maxRosterSize: 24, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-29', title: 'Varsity Cross Country (M)',sport: 'crosscountry', gender: 'male',   grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 30, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-30', title: 'Varsity Cross Country (F)',sport: 'crosscountry', gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 15, maxRosterSize: 30, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-31', title: 'Varsity Field Hockey',     sport: 'fieldhockey',  gender: 'female', grades: 'Fall',   avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 18, maxRosterSize: 22, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-32', title: 'Varsity Golf (M)',         sport: 'golf',         gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 10, maxRosterSize: 12, ageMin: null, ageMax: null, coachCount: 1, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-33', title: 'Varsity Gymnastics',       sport: 'gymnastics',   gender: 'female', grades: 'Winter', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 14, maxRosterSize: 18, ageMin: null, ageMax: null, coachCount: 3, birthdayFrom: null, birthdayTo: null },
  { id: 'mhs-34', title: 'Varsity Tennis (M)',       sport: 'tennis',       gender: 'male',   grades: 'Spring', avatar: null, primaryColor: null, secondaryColor: null, status: 'active', tier: null, seasonId: 'season-1', rosterCount: 12, maxRosterSize: 14, ageMin: null, ageMax: null, coachCount: 2, birthdayFrom: null, birthdayTo: null },
];

function formatGender(gender: string): string {
  const genderMap: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    girls: 'Girls',
    boys: 'Boys',
    coed: 'Coed',
  };
  return genderMap[gender.toLowerCase()] || gender;
}

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface TeamsPageClientProps {
  teams: TeamWithStats[];
  seasons: Season[];
  staff: StaffUser[];
  rosterAthletes: RosterAthlete[];
  currentUser: CurrentUser | null;
  initialSeasonId?: string;
}

export default function TeamsPageClient({ teams, seasons, initialSeasonId }: TeamsPageClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { workspaceType } = useWorkspace();
  const isHighSchool = workspaceType === 'highschool';
  const activeSeason = seasons.find(s => s.isActive) || seasons[0];
  const [selectedSeasonId, setSelectedSeasonId] = useState(initialSeasonId || activeSeason?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isNewSeasonModalOpen, setIsNewSeasonModalOpen] = useState(false);
  const [isNewSeasonTransferOpen, setIsNewSeasonTransferOpen] = useState(false);
  const [teamsMenuOpen, setTeamsMenuOpen] = useState(false);
  const teamsMenuRef = useRef<HTMLDivElement>(null);
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (teamsMenuRef.current && !teamsMenuRef.current.contains(e.target as Node)) {
        setTeamsMenuOpen(false);
      }
    }
    if (teamsMenuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [teamsMenuOpen]);

  const [localTeams, setLocalTeams] = useState<TeamWithStats[]>(teams);
  const [filterGender, setFilterGender] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const selectedSeason = seasons.find(s => s.id === selectedSeasonId);

  // High school uses its own static mock data; club uses server-loaded teams
  const activeTeamPool = isHighSchool ? maryvilleTeams : localTeams;
  const seasonFilteredTeams = isHighSchool
    ? activeTeamPool
    : activeTeamPool.filter(team => team.seasonId === selectedSeasonId);

  const STATUS_ORDER: Record<string, number> = { draft: 0, active: 1, archived: 2 };

  const filteredTeams = seasonFilteredTeams.filter(team => {
    if (searchQuery.trim() && !team.title.toLowerCase().includes(searchQuery.toLowerCase()) && !team.sport.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterGender && team.gender !== filterGender) return false;
    if (filterSport && team.sport !== filterSport) return false;
    if (filterStatus && team.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99));

  const uniqueSports = Array.from(new Set(seasonFilteredTeams.map((t: { sport: string }) => t.sport).filter(Boolean)));
  const uniqueGenders = Array.from(new Set(seasonFilteredTeams.map((t: { gender: string }) => t.gender).filter(Boolean)));

  const handleTeamSelectionChange = (teamId: string, checked: boolean, index: number, shiftKey: boolean) => {
    if (shiftKey && lastClickedIndex !== null) {
      const startIndex = Math.min(lastClickedIndex, index);
      const endIndex = Math.max(lastClickedIndex, index);
      const rangeTeamIds = filteredTeams.slice(startIndex, endIndex + 1).map(team => team.id);
      if (checked) {
        setSelectedTeamIds(Array.from(new Set([...selectedTeamIds, ...rangeTeamIds])));
      } else {
        setSelectedTeamIds(selectedTeamIds.filter(id => !rangeTeamIds.includes(id)));
      }
    } else {
      if (checked) {
        setSelectedTeamIds([...selectedTeamIds, teamId]);
      } else {
        setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
      }
    }
    setLastClickedIndex(index);
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedTeamIds(filteredTeams.map(team => team.id));
    } else {
      setSelectedTeamIds([]);
      setLastClickedIndex(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedTeamIds([]);
    setLastClickedIndex(null);
  };

  const handleDeleteTeams = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTeams(selectedTeamIds);
      if (result.success) {
        setLocalTeams(prev => prev.filter(team => !selectedTeamIds.includes(team.id)));
        handleClearSelection();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      // Error handling - dialog stays open
    } finally {
      setIsDeleting(false);
    }
  };

  const getEmptyStateVariant = (): EmptyStateVariant => {
    if (searchQuery.trim() && filteredTeams.length === 0) return 'search';
    if (seasonFilteredTeams.length === 0) return 'teams-season';
    return 'teams';
  };

  const draftTeams = seasonFilteredTeams.filter((t: { status: string }) => t.status === 'draft');
  const activeTeamRows = seasonFilteredTeams.filter((t: { status: string }) => t.status === 'active');
  const totalAthletes = seasonFilteredTeams.reduce((sum: number, t: { rosterCount: number }) => sum + t.rosterCount, 0);
  const uniqueSportsCount = new Set(seasonFilteredTeams.map((t: { sport: string }) => t.sport)).size;

  return (
    <div className="teams-page">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
        <h1 style={{
          fontFamily: 'var(--u-font-body)',
          fontWeight: 700,
          fontSize: '32px',
          lineHeight: '1.2',
          letterSpacing: '0.25px',
          color: 'var(--u-color-base-foreground-contrast, #071c31)',
          margin: 0,
        }}>
          Teams
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {isHighSchool ? (
            <Button
              buttonStyle="standard"
              buttonType="primary"
              size="medium"
              onClick={() => router.push(`/teams/manage?season=${selectedSeasonId}`)}
            >
              Manage Teams
            </Button>
          ) : (
            <>
              <Button
                buttonStyle="standard"
                buttonType="secondary"
                size="medium"
                onClick={() => router.push('/teams/assignments')}
              >
                Assign Athletes
              </Button>
              <Button
                buttonStyle="standard"
                buttonType="primary"
                size="medium"
                onClick={() => router.push(`/teams/manage?season=${selectedSeasonId}`)}
              >
                Manage Teams
              </Button>
            </>
          )}

          {/* Ellipsis ⋯ */}
          <div style={{ position: 'relative' }} ref={teamsMenuRef}>
            <button
              className={`teams-ellipsis ${teamsMenuOpen ? 'teams-ellipsis--open' : ''}`}
              onClick={() => setTeamsMenuOpen((v) => !v)}
              aria-label="More actions"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="13" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {teamsMenuOpen && (
              <div className="teams-dropdown">
                <button
                  className="teams-dropdown-item"
                  onClick={() => { setTeamsMenuOpen(false); router.push('/programs/transfer'); }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8a4 4 0 0 1 6.6-3.1M12 8a4 4 0 0 1-6.6 3.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.6 3.2l2 1.8-2.1 1.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.4 12.8l-2-1.8 2.1-1.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Transfer Teams to New Season
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatsBar
        stats={isHighSchool ? [
          { label: 'Active Teams', value: activeTeamRows.length, italic: true },
          { label: 'Sports', value: uniqueSportsCount, italic: true },
          { label: 'Athletes', value: totalAthletes, italic: true },
        ] : [
          { label: 'Teams', value: filteredTeams.length, italic: true },
          { label: 'Athletes', value: totalAthletes, italic: true },
        ]}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <NewSeasonModal
        isOpen={isNewSeasonModalOpen}
        onClose={() => setIsNewSeasonModalOpen(false)}
        onTransfer={() => {
          setIsNewSeasonModalOpen(false);
          setIsNewSeasonTransferOpen(true);
        }}
        onCreateNew={() => {
          setIsNewSeasonModalOpen(false);
          router.push(`/teams/manage?season=${selectedSeasonId}`);
        }}
      />

      <CopyTeamsModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        selectedTeamIds={selectedTeamIds}
        sourceSeasonId={selectedSeasonId}
        seasons={seasons}
        onSuccess={(newTeams) => {
          setLocalTeams(prev => [...prev, ...newTeams]);
          handleClearSelection();
        }}
      />

      <CopyTeamsModal
        isOpen={isNewSeasonTransferOpen}
        onClose={() => setIsNewSeasonTransferOpen(false)}
        selectedTeamIds={localTeams.filter(t => t.seasonId === activeSeason?.id).map(t => t.id)}
        sourceSeasonId={activeSeason?.id ?? ''}
        seasons={seasons}
        defaultTargetSeasonId={selectedSeasonId}
        onSuccess={(newTeams) => {
          setLocalTeams(prev => [...prev, ...newTeams]);
          setIsNewSeasonTransferOpen(false);
        }}
      />

      <ArchiveTeamsModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        selectedCount={selectedTeamIds.length}
        seasonName={selectedSeason?.name ?? ''}
        onConfirm={async () => {
          const ids = [...selectedTeamIds];
          await archiveTeams(ids);
          setLocalTeams(prev => prev.map(t => ids.includes(t.id) ? { ...t, status: 'archived' } : t));
          showToast(`Successfully archived ${ids.length} ${ids.length === 1 ? 'team' : 'teams'}`, 'success');
          handleClearSelection();
        }}
      />

      <ConfirmTeamsDrawer
        isOpen={isConfirmDrawerOpen}
        onClose={() => setIsConfirmDrawerOpen(false)}
        onConfirm={async () => {
          const ids = [...selectedTeamIds];
          setLocalTeams(prev => prev.map(t => ids.includes(t.id) ? { ...t, status: 'active' } : t));
          setIsConfirmDrawerOpen(false);
          showToast(`${ids.length} ${ids.length === 1 ? 'team' : 'teams'} confirmed for the 2026-2027 season`, 'success');
          handleClearSelection();
        }}
        teams={activeTeamPool.filter(t => selectedTeamIds.includes(t.id))}
        seasonName={selectedSeason?.name ?? '2026-2027'}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        message={`If you delete ${selectedTeamIds.length === 1 ? 'this team' : `these ${selectedTeamIds.length} teams`}, ${selectedTeamIds.length === 1 ? "it" : "they"} can't be recovered. Do you want to continue?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteTeams}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <div className="teams-content">
        <div className="toolbar-wrapper">
          <Toolbar
            segments={[]}
            searchPlaceholder="Search teams..."
            showFilter={false}
            showExport={false}
            onSearch={(query) => setSearchQuery(query)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            extraFilters={
              <>
                <Select
                  options={[{ value: '', label: 'Sport' }, ...uniqueSports.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]}
                  value={filterSport}
                  onChange={setFilterSport}
                  placeholder="Sport"
                />
                <Select
                  options={[{ value: '', label: 'Gender' }, ...uniqueGenders.map(g => ({ value: g, label: formatGender(g) }))]}
                  value={filterGender}
                  onChange={setFilterGender}
                  placeholder="Gender"
                />
                <Select
                  options={[
                    { value: '', label: 'Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Status"
                />
                {(filterGender || filterSport || filterStatus) && (
                  <button className="filter-clear" onClick={() => { setFilterGender(''); setFilterSport(''); setFilterStatus(''); }}>
                    Clear filters
                  </button>
                )}
              </>
            }
          />
          {selectedTeamIds.length > 0 && (
            <ActionBar
              selectedCount={selectedTeamIds.length}
              showConfirm={selectedSeason?.name === '2026-2027'}
              onConfirm={() => setIsConfirmDrawerOpen(true)}
              onUpgrade={() => setIsUpgradeModalOpen(true)}
              onDuplicate={() => setIsCopyModalOpen(true)}
              onArchive={() => setIsArchiveModalOpen(true)}
              onUnarchive={async () => {
                const ids = [...selectedTeamIds];
                await Promise.all(ids.map(id => updateTeam({ id, status: 'active' })));
                setLocalTeams(prev => prev.map(t => ids.includes(t.id) ? { ...t, status: 'active' } : t));
                showToast(`${ids.length} ${ids.length === 1 ? 'team' : 'teams'} restored`, 'success');
                handleClearSelection();
              }}
              allArchived={selectedTeamIds.every(id =>
                localTeams.find(t => t.id === id)?.status === 'archived'
              )}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onClose={handleClearSelection}
              onClearSelection={handleClearSelection}
              archiveDisabled={selectedTeamIds.every(id =>
                localTeams.find(t => t.id === id)?.status === 'draft'
              )}
              upgradeDisabled={selectedTeamIds.some(id =>
                localTeams.find(t => t.id === id)?.status === 'draft'
              )}
              duplicateDisabled={selectedTeamIds.some(id =>
                localTeams.find(t => t.id === id)?.status === 'draft'
              )}
              deleteDisabled={false}
            />
          )}
        </div>
        {draftTeams.length > 0 && (
          <div className="draft-notice">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'var(--u-color-background-canvas, #eff0f0)', flexShrink: 0, marginTop: 1 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--u-color-base-foreground-subtle, #607081)' }}>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.75" fill="currentColor" />
              </svg>
            </span>
            <div>
              You have {draftTeams.length} {draftTeams.length === 1 ? 'team' : 'teams'} in draft status. Select teams below to confirm and begin the season.
            </div>
          </div>
        )}
        {viewMode === 'grid' ? (
          <TeamsGrid
            teams={filteredTeams}
            seasons={seasons}
            onTeamClick={(teamId) => router.push(`/teams/${teamId}`)}
          />
        ) : (
          <TeamsTable
            teams={filteredTeams}
            seasons={seasons}
            emptyStateVariant={getEmptyStateVariant()}
            emptyStateSeasonName={selectedSeason?.name}
            emptyStateAction={selectedSeasonId !== activeSeason?.id && seasonFilteredTeams.length === 0 ? {
              label: 'Add New Team',
              onClick: () => router.push(`/teams/manage?season=${selectedSeasonId}`),
            } : undefined}
            searchQuery={searchQuery}
            copyMode={true}
            selectedTeamIds={selectedTeamIds}
            onTeamSelectionChange={handleTeamSelectionChange}
            onSelectAllChange={handleSelectAllChange}
            onSelectAllChangeWithReset={() => {
              setLastClickedIndex(null);
              setSelectedTeamIds(filteredTeams.map(team => team.id));
            }}
            onTeamClick={(teamId) => router.push(`/teams/${teamId}`)}
          />
        )}
      </div>

      <style jsx>{`
        .teams-page {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }




        .teams-content {
          display: flex;
          flex-direction: column;
          gap: var(--u-space-one, 16px);
          width: 100%;
        }

        .draft-notice {
          display: inline-flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: var(--u-border-radius-medium, 4px);
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-200, 14px);
          color: var(--u-color-base-foreground-subtle, #607081);
          line-height: 1.5;
        }

        .toolbar-wrapper {
          position: relative;
          width: 100%;
        }

        .filter-clear {
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--u-font-body);
          font-size: var(--u-font-size-150, 12px);
          color: var(--u-color-link-foreground, #0273e3);
          padding: 0 var(--u-space-quarter, 4px);
          white-space: nowrap;
        }

        .filter-clear:hover {
          text-decoration: underline;
        }

        .teams-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 4px;
          background: var(--u-color-background-container, #fefefe);
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          flex-shrink: 0;
        }
        .teams-ellipsis:hover,
        .teams-ellipsis--open {
          background: var(--u-color-background-canvas, #eff0f0);
          border-color: var(--u-color-base-foreground-subtle, #607081);
        }
        .teams-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 224px;
          background: var(--u-color-background-container, #fefefe);
          border: 1px solid var(--u-color-line-subtle, #c4c6c8);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 4px;
        }
        .teams-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          background: none;
          border: none;
          border-radius: 5px;
          font-family: var(--u-font-body);
          font-size: 14px;
          color: var(--u-color-base-foreground, #36485c);
          cursor: pointer;
          text-align: left;
          white-space: nowrap;
          transition: background 0.1s ease;
        }
        .teams-dropdown-item:hover {
          background: var(--u-color-background-canvas, #eff0f0);
          color: var(--u-color-base-foreground-contrast, #071c31);
        }
      `}</style>
    </div>
  );
}

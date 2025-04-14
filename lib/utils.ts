// lib/utils.ts

import { GameState } from './types';

// Format time in minutes and seconds
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Calculate time elapsed in milliseconds
export function getTimeElapsed(startTime: number, endTime: number = Date.now()): number {
  return endTime - startTime;
}

// Calculate total game time including penalties in milliseconds
export function getTotalGameTime(startTime: number, endTime: number, penalties: number): number {
  const baseTime = getTimeElapsed(startTime, endTime);
  const penaltyTime = penalties * 60 * 1000; // Convert minutes to milliseconds
  return baseTime + penaltyTime;
}

// Format total game time as a string for display
export function formatTotalTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

// Save game state to localStorage
export function saveGameState(gameState: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`gameState_${gameState.teamId}`, JSON.stringify(gameState));
  }
}

// Load game state from localStorage
export function loadGameState(teamId: string): GameState | null {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem(`gameState_${teamId}`);
    if (savedState) {
      return JSON.parse(savedState) as GameState;
    }
  }
  return null;
}

// Clear game state from localStorage
export function clearGameState(teamId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`gameState_${teamId}`);
  }
}

// Check if the game is completed
export function isGameCompleted(completedChallenges: number[], totalChallenges: number): boolean {
  return completedChallenges.length === totalChallenges;
}

// Check if timer has expired
export function isTimerExpired(startTime: number, totalTime: number, penalties: number): boolean {
  const totalAllowedTime = (totalTime + penalties) * 60 * 1000; // Convert to milliseconds
  const elapsed = Date.now() - startTime;
  return elapsed >= totalAllowedTime;
}
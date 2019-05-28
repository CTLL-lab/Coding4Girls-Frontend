import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export interface BasicTeam {
  challengeVerified: boolean;
  startDate: Date;
  id: string;
  currentLevel: number;
  name: string;
  brainstormAsked: boolean;
  challengeName: string;
  helpAsked: boolean;
  challengeDescription: string;
  totalLevels: number;
  members: Array<string>;
  completed: boolean;
  reviewAsked: boolean;
  lobbyID: string;
}

export interface ITeam extends BasicTeam {
  coins: number;
  createdBy: number;
  coinsUsed: number;
  brainstormsStarted: number;
  brainstormLevel: string;
  timesHelpAsked: number;
  experience: number;
}

export class LobbyTeam implements BasicTeam {
  constructor(
    public challengeVerified: boolean,
    public startDate: Date,
    public id: string,
    public currentLevel: number,
    public name: string,
    public brainstormAsked: boolean,
    public challengeName: string,
    public helpAsked: boolean,
    public challengeDescription: string,
    public totalLevels: number,
    public members: Array<string>,
    public completed: boolean,
    public reviewAsked: boolean,
    public lobbyID: string
  ) {}
}

export class Team implements ITeam {
  constructor(
    public challengeVerified: boolean,
    public startDate: Date,
    public id: string,
    public currentLevel: number,
    public name: string,
    public brainstormAsked: boolean,
    public challengeName: string,
    public helpAsked: boolean,
    public challengeDescription: string,
    public totalLevels: number,
    public members: Array<string>,
    public completed: boolean,
    public reviewAsked: boolean,
    public coins: number,
    public createdBy: number,
    public coinsUsed: number,
    public brainstormsStarted: number,
    public lobbyID: string,
    public brainstormLevel: string,
    public timesHelpAsked: number,
    public experience: number
  ) {}
}

export interface ILevel {
  endDate: Date;
  id: string;
  passed: boolean;
  locked: boolean;
  appliedTemplate: string;
  underReview: boolean;
  hasFailedOnce: boolean;
}

export class Level implements ILevel {
  constructor(
    public endDate: Date,
    public id: string,
    public passed: boolean,
    public locked: boolean,
    public underReview: boolean,
    public appliedTemplate: string,
    public hasFailedOnce: boolean
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class LobbyTeamAdapter implements Adapter<LobbyTeam> {
  adapt(item: any): LobbyTeam {
    return new LobbyTeam(
      item.challengeverified,
      item.startdate,
      item.id,
      item.currentLevel,
      item.name,
      item.brainstormasked,
      item.challengename,
      item.helpasked,
      item.challengedescription,
      item.totalLevels,
      item.members,
      item.completed,
      item.reviewasked,
      item.lobbyid
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class TeamAdapter implements Adapter<Team> {
  adapt(item: any): Team {
    const moment = require('moment');
    return new Team(
      item.challengeverified,
      moment.utc(item.startdate).toDate(),
      item.id,
      item.currentLevel, //current Level is valid and gets updated in GetTeamDetails api.py!
      item.name,
      item.brainstormasked,
      item.challengename,
      item.helpasked,
      item.challengedescription,
      item.totalLevels,
      item.members,
      item.completed,
      item.reviewasked,
      item.coins,
      item.createdby,
      item.coinsused,
      item.brainstormstarted,
      item.lobbyid,
      item.brainstormlevel,
      item.timeshelpasked,
      item.experience
    );
  }
}
@Injectable({
  providedIn: 'root'
})
export class LevelAdapter implements Adapter<Level> {
  adapt(item: any): Level {
    const moment = require('moment');
    return new Level(
      moment.utc(item.enddate).toDate(),
      item.id,
      item.passed,
      item.locked,
      item.under_review,
      item.applied_template,
      item.has_failed_once
    );
  }
}

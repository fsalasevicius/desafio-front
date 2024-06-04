export interface Team {
  conf: string;
  createdAt: string;
  flag: string;
  name: string;
  nid: number;
  goles: number;
}

export interface Match {
  createdAt: string;
  date: string;
  fase: string;
  group: string;
  ticket: string;
  nmatch: number;
  stadium: Stadium[];
  teamA: Team[];
  teamB: Team[];
}

export interface Prediction {
  userId: User[];
  matchId: Match[];
  predictedWinner: string;
  predictedScore: [number, number]; // Array de dos números representando los goles de cada equipo
  predictedGoalDifference: number;
}

export interface User {
  dni: string;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}
export interface Stadium {
  createdAt: string;
  estado: string;
  img: string;
  localidad: string;
  name: string;
  nstadium: number;
}

export interface Team {
  _id:object;
  conf: string;
  createdAt: string;
  flag: string;
  name: string;
  nid: number;
}

export interface Match {
  _id:object;
  createdAt: string;
  date: string;
  fase: string;
  group: string;
  ticket: string;
  nmatch: number;
  stadium: Stadium;
  teamA: Team;
  teamB: Team;
  closed: boolean;
}

export interface Prediction {
  userId: User[];
  matchId: Match[];
  predictedWinner: string;
  predictedScore: [number, number]; // Array de dos números representando los goles de cada equipo
}

export interface User {
  dni: string;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
}
export interface Stadium {
  _id:object;
  createdAt: string;
  estado: string;
  img: string;
  localidad: string;
  name: string;
  nstadium: number;
}

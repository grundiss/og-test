export type Movie = {
  title: string;
  year: number;
  genres: Array<string>;
  cast: Array<string>;
};

export type ActorsIndex = {
  [actorName: string]: {
    movies: Array<Movie>;
    costars: { [starName: string]: number };
  };
};

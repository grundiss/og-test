import * as React from "react";
import { Movie, ActorsIndex } from "./app";

export function useCheckboxState(): [
  Array<any>,
  (x: any) => (event: React.ChangeEvent<HTMLInputElement>) => void
] {
  const [arr, _setArr] = React.useState([]);
  const setArr = React.useCallback(
    genre => ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      if (checked) {
        _setArr([...arr, genre]);
      } else {
        _setArr(arr.filter(g => g !== genre));
      }
    },
    [arr]
  );

  return [arr, setArr];
}

export function useDatabase(
  genreFilter: Array<string>,
  actorFilter: Array<string>,
  yearStart: number,
  yearEnd: number,
  limit: number
) {
  const _db: Array<Movie> = require("./db.json");
  const db: Array<Movie> = React.useMemo(
    () => [..._db].sort(({ title: a }, { title: b }) => (a > b ? 1 : -1)),
    []
  );
  const genresIndex = React.useMemo(
    () =>
      Array.from(
        db.reduce((acc, { genres }) => {
          genres.forEach(g => acc.add(g));

          return acc;
        }, new Set())
      ).sort(),
    [db]
  );
  const actorsIndex = React.useMemo(
    () =>
      db.reduce(
        (acc, item) => {
          item.cast.forEach(actor => {
            if (!acc[actor]) {
              acc[actor] = { movies: [], costars: {} };
            }

            acc[actor].movies.push(item);

            for (const star of item.cast) {
              if (star !== actor) {
                if (!acc[actor].costars[star]) {
                  acc[actor].costars[star] = 1;
                } else {
                  acc[actor].costars[star] += 1;
                }
              }
            }
          });

          return acc;
        },
        {} as ActorsIndex
      ),
    [db]
  );

  const [filtered, movies] = React.useMemo(() => {
    const filtered = [];
    for (const item of db) {
      const fitsByGenre =
        genreFilter.length > 0
          ? item.genres.some(genre => genreFilter.includes(genre))
          : true;
      const fitsByActor =
        actorFilter.length > 0
          ? item.cast.some(actor => actorFilter.includes(actor))
          : true;
      const fitsByYear =
        yearStart <= yearEnd
          ? item.year >= yearStart && item.year <= yearEnd
          : true;

      if (fitsByGenre && fitsByYear && fitsByActor) {
        filtered.push(item);
      }
    }
    const movies = filtered.slice(0, limit);

    return [filtered, movies];
  }, [db, genreFilter, actorFilter, yearStart, yearEnd, limit]);

  return { filtered, movies, genresIndex, actorsIndex };
}

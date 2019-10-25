import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactModal from "react-modal";
import {
  GlobalStyle,
  Layout,
  FilterPanel,
  HeaderM,
  HeaderS,
  Table,
  TableRow,
  Actor,
  LoadMore
} from "./ui";
import { useCheckboxState, useDatabase } from "./hooks";
import { ActorsIndex } from "./app";

function Filters({
  actorsIndex,
  genresIndex,
  yearStart,
  yearEnd,
  genreFilter,
  actorFilter,
  setActorFilter,
  setYearStart,
  setYearEnd,
  setGenreFilter
}: {
  actorsIndex: ActorsIndex;
  genresIndex: Array<string>;
  yearStart: number;
  yearEnd: number;
  genreFilter: Array<string>;
  actorFilter: Array<string>;
  setActorFilter: (
    x: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setGenreFilter: (
    x: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setYearStart: (x: number) => void;
  setYearEnd: (x: number) => void;
}) {
  const [shouldCutActorsList, setShouldCutActorsList] = React.useState(true);
  const actorsList = React.useMemo(() => {
    const list = Object.entries(actorsIndex).sort(
      ([_name1, { movies: aMovies }], [_name2, { movies: bMovies }]) =>
        bMovies.length > aMovies.length ? 1 : -1
    );

    if (shouldCutActorsList) {
      return list.slice(0, 30);
    } else {
      return list;
    }
  }, [shouldCutActorsList, actorsIndex]);

  return (
    <FilterPanel>
      <div>
        <HeaderS>Year</HeaderS>
        <div>
          <input
            type="number"
            value={yearStart}
            onChange={({ target: { value } }) => {
              setYearStart(parseInt(value, 10));
            }}
          />{" "}
          —{" "}
          <input
            type="number"
            value={yearEnd}
            onChange={({ target: { value } }) => {
              setYearEnd(parseInt(value, 10));
            }}
          />
        </div>
      </div>
      <div>
        <HeaderS>Genres</HeaderS>
        {genresIndex.map(genre => (
          <div key={genre as string}>
            <label>
              <input
                type="checkbox"
                onChange={setGenreFilter(genre)}
                checked={genreFilter.includes(genre)}
              />{" "}
              {genre}
            </label>
          </div>
        ))}
      </div>
      <div>
        <HeaderS>Actors</HeaderS>
        {actorsList.map(([name, { movies }]) => (
          <div key={name}>
            <label>
              <input
                type="checkbox"
                onChange={setActorFilter(name)}
                checked={actorFilter.includes(name)}
              />{" "}
              {name} ({movies.length})
            </label>
          </div>
        ))}
        {shouldCutActorsList && (
          <LoadMore
            onClick={() => {
              setShouldCutActorsList(false);
            }}
          >
            Load more actors
          </LoadMore>
        )}
      </div>
    </FilterPanel>
  );
}

function ActorDetails({
  onClose,
  actor,
  actorsIndex
}: {
  onClose: () => void;
  actor: string;
  actorsIndex: ActorsIndex;
}) {
  const costars = React.useMemo(
    () =>
      Object.entries(actorsIndex[actor].costars).sort(
        ([_name1, countA], [_name2, countB]) => countB - countA
      ),
    [actor, actorsIndex]
  );
  const movies = actorsIndex[actor].movies;

  return (
    <ReactModal isOpen onRequestClose={onClose}>
      <HeaderM>{actor}</HeaderM>
      <HeaderS>Movies ({movies.length})</HeaderS>
      {movies.map(({ title }) => title).join(", ")}
      <HeaderS>Costars</HeaderS>
      {costars.map(([name, count]) => `${name} (${count} movies)`).join(", ")}
    </ReactModal>
  );
}

function App() {
  const [limit, setLimit] = React.useState(50);
  const [genreFilter, setGenreFilter] = useCheckboxState();
  const [actorFilter, setActorFilter] = useCheckboxState();
  const [yearStart, setYearStart] = React.useState(1800);
  const [yearEnd, setYearEnd] = React.useState(2030);
  const [
    detailedInfoRequiredForActor,
    setDetailedInfoRequiredForActor
  ] = React.useState(null);
  const { genresIndex, actorsIndex, filtered, movies } = useDatabase(
    genreFilter,
    actorFilter,
    yearStart,
    yearEnd,
    limit
  );

  return (
    <div>
      <GlobalStyle />
      <Layout>
        <Filters
          actorsIndex={actorsIndex}
          genresIndex={genresIndex as Array<string>}
          yearStart={yearStart}
          yearEnd={yearEnd}
          genreFilter={genreFilter}
          actorFilter={actorFilter}
          setActorFilter={setActorFilter}
          setYearStart={setYearStart}
          setYearEnd={setYearEnd}
          setGenreFilter={setGenreFilter}
        />
        <div>
          <Table>
            <thead>
              <TableRow>
                <th>title</th>
                <th>year</th>
                <th>genres</th>
                <th>cast</th>
              </TableRow>
            </thead>
            <tbody>
              {movies.map(({ title, year, genres, cast }) => (
                <TableRow key={`${title}-${year}`}>
                  <td>{title}</td>
                  <td>{year}</td>
                  <td>
                    <ul>
                      {genres.map(genre => (
                        <li key={genre}>{genre}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {cast.map(actor => (
                        <Actor
                          key={actor}
                          onClick={() => {
                            setDetailedInfoRequiredForActor(actor);
                          }}
                        >
                          {actor}
                        </Actor>
                      ))}
                    </ul>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <div>
            <LoadMore
              onClick={() => {
                setLimit(limit + 50);
              }}
              disabled={movies.length >= filtered.length}
            >
              More
            </LoadMore>
          </div>
        </div>
      </Layout>
      {detailedInfoRequiredForActor !== null && (
        <ActorDetails
          onClose={() => {
            setDetailedInfoRequiredForActor(null);
          }}
          actor={detailedInfoRequiredForActor}
          actorsIndex={actorsIndex}
        />
      )}
    </div>
  );
}

const appElement = document.getElementById("app");
ReactModal.setAppElement(appElement);
ReactDOM.render(<App />, appElement);

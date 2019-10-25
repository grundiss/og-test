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

function App() {
  const [limit, setLimit] = React.useState(50);
  const [genreFilter, setGenreFilter] = useCheckboxState();
  const [yearStart, setYearStart] = React.useState(1800);
  const [yearEnd, setYearEnd] = React.useState(2030);
  const [
    detailedInfoRequiredForActor,
    setDetailedInfoRequiredForActor
  ] = React.useState(null);
  const { genresIndex, actorsIndex, filtered, movies } = useDatabase(
    genreFilter,
    yearStart,
    yearEnd,
    limit
  );

  return (
    <div>
      <GlobalStyle />
      <Layout>
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
              <div>
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
        </FilterPanel>
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
        <ReactModal
          isOpen
          onRequestClose={() => {
            setDetailedInfoRequiredForActor(null);
          }}
        >
          <HeaderM>{detailedInfoRequiredForActor}</HeaderM>
          <HeaderS>Movies</HeaderS>
          {actorsIndex[detailedInfoRequiredForActor].movies
            .map(({ title }) => title)
            .join(", ")}
          <HeaderS>Costars</HeaderS>
          {Object.entries(actorsIndex[detailedInfoRequiredForActor].costars)
            .map(([name, count]) => `${name} (${count} movies)`)
            .join(", ")}
        </ReactModal>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));

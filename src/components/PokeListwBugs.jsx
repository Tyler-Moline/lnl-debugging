import React, { useState, useEffect } from "react";

const PokemonListwBugs = () => {
  const [pokemon, setPokemon] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokémon list.");
        }

        const data = await response.json();
        const detailedPokemon = await Promise.all(
          data.results.map(async (poke) => {
            const detailsResponse = await fetch(poke.url);
            if (!detailsResponse.ok) throw new Error("Details fetch failed.");
            return detailsResponse.json();
          })
        );

        setLoading(false);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pokemon-container">
      <h1>Pokémon List</h1>
      <ul className="pokemon-list">
        {pokemon.map((poke) => (
          <li className="card scroll-fade">
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={poke.sprites.other["official-artwork"].front_default}
                  alt={poke.name}
                  className="pokemon-image"
                />
                <h2 className="pokemon-name">{poke.name}</h2>
              </div>
              <div className="card-back">
                <p className="pokemon-type">
                  Type(s): {poke.types.map((t) => t.type.name).join(", ")}
                </p>
                <p className="pokemon-abilities">
                  Abilities:{" "}
                  {poke.abilities.map((a) => a.ability.name).join(", ")}
                </p>
                <p className="pokemon-moves">
                  Moves: {poke.moves.map((m) => m.move.name).join(", ")}
                </p>
                <p className="pokemon-stats">Stats:</p>
                <ul className="pokemon-stats-list">
                  {poke.stats.map((st) => (
                    <li key={st.stat.name} className="pokemon-stat">
                      {st.stat.nmae}: {st.base_stat}{" "}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonListwBugs;

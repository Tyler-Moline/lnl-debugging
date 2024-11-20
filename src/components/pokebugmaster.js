import React, { useState, useEffect } from "react";

const PokemonListwBugs = () => {
  const [pokemon, setPokemon] = useState(); // Bug: Initial state is undefined instead of an empty array
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

        setPokemon(detailedPokemon); // Setting detailed data directly without separating concerns
        setLoading(false); // This might cause unexpected behavior if the data isn't fully ready
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Bug: The code doesn't handle the case where `pokemon` is undefined
  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemon.map(
          (
            poke // Bug: No `key` for list items
          ) => (
            <li>
              <h2>{poke.name}</h2>
              {/* Bug: Incorrect field access for image */}
              <img
                src={poke.sprites.other["official-artwork"].front_default}
                alt={poke.name}
              />
              {/* Bug: Potential error if types are missing */}
              <p>Type(s): {poke.types.map((t) => t.type.name).join(", ")}</p>
              {/* Bug: Map assumes `abilities` always exists */}
              <p>
                Abilities:{" "}
                {poke.abilities.map((a) => a.ability.name).join(", ")}
              </p>
              {/* Inefficiency: Displays all moves instead of a subset */}
              <p>Moves: {poke.moves.map((m) => m.move.name).join(", ")}</p>
              {/* Bug: Misspelled property access */}
              <p>Stats:</p>
              <ul>
                {poke.stats.map((st) => (
                  <li>
                    {st.stat.nmae}: {st.base_stat}{" "}
                    {/* Bug: Typo in property `nmae` */}
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default PokemonListwBugs;

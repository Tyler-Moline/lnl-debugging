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

        setPokemon(detailedPokemon);
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
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemon.map((poke) => (
          <li>
            <h2>{poke.name}</h2>
            <img
              src={poke.sprites.other["official-artwork"].front_default}
              alt={poke.name}
            />
            <p>Type(s): {poke.types.map((t) => t.type.name).join(", ")}</p>
            <p>
              Abilities: {poke.abilities.map((a) => a.ability.name).join(", ")}
            </p>
            <p>Moves: {poke.moves.map((m) => m.move.name).join(", ")}</p>
            <p>Stats:</p>
            <ul>
              {poke.stats.map((st) => (
                <li>
                  {st.stat.nmae}: {st.base_stat}{" "}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonListwBugs;

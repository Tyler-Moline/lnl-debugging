import { useState, useEffect, useRef } from "react";

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10"
        );
        if (!response.ok) throw new Error("Failed to fetch Pokémon list.");

        const data = await response.json();
        const detailedPokemon = await Promise.all(
          data.results.map(async (poke) => {
            const detailsResponse = await fetch(poke.url);
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

  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemon.map((poke, index) => (
          <li
            key={poke.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="scroll-fade"
          >
            <div className="card">
              <div className="card-inner">
                <div className="card-front">
                  <img src={poke.sprites.front_default} alt={poke.name} />
                  <h2>{poke.name}</h2>
                </div>
                <div className="card-back">
                  <h3>Details</h3>
                  <ul>
                    <li>
                      Type(s): {poke.types.map((t) => t.type.name).join(", ")}
                    </li>
                    <li>
                      Abilities:{" "}
                      {poke.abilities.map((a) => a.ability.name).join(", ")}
                    </li>
                    <li>
                      Moves:{" "}
                      {poke.moves
                        .slice(0, 3)
                        .map((m) => m.move.name)
                        .join(", ")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;

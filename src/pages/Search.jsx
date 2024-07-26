import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Search = () => {
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get("query") || "";

        const fetchPokemon = async () => {
            setLoading(true); // Set loading to true before starting the fetch

            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon");
                const data = await response.json();

                const matchedPokemon = data.results.filter((pokemon) =>
                    pokemon.name.toLowerCase().includes(query.toLowerCase())
                );

                const detailedPokemon = await Promise.all(
                    matchedPokemon.map(async (pokemon) => {
                        const detailsResponse = await fetch(pokemon.url);
                        const details = await detailsResponse.json();
                        return {
                            name: details.name,
                            image: details.sprites.front_default,
                        };
                    })
                );

                setFilteredPokemon(detailedPokemon);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
                setFilteredPokemon([]);
            } finally {
                setLoading(false); // Set loading to false after the fetch operation is complete
            }
        };

        if (query) {
            fetchPokemon();
        } else {
            setLoading(false); // If there's no query, set loading to false
        }
    }, [location.search]);

    return (
        <div className="bg-slate-100">
            <div className="p-10 mx-auto lg:max-w-6xl md:max-w-4xl sm:max-w-full min-h-screen">
                <h2 className="text-4xl font-normal text-gray-800 mb-12 text-center">Search Results</h2>

                {loading ? (
                    <p className="text-xl font-bold text-gray-700 text-center">Data is loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                        {filteredPokemon.length > 0 ? (
                            filteredPokemon.map((pokemon) => (
                                <div key={pokemon.name} className="bg-white rounded-lg shadow-md p-4">
                                    <img
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        className="w-full h-32 object-contain mb-4"
                                    />
                                    <h3 className="text-xl font-bold text-gray-700 capitalize text-center">
                                        {pokemon.name}
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <p className="text-xl font-bold text-gray-700 text-center">No data found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;

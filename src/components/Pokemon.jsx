import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Pokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true); // Set loading to true before fetching

            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=21");
                const data = await response.json();

                const detailedPokemon = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const detailsResponse = await fetch(pokemon.url);
                        const details = await detailsResponse.json();
                        return {
                            name: pokemon.name,
                            image: details.sprites.front_default,
                        };
                    })
                );

                setPokemon(detailedPokemon);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
                setPokemon([]);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchPokemon();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="bg-slate-100">
            <div className="p-10 mx-auto lg:max-w-6xl md:max-w-4xl sm:max-w-full">
                <h2 className="text-4xl font-normal text-gray-800 mb-12 text-center">Assignment Pokémon</h2>

                <div className="flex gap-4 mb-8">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Pokémon"
                        className="w-full p-2 border rounded"
                    />
                    <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">
                        Search
                    </button>
                </div>

                {loading ? (
                    <p className="text-xl font-bold text-gray-700 text-center">Data is loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                        {pokemon.length > 0 ? (
                            pokemon.map((pokemon) => (
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

export default Pokemon;

const API_KEY = "dd9316ce"; 

const container = document.getElementById("moviesContainer");

async function searchMovies() {
  const query = document.getElementById("searchInput").value;

  if (!query) {
    alert("Please enter a movie name");
    return;
  }

  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Response === "False") {
      container.innerHTML = `<p>${data.Error}</p>`;
      return;
    }

    displayMovies(data.Search);

  } catch (error) {
    container.innerHTML = "<p>Error fetching data</p>";
  }
}

function displayMovies(movies) {
  container.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");

    card.className = "bg-gray-800 p-3 rounded";

    card.innerHTML = `
      <img src="${movie.Poster}" class="w-full h-64 object-cover mb-2"/>
      <h2 class="text-lg font-bold">${movie.Title}</h2>
      <p>${movie.Year}</p>
    `;

    container.appendChild(card);
  });
}

document.getElementById("searchInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchMovies();
  }
});
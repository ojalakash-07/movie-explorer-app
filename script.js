let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

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
  container.innerHTML = "<p>No movies found</p>";
  return;
}

    displayMovies(data.Search);

  } catch (error) {
    container.innerHTML = "<p>Error fetching data</p>";
  }
}

function displayMovies(movies) {
  const year = document.getElementById("yearFilter").value;

  container.innerHTML = "";

  movies
    .filter(movie => year === "" || movie.Year === year)
    .forEach(movie => {
      const card = document.createElement("div");

      card.className = "bg-gray-800 p-3 rounded";

      card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400"}" 
        class="w-full h-64 object-cover mb-2 cursor-pointer"
        onclick="showDetails('${movie.imdbID}')"/>

      <h2 class="text-lg font-bold">${movie.Title}</h2>
      <p>${movie.Year}</p>

      <button onclick="addToFavorites('${movie.Title}', this)"
        class="mt-2 bg-green-500 px-2 py-1 rounded">
        ⭐ Add to Favorites
      </button>
      `;

      container.appendChild(card);
    });
}

document.getElementById("searchInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchMovies();
  }
});

function addToFavorites(title, btn) {
  if (!favorites.includes(title)) {
    favorites.push(title);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    btn.innerText = "✅ Added";
  } else {
    btn.innerText = "⭐ Saved";
  }
}

async function showDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
  const data = await res.json();

  const modal = document.getElementById("movieModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2 class="text-xl font-bold mb-2">${data.Title}</h2>
    <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300x400"}" class="w-full mb-2"/>
    <p><strong>Year:</strong> ${data.Year}</p>
    <p><strong>Genre:</strong> ${data.Genre}</p>
    <p><strong>Plot:</strong> ${data.Plot}</p>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
}

document.getElementById("yearFilter").addEventListener("change", () => {
  searchMovies();
});

document.getElementById("movieModal").addEventListener("click", function(e) {
  if (e.target.id === "movieModal") {
    closeModal();
  }
});
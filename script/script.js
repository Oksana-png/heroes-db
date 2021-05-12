document.addEventListener("DOMContentLoaded", () => {
  const getServer = () => {
    loaderCreate();
    return fetch("../dbHeroes.json")
      .then((responce) => {
        if (responce.status !== 200) {
          throw new Error("network status not 200");
        }
        return responce.json();
      })
      .then((responce) => {
        localStorage.setItem("data", JSON.stringify(responce));
        document.querySelector(".overlay-loader").remove();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const loaderCreate = () => {
    const loader = document.createElement("div");
    loader.classList.add("overlay-loader");
    loader.innerHTML = `
      <div class="loader">
        <div class="colu col_1"></div>
        <div class="colu col_2"></div>
        <div class="colu col_3"></div>
        <div class="colu col_4"></div>
        <div class="colu col_5"></div>
        <div class="colu col_6"></div>
        <div class="colu col_7"></div>
        <div class="colu col_8"></div>
      </div>
    `;
    document.body.append(loader);
  };
  const renderCard = (data = JSON.parse(localStorage.getItem("data"))) => {
    const result = document.querySelector(".cards");
    result.innerHTML = "";
    data.forEach((item) => {
      const {
        name,
        realName,
        actors,
        gender,
        movies = ["нет данных"],
        photo,
        status,
      } = item;
      const card = document.createElement("div");
      let movie = movies.join(", ");
      if (movie.length > 70) {
        movie = movie.split(70) + "...";
      }
      card.className = "card";
      card.innerHTML = `
      <img class="card__photo" src="${photo ? photo : "noPhoto.jpg"}"
        alt="DS_Ancient_One_Poster_cropped"/>
      <div class="card__info">
        <h2 class="card__name">${name}</h2>
        <span class="card__real-name">Actors: ${actors}</span>
        <p class="card__movies">Films: ${movie}</p>
        <span class="card__status">
          Status: <span class="card__status--text">${status}</span>
        </span>
      </div>
      `;
      result.append(card);
    });
  };
  const selectGender = (t) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const activeBlock = document.querySelectorAll(".active__option");

    activeBlock.forEach((item) => {
      item.classList.remove("active__option");
    });
    t.classList.add("active__option");
    const genderValue = t.dataset.valueG;
    const newData = data.filter((item) => {
      if (item.gender === genderValue) {
        return item;
      }
    });
    const select = document.querySelector(".choice-species");
    select.selectedIndex = 0;
    renderCard(newData);
  };
  const choiceSpecies = () => {
    const activeElems = document.querySelectorAll(".active__option");
    activeElems.forEach((item) => {
      item.classList.remove("active__option");
    });
    const select = document.querySelector(".choice-species");
    const data = JSON.parse(localStorage.getItem("data"));
    if (select.value === "") {
      renderCard();
      return;
    }
    const newSelectArr = data.filter((item) => item.species === select.value);
    renderCard(newSelectArr);
  };
  const selectLive = (t) => {
    const data = JSON.parse(localStorage.getItem("data"));
    const activeBlock = document.querySelectorAll(".active__option");
    activeBlock.forEach((item) => {
      item.classList.remove("active__option");
    });

    t.classList.add("active__option");
    const liveValue = t.dataset.valueG;
    const newData = data.filter((item) => {
      if (item.status === liveValue) {
        return item;
      }
    });
    const select = document.querySelector(".choice-species");
    select.selectedIndex = 0;
    renderCard(newData);
  };
  const init = () => {
    getServer();
    renderCard();
    document.addEventListener("click", (e) => {
      target = e.target;
      if (target.closest(".gender")) {
        if (target.closest(".active__option")) {
          target.classList.remove("active__option");
          renderCard();
          return;
        }
        selectGender(target);
      }
      if (target.closest(".select-all")) {
        const activeElems = document.querySelectorAll(".active__option");
        activeElems.forEach((item) => {
          item.classList.remove("active__option");
        });
        target.classList.add("active__option");
        renderCard();
      }
      if (target.closest(".choice-alive")) {
        if (target.closest(".active__option")) {
          target.classList.remove("active__option");
          renderCard();
          return;
        }
        selectLive(target);
      }
    });
    document.addEventListener("change", (e) => {
      target = e.target;
      if (target.closest(".choice-species")) {
        choiceSpecies();
      }
    });
  };
  init();
});

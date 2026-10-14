const urlProjets = "https://webcraft-api.vercel.app/data/projects.json";
const urlFormations = "https://webcraft-api.vercel.app/data/courses.json";

let projets = [];
let formations = [];

const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", () => {
    menu.classList.toggle("ouvert");
});

function remplirSelect(id, liste) {
    const select = document.getElementById(id);
    liste.forEach(element => {
        select.innerHTML += `<option value="${element}">${element}</option>`;
    });
}

async function chargerProjets() {
    const chargement = document.getElementById("chargement1");
    const erreur = document.getElementById("msgErreur1");

    try {
        const reponse = await fetch(urlProjets);

        if (!reponse.ok) {
            throw new Error("Erreur " + reponse.status);
        }

        const data = await reponse.json();
        console.log(data);

        projets = data.projects;
        remplirSelect("techno", data.technologies);
        remplirSelect("categorie", data.categories);
        afficherProjets(projets);

        chargement.style.display = "none";
    } catch (e) {
        chargement.style.display = "none";
        erreur.textContent = "Impossible de charger les projets, veuillez réessayer plus tard.";
        console.log(e);
    }
}

async function chargerFormations() {
    const chargement = document.getElementById("chargement2");
    const erreur = document.getElementById("msgErreur2");

    try {
        const res = await fetch(urlFormations);
        const data = await res.json();

        formations = data.courses;
        remplirSelect("categorieF", data.categories);
        remplirSelect("niveau", data.levels);
        remplirSelect("technoF", data.technologies);
        afficherFormations(formations);

        chargement.style.display = "none";
    } catch (error) {
        erreur.textContent = "Erreur : les formations n'ont pas pu être chargées.";
    }
}

function afficherProjets(liste) {
    const conteneur = document.getElementById("cartesProjets");
    conteneur.innerHTML = "";

    if (liste.length == 0) {
        conteneur.innerHTML = "<p>Aucun projet trouvé.</p>";
        return;
    }

    liste.forEach(projet => {
        const tags = projet.technologies.map(t => `<span class="tag">${t}</span>`).join("");

        conteneur.innerHTML += `
            <article class="carte">
                <img src="${projet.image}" alt="${projet.title}">
                <div class="infos">
                    <h3>${projet.title}</h3>
                    <p class="client">${projet.client}</p>
                    <p class="cat">${projet.category}</p>
                    <div class="tags">${tags}</div>
                    <div class="boutons">
                        <button class="btn-details" data-id="${projet.id}">Voir détails</button>
                    </div>
                </div>
            </article>
        `;
    });
}

function afficherFormations(liste) {
    const conteneur = document.getElementById("cartesFormations");
    conteneur.innerHTML = "";

    if (liste.length == 0) {
        conteneur.innerHTML = "<p>Aucune formation trouvée.</p>";
        return;
    }

    liste.forEach(f => {
        const tags = f.technologies.map(t => `<span class="tag">${t}</span>`).join("");
        let statut = "";

        if (f.available) {
            statut = `<span class="dispo">Disponible</span>`;
        } else {
            statut = `<span class="complet">Complet</span>`;
        }

        conteneur.innerHTML += `
            <article class="carte">
                <img src="${f.image}" alt="image formation">
                <div class="infos">
                    <h3>${f.title}</h3>
                    <p class="cat">${f.category}</p>
                    <span class="badge-niveau">${f.level}</span>
                    <div class="details-ligne">
                        <span>Durée : ${f.duration}</span>
                        <span class="prix">${f.price} €</span>
                    </div>
                    <div class="details-ligne">
                        <span>★ ${f.rating}</span>
                        <span>${f.students} étudiants</span>
                    </div>
                    <div class="tags">${tags}</div>
                    ${statut}
                    <div class="boutons">
                        <button class="btn-details" data-id="${f.id}">Voir détails</button>
                        <a href="inscription.html?formation=${f.id}" class="btn-inscrire">S'inscrire</a>
                    </div>
                </div>
            </article>
        `;
    });
}

function filtrerProjets() {
    const texte = document.getElementById("rechercheProjet").value.toLowerCase();
    const techno = document.getElementById("techno").value;
    const cat = document.getElementById("categorie").value;

    const resultat = projets.filter(p => {
        const okTexte = p.title.toLowerCase().includes(texte) || p.client.toLowerCase().includes(texte);
        const okTechno = techno == "" || p.technologies.includes(techno);
        const okCat = cat == "" || p.category == cat;
        return okTexte && okTechno && okCat;
    });

    afficherProjets(resultat);
}

function filtrerFormations() {
    const recherche = document.getElementById("rechercheFormation").value.toLowerCase();
    const categorie = document.getElementById("categorieF").value;
    const niveau = document.getElementById("niveau").value;
    const techno = document.getElementById("technoF").value;

    const resultat = formations.filter(f => {
        return f.title.includes(recherche)
            && (categorie == "" || f.category == categorie)
            && (niveau == "" || f.level == niveau)
            && (techno == "" || f.technologies.includes(techno));
    });

    afficherFormations(resultat);
}

let timer;

if (document.getElementById("cartesProjets")) {
    chargerProjets();
    chargerFormations();

    document.getElementById("rechercheProjet").addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(filtrerProjets, 300);
    });
    document.getElementById("techno").addEventListener("change", filtrerProjets);
    document.getElementById("categorie").addEventListener("change", filtrerProjets);

    document.getElementById("rechercheFormation").addEventListener("input", filtrerFormations);
    document.getElementById("categorieF").addEventListener("change", filtrerFormations);
    document.getElementById("niveau").addEventListener("change", filtrerFormations);
    document.getElementById("technoF").addEventListener("change", filtrerFormations);
}

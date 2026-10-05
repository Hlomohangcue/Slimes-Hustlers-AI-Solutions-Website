(() => {
  const projectGrid = document.getElementById("projectGrid");
  const projectStatus = document.getElementById("projectStatus");

  if (!projectGrid || !projectStatus) {
    console.error("Project portfolio could not initialize: required page elements are missing.");
    return;
  }

  function createExternalLink(label, href, className) {
    if (!href) {
      return null;
    }

    const url = new URL(href);
    if (url.protocol !== "https:") {
      throw new Error(`Unsupported project link protocol: ${url.protocol}`);
    }

    const link = document.createElement("a");
    link.className = className;
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    return link;
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "portfolio-card project-card";

    const category = document.createElement("p");
    category.className = "project-category";
    category.textContent = project.category;

    const heading = document.createElement("h3");
    heading.textContent = project.name;

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;

    const technologies = document.createElement("ul");
    technologies.className = "project-technologies";
    technologies.setAttribute("aria-label", `Technologies used in ${project.name}`);

    project.technologies.forEach((technology) => {
      const badge = document.createElement("li");
      badge.textContent = technology;
      technologies.appendChild(badge);
    });

    const actions = document.createElement("div");
    actions.className = "project-actions";

    const repositoryLink = createExternalLink(
      "View on GitHub",
      project.githubUrl,
      "button button-primary"
    );
    if (repositoryLink) {
      repositoryLink.setAttribute("aria-label", `View ${project.name} on GitHub`);
      actions.appendChild(repositoryLink);
    }

    const demoLink = createExternalLink(
      "Live Demo",
      project.demoUrl,
      "button button-outline"
    );
    if (demoLink) {
      demoLink.setAttribute("aria-label", `Open the ${project.name} live demo`);
      actions.appendChild(demoLink);
    }

    card.append(category, heading, description, technologies, actions);
    return card;
  }

  async function loadProjects() {
    try {
      const response = await fetch("data/projects.json", {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Project data request failed with status ${response.status}.`);
      }

      const projects = await response.json();
      if (!Array.isArray(projects)) {
        throw new Error("Project data must be a JSON array.");
      }

      const cards = projects.map(createProjectCard);
      projectGrid.replaceChildren(...cards);
      projectStatus.hidden = true;

      const revealTargets = [
        ...projectGrid.querySelectorAll(".project-card"),
        document.querySelector("#portfolio .section-heading")
      ].filter(Boolean);
      revealTargets.forEach((target) => target.classList.add("project-reveal"));

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
      ) {
        revealTargets.forEach((target) => target.classList.add("is-visible"));
        return;
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealTargets.forEach((target) => revealObserver.observe(target));
    } catch (error) {
      projectStatus.textContent = "Projects could not be loaded. Please visit our GitHub profile.";
      console.error("Unable to load portfolio projects:", error);
    }
  }

  loadProjects();
})();

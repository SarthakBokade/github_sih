document.addEventListener("DOMContentLoaded", function () {
  // --- (Typewriter and Scroll Animations are the same as before) ---
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    const typewriterText = "Smarter Farming, Healthier Future.";
    let i = 0;
    function typeWriter() {
      if (i < typewriterText.length) {
        typewriterElement.innerHTML += typewriterText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }
    typeWriter();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const counters = entry.target.querySelectorAll(".counter");
          counters.forEach((counter) => {
            const target = +counter.getAttribute("data-target");
            if (counter.innerText !== String(target)) {
              // Animate only if not already animated
              let count = 0;
              const updateCount = () => {
                const increment = target / 100;
                if (count < target) {
                  count += increment;
                  counter.innerText = Math.ceil(count);
                  requestAnimationFrame(updateCount);
                } else {
                  counter.innerText = target;
                }
              };
              updateCount();
            }
          });
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".content-section, .impact-card")
    .forEach((section) => {
      observer.observe(section);
    });

  // --- Chart.js Setup ---
  // We get the chart context and initialize it with empty data first.
  const ctx = document.getElementById("infectionChart").getContext("2d");
  const infectionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      datasets: [
        {
          label: "Infection Rate (%)",
          data: [], // Start with empty data
          backgroundColor: "rgba(63, 185, 80, 0.2)",
          borderColor: "rgba(63, 185, 80, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      /* ... (options are the same) ... */
    },
  });

  // --- NEW SECTION: Fetching and Updating Live Data ---
  const pesticideSavedEl = document.querySelector(
    ".dashboard-card:nth-child(2) .metric"
  );
  const infectionRateEl = document.querySelector(
    ".dashboard-card:nth-child(3) .metric"
  );

  async function updateDashboard() {
    try {
      // Fetch data from our backend API
      const response = await fetch("/api/data");
      const data = await response.json();

      // Update the metric cards with the new data
      pesticideSavedEl.innerText = `${data.pesticideSaved}%`;
      infectionRateEl.innerText = `${data.infectionRate}%`;

      // Update the chart's data and redraw it
      infectionChart.data.datasets[0].data = data.chartData;
      infectionChart.update();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // You could display an error message on the dashboard here
    }
  }

  // Call the function once immediately to load data,
  // then set it to run every 3 seconds to get live updates.
  updateDashboard();
  setInterval(updateDashboard, 3000); // 3000 milliseconds = 3 seconds
});

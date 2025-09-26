    const taskName = document.getElementById("taskName");
    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");
    const taskDesc = document.getElementById("taskDesc");
    const taskList = document.getElementById("taskList");
    function changeColorCat() {
      taskCategory.style.color = "black";
    }
    function changeColorPri() {
      taskPriority.style.color = "black";
    }
    // Load tasks from sessionStorage (only lasts until browser close)
    window.onload = () => {
      const saved = JSON.parse(sessionStorage.getItem("tasks")) || [];
      saved.forEach(t =>
        renderTask(t.name, t.category, t.priorityColor, t.priorityText, t.desc, t.done, t.date)
      );
    };

    function addTask() {
      const name = taskName.value.trim();
      if (name === "") return;

      const category = taskCategory.value;
      const priorityColor = taskPriority.value; // green / yellow / red
      const priorityText = taskPriority.options[taskPriority.selectedIndex].text; // Low / Medium / High
      const desc = taskDesc.value.trim();

      const now = new Date();
      const formatted = now.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });

      renderTask(name, category, priorityColor, priorityText, desc, false, formatted);
      saveTasks();

      // Clear inputs
      taskName.value = "";
      taskDesc.value = "";
    }

    function renderTask(name, category, priorityColor, priorityText, desc, done, date) {
      const li = document.createElement("li");
      li.className = "bg-white rounded-lg shadow p-4 border-l-4 border-" + priorityColor + "-500";

      li.innerHTML = `
        <div class="flex items-start gap-3">
          <input type="checkbox" onchange="toggleTask(this)" ${done ? "checked" : ""} 
            class="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"/>
          <div class="flex-1 ${done ? 'line-through opacity-60' : ''}">
            <h2 class="font-semibold text-gray-800">${name}</h2>
            <p class="text-sm text-gray-600">Category: ${category} | Priority: 
              <span class="text-${priorityColor}-600 font-medium">${priorityText}</span>
            </p>
            ${desc ? `<p class="text-sm text-gray-500 italic">${desc}</p>` : ""}
            <p class="text-xs text-gray-400 mt-1">🕒 ${date}</p>
          </div>
          <button onclick="deleteTask(this)" class="text-red-500 hover:text-red-700">❌</button>
        </div>
      `;

      taskList.appendChild(li);
    }

    function toggleTask(checkbox) {
      const content = checkbox.nextElementSibling;
      content.classList.toggle("line-through");
      content.classList.toggle("opacity-60");
      saveTasks();
    }

    function deleteTask(button) {
      button.closest("li").remove();
      saveTasks();
    }

    function saveTasks() {
      const tasks = [];
      taskList.querySelectorAll("li").forEach(li => {
        const name = li.querySelector("h2").innerText;
        const catText = li.querySelector("p").innerText.split("|")[0].replace("Category:", "").trim();
        const priText = li.querySelector("span").innerText.trim();
        const priColor = li.querySelector("span").classList[0].split("-")[1]; // text-green-600 → green
        const descEl = li.querySelector("p.text-sm.text-gray-500");
        const desc = descEl ? descEl.innerText : "";
        const date = li.querySelector(".text-xs").innerText.replace("🕒 ", "");
        const done = li.querySelector("input").checked;

        tasks.push({ name, category: catText, priorityColor: priColor, priorityText: priText, desc, done, date });
      });
      sessionStorage.setItem("tasks", JSON.stringify(tasks));
    }
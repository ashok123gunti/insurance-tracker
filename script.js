document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
  
    // Login PAGE logic
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const role = document.getElementById("role").value;
        localStorage.setItem("user", username);
        localStorage.setItem("role", role);
        window.location.href = role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
      });
    }
  
    // User dashboard PAGE logic
    if (role === "user" && document.getElementById("userName")) {
      document.getElementById("userName").innerText = user;
  
      const policyList = document.getElementById("policyList");
      const dummyPolicies = ["Health Insurance", "Vehicle Insurance", "Life Insurance"];
      dummyPolicies.forEach(policy => {
        const li = document.createElement("li");
        li.textContent = policy;
        policyList.appendChild(li);
      });
  
      const claimForm = document.getElementById("claimForm");
      claimForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("claimTitle").value;
        const description = document.getElementById("claimDescription").value;
        const claim = {
          user,
          title,
          description,
          status: "Submitted"
        };
        const claims = JSON.parse(localStorage.getItem("claims") || "[]");
        claims.push(claim);
        localStorage.setItem("claims", JSON.stringify(claims));
        alert("Claim submitted!");
        window.location.reload();
      });
  
      const claimList = document.getElementById("claimList");
      const userClaims = (JSON.parse(localStorage.getItem("claims")) || []).filter(c => c.user === user);
      userClaims.forEach(claim => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${claim.title}</strong>: ${claim.description} <em>[${claim.status}]</em>`;
        claimList.appendChild(li);
      });
    }
  
    // Admin dashboard PAGE logic
    if (role === "admin" && document.getElementById("adminClaimList")) {
      const adminClaimList = document.getElementById("adminClaimList");
      const claims = JSON.parse(localStorage.getItem("claims") || "[]");
      claims.forEach((claim, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${claim.title}</strong> by ${claim.user}<br>
          ${claim.description}<br>
          <label>Status:
            <select data-index="${index}">
              <option${claim.status === "Submitted" ? " selected" : ""}>Submitted</option>
              <option${claim.status === "In Review" ? " selected" : ""}>In Review</option>
              <option${claim.status === "Approved" ? " selected" : ""}>Approved</option>
              <option${claim.status === "Rejected" ? " selected" : ""}>Rejected</option>
            </select>
          </label>
        `;
        adminClaimList.appendChild(li);
      });
  
      adminClaimList.addEventListener("change", (e) => {
        if (e.target.tagName === "SELECT") {
          const claims = JSON.parse(localStorage.getItem("claims"));
          const index = e.target.dataset.index;
          claims[index].status = e.target.value;
          localStorage.setItem("claims", JSON.stringify(claims));
          alert("Status updated!");
        }
      });
    }
  });
  
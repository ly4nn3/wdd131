document.addEventListener("DOMContentLoaded", function () {
    const toast = document.getElementById("visit-toast");

    let visitCount = localStorage.getItem("visitCount") ? parseInt(localStorage.getItem("visitCount")) : 0;
    let lastVisitDate = localStorage.getItem("lastVisitDate") || "";

    const today = new Date().toISOString().split("T")[0];

    if (lastVisitDate !== today) {
        visitCount++;
        localStorage.setItem("visitCount", visitCount);
        localStorage.setItem("lastVisitDate", today);

        if (visitCount === 1) {
            toast.textContent = "Welcome to Nikki's Freeway!";
            toast.classList.add("first-visit");
        } else {
            toast.textContent = `Welcome back! You've visited ${visitCount} times.`;
            toast.classList.add("returning-visit");
        }

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }
});

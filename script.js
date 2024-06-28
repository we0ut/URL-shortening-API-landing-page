"use strict";

const formEl = document.querySelector(".s-main__form-box");
const inputEl = document.querySelector(".s-main__form-input");
const containerLinksEl = document.querySelector(".container__links");
const copyBtnEl = boxEl.querySelector(".s-stats__links-box-btn");

formEl.addEventListener("submit", async function (e) {
  e.preventDefault();
  const userLink = inputEl.value;
  if (userLink === "") {
    alert("Please enter a valid link");
  } else {
    console.log(userLink);
    try {
      const shortenedLink = await shortenLink(userLink);
      const formLink = {
        original: userLink,
        shorten: shortenedLink,
      };
      console.log(formLink);
      inputEl.value = "";
      displayItem(containerLinksEl, formLink);
    } catch (error) {
      console.error("Error shortening the link:", error);
      alert("Failed to shorten the link. Please try again.");
    }
  }
});

async function shortenLink(link) {
  const response = await fetch("https://cleanuri.com/api/v1/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: link }),
  });

  if (!response.ok) {
    throw new Error("Failed to shorten the link");
  }

  const data = await response.json();
  return data.result_url;
}

const displayItem = (boxEl, link) => {
  const html = `<div class="s-stats__links">
    <p class="s-stats__links-original">${link.original}</p>
    <div class="s-stats__links-box">
      <p class="s-stats__links-box-shorten">
        <a href="${link.shorten}" target="_blank">${link.shorten}</a>
      </p>
      <button class="s-stats__links-box-btn">Copy</button>
    </div>
  </div>`;

  boxEl.insertAdjacentHTML("afterbegin", html);
};

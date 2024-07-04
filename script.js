"use strict";

const formEl = document.querySelector(".s-main__form-box");
const inputEl = document.querySelector(".s-main__form-input");
const containerLinksEl = document.querySelector(".container__links");

formEl.addEventListener("submit", async function (e) {
  e.preventDefault();
  const userLink = inputEl.value;
  const originalPlaceholder = inputEl.placeholder;
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );

  if (userLink === "" || !urlPattern.test(userLink)) {
    inputEl.classList.add("alert");
    inputEl.placeholder = "Enter a valid link...";
    inputEl.value = "";
    setTimeout(() => {
      inputEl.classList.remove("alert");
      inputEl.placeholder = originalPlaceholder;
    }, 3000);
  } else {
    try {
      const shortenedLink = await shortenLink(userLink);
      const formLink = {
        original: truncateLink(userLink),
        shorten: shortenedLink,
      };
      inputEl.value = "";
      displayItem(containerLinksEl, formLink);
    } catch (error) {
      console.error("Error shortening the link:", error);
    }
  }
});

async function shortenLink(link) {
  const response = await fetch(
    "https://corsproxy.io/?" + "https://cleanuri.com/api/v1/shorten",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        url: link,
      }),
    }
  );

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
        ${link.shorten}
      </p>
      <button class="s-stats__links-box-btn">Copy</button>
    </div>
  </div>`;

  boxEl.insertAdjacentHTML("afterbegin", html);
};

containerLinksEl.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("s-stats__links-box-btn")) {
    const copyBtnEl = e.target;
    const shortenedLinkEl = copyBtnEl.previousElementSibling;
    const shortenedLink = shortenedLinkEl.textContent;
    handleCopyButton(copyBtnEl, shortenedLink);
  }
});

const handleCopyButton = (btn, textToCopy) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      const originalText = btn.textContent;
      btn.textContent = "Copied";
      btn.style.backgroundColor = "hsl(257, 27%, 26%)";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.disabled = false;
      }, 3000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
};

const truncateLink = (link) => {
  const mobileMaxLength = 27;
  const desktopMaxLength = 50;
  const maxLength =
    window.innerWidth <= 768 ? mobileMaxLength : desktopMaxLength;
  if (link.length > maxLength) {
    return link.slice(0, maxLength) + "...";
  }
  return link;
};

function addSpinner(elementOrId) {
  /*
    parameter can be a javascript reference to an html element
    --OR--
    if its a string, it will get the reference to the element with that ID;
  */

  let uiElement;
  if (typeof elementOrId == "string") {
    uiElement = document.getElementById(elementOrId);
  } else {
    uiElement = elementOrId;
  }
  let currentInnerHTML = uiElement.innerHTML;
  uiElement.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${currentInnerHTML}`;
  // the add spinner function returns ANOTHER FUNCTION!
  // that returned function returns the innerHTML to its original state!
  return () => {
    uiElement.innerHTML = currentInnerHTML;
  };
}

function wait(ms) {
  /*
    takes one parameter, time to wait in milliseconds(1000 = 1 second)
     */
  let { resolve, promise } = Promise.withResolvers();
  setTimeout(() => {
    resolve(true);
  }, ms);
  return promise;
}

// Utility function to format date
function formatDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [year, month, day] = dateString.split(/[T\s-]/).slice(0, 3); // Extract Y, M, D
  const localDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  const dateTimeFormat3 = new Intl.DateTimeFormat("en-US", options);
  try {
    return dateTimeFormat3.format(localDate);
  } catch (e) {
    return dateString;
  }
}
function dateStringToDateElementSetableValue(dateString) {
    // let newDate = new Date(dateString);
  // let fixedDate = `${newDate.getFullYear()}-${newDate
  //   .getMonth()
  //   .toString()
  //   .padStart(2, "0")}-${newDate.getDay().toString().padStart(2, "0")}`;
  //   console.log(fixedDate)
  // return fixedDate;
  return dateString.split("T")[0];
}

function toggleElementDisplay(element) {
  if (element.style.display == "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
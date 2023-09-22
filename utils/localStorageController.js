export function localStorageController(key, value) {
  if (arguments.length === 1) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error retrieving from local storage:", error);
      return null;
    }
  } else if (arguments.length === 2) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  } else {
    console.error("Invalid number of arguments");
  }
}

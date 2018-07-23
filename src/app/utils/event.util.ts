export function createEvent(name: string, data: any) {
  let event: CustomEvent;
  if (typeof data === "string") {
    event = new CustomEvent(name, {
      detail: data,
    });
  } else {
    event = new CustomEvent(name, {
      detail: JSON.stringify(data),
    });
  }

  window.document.dispatchEvent(event);
}
